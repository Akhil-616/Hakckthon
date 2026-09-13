const supabase = require('../config/supabaseClient');

async function getStudentsList(filters = {}) {
  let query = supabase
    .from('students')
    .select('studentid, studentname, sectionid, sections(sectioncode, year, programmeid, programmes(programmeid, programmename))');

  if (filters.section) query = query.eq('sections.sectioncode', filters.section);
  if (filters.year) query = query.eq('sections.year', filters.year);
  if (filters.search) query = query.ilike('studentname', `%${filters.search}%`);

  const { data: students, error } = await query.order('studentname');
  if (error) throw error;

  // Filter by programme name client-side (Supabase doesn't support nested joined field filters)
  let filteredStudents = students || [];
  if (filters.programmename) {
    filteredStudents = filteredStudents.filter(s => s.sections?.programmes?.programmename === filters.programmename);
  }

  const studentIds = (filteredStudents || []).map(s => s.studentid);
  if (studentIds.length === 0) return [];

  // BATCH QUERY 1: Get all attendance summaries for all students at once
  const { data: summaries, error: summaryError } = await supabase
    .from('attendancesummary')
    .select('studentid, moduleid, totalsessions, present, late')
    .in('studentid', studentIds);
  if (summaryError) throw summaryError;

  // BATCH QUERY 2: Get all held class counts for all (moduleid, sectionid) pairs at once
  // Extract unique section IDs and module IDs
  const sectionIds = [...new Set(filteredStudents.map(s => s.sectionid).filter(Boolean))];
  const moduleIds = [...new Set((summaries || []).map(s => s.moduleid))];

  if (sectionIds.length === 0 || moduleIds.length === 0) {
    return filteredStudents.map(s => ({
      studentid: s.studentid,
      studentname: s.studentname,
      sectioncode: s.sections?.sectioncode,
      year: s.sections?.year,
      programmename: s.sections?.programmes?.programmename,
      overall: { totalHeld: 0, totalPresent: 0, attendancePercent: 0 }
    }));
  }

  // Get all sessions for these modules + sections
  const { data: sessions } = await supabase
    .from('classsessions')
    .select('sessionid, moduleid, sessionsections!inner(sectionid)')
    .in('moduleid', moduleIds)
    .in('sessionsections.sectionid', sectionIds);

  const sessionsByModuleSection = new Map();
  for (const session of sessions || []) {
    for (const link of session.sessionsections || []) {
      const key = `${session.moduleid}_${link.sectionid}`;
      if (!sessionsByModuleSection.has(key)) {
        sessionsByModuleSection.set(key, []);
      }
      sessionsByModuleSection.get(key).push(session.sessionid);
    }
  }

  // Get all held occurrences for these sessions in one query
  const allSessionIds = [...new Set([...sessionsByModuleSection.values()].flat())];
  const { data: occurrences } = allSessionIds.length > 0
    ? await supabase.from('classoccurrence').select('sessionid, occurrenceid').in('sessionid', allSessionIds).eq('status', 'Held')
    : { data: [] };

  // Build occurrence count map by sessionid
  const occurrencesBySession = new Map();
  for (const occ of occurrences || []) {
    occurrencesBySession.set(occ.sessionid, (occurrencesBySession.get(occ.sessionid) || 0) + 1);
  }

  // Build final held count map by (moduleid, sectionid)
  const heldCountMap = new Map();
  for (const [key, sessionIds] of sessionsByModuleSection.entries()) {
    let count = 0;
    for (const sid of sessionIds) {
      count += occurrencesBySession.get(sid) || 0;
    }
    heldCountMap.set(key, count);
  }

  // Group summaries by student
  const summaryByStudent = new Map();
  for (const row of summaries || []) {
    if (!summaryByStudent.has(row.studentid)) {
      summaryByStudent.set(row.studentid, []);
    }
    summaryByStudent.get(row.studentid).push(row);
  }

  // Build results using in-memory maps (no more per-student queries)
  const results = [];
  for (const s of filteredStudents) {
    const studentSummaries = summaryByStudent.get(s.studentid) || [];

    const overall = studentSummaries.reduce((acc, row) => {
      const key = `${row.moduleid}_${s.sectionid}`;
      const liveCount = heldCountMap.get(key) || 0;

      // Data integrity check
      if (liveCount !== row.totalsessions && row.totalsessions > 0) {
        console.warn(`[ADMIN DATA INTEGRITY] Student ${s.studentid} Module ${row.moduleid}: ClassOccurrence=${liveCount} AttendanceSummary=${row.totalsessions}`);
      }

      return {
        totalHeld: acc.totalHeld + liveCount,
        totalPresent: acc.totalPresent + row.present,
        totalLate: acc.totalLate + row.late
      };
    }, { totalHeld: 0, totalPresent: 0, totalLate: 0 });

    overall.attendancePercent = overall.totalHeld ? parseFloat((((overall.totalPresent + overall.totalLate) / overall.totalHeld) * 100).toFixed(1)) : 0;

    results.push({
      studentid: s.studentid,
      studentname: s.studentname,
      sectioncode: s.sections?.sectioncode,
      year: s.sections?.year,
      programmename: s.sections?.programmes?.programmename,
      overall: { totalHeld: overall.totalHeld, totalPresent: overall.totalPresent, attendancePercent: overall.attendancePercent }
    });
  }

  return results;
}

