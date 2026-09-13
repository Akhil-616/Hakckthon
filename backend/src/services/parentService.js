const supabase = require('../config/supabaseClient');

function normalizePhone(phone) {
  return phone.replace(/\D/g, '');
}

async function findParentByPhone(phone) {
  const normalized = normalizePhone(phone);
  const { data, error } = await supabase.from('parents').select('parentid, parentname, relationtostudent, studentid, contactnumber');
  if (error) throw error;
  return (data || []).find(p => normalizePhone(p.contactnumber) === normalized);
}

module.exports = { findParentByPhone };