async function getCoursesList() {
  const { data, error } = await supabase
    .from('programmemodules')
    .select('offeringid, programmeid, moduleid, year, semester, credits, totalclassespersemester, programmes(programmename), modules(modulename)')
    .order('programmeid')
    .order('year')
    .order('semester');
  if (error) throw error;
  return (data || []).map(row => ({
    offeringid: row.offeringid,
    programmename: row.programmes?.programmename,
    modulename: row.modules?.modulename,
    credits: row.credits,
    year: row.year,
    semester: row.semester,
    totalclassespersemester: row.totalclassespersemester
  }));
}

async function updateCourse(offeringId, updates) {
  if (updates.semester && !['1', '2'].includes(updates.semester)) {
    throw Object.assign(new Error('Semester must be 1 or 2'), { status: 400 });
  }
  if (updates.credits && ![15, 30].includes(Number(updates.credits))) {
    throw Object.assign(new Error('Credits must be 15 or 30'), { status: 400 });
  }
  const payload = {};
  if (updates.credits !== undefined) payload.credits = Number(updates.credits);
  if (updates.semester !== undefined) payload.semester = updates.semester;
  if (updates.totalclassespersemester !== undefined) payload.totalclassespersemester = Number(updates.totalclassespersemester);

  const { data, error } = await supabase.from('programmemodules').update(payload).eq('offeringid', offeringId).select().single();
  if (error) throw error;
  return data;
}

async function listStudents() {
  const { data, error } = await supabase.from('students').select('studentid, studentname, email, sectionid, sections(sectioncode, year, programmes(programmename))').order('studentname');
  if (error) throw error;
  return data || [];
}

async function listCourses() {
  const { data, error } = await supabase.from('modules').select('moduleid, modulename, credits').order('moduleid');
  if (error) throw error;
  return data || [];
}

async function createCourse(course) {
  const { data, error } = await supabase.from('modules').insert(course).select().single();
  if (error) throw error;
  return data;
}

async function deleteCourse(moduleId) {
  const { error } = await supabase.from('modules').delete().eq('moduleid', moduleId);
  if (error) throw error;
}

async function bulkDeductClasses(filters) {
  const { deductAmount, programmename, year } = filters;
  if (!deductAmount || deductAmount < 1) {
    throw Object.assign(new Error('deductAmount must be at least 1'), { status: 400 });
  }

  let query = supabase.from('programmemodules').select('offeringid, totalclassespersemester, year, programmes(programmename)');
  if (programmename) query = query.eq('programmes.programmename', programmename);
  if (year) query = query.eq('year', year);

  const { data: offerings, error: fetchError } = await query;
  if (fetchError) throw fetchError;

  const filtered = (offerings || []).filter(o => {
    if (programmename && o.programmes?.programmename !== programmename) return false;
    return true;
  });

  let updated = 0;
  for (const offering of filtered) {
    const newTotal = Math.max(0, offering.totalclassespersemester - deductAmount);
    const { error: updateError } = await supabase
      .from('programmemodules')
      .update({ totalclassespersemester: newTotal })
      .eq('offeringid', offering.offeringid);
    if (!updateError) updated++;
  }

  return { updated };
}

module.exports = { getStudentsList, getCoursesList, updateCourse, listStudents, listCourses, createCourse, deleteCourse, bulkDeductClasses };