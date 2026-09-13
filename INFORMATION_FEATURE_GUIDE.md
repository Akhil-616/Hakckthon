# Information Feature Guide

**Last Updated:** September 13, 2026

This guide explains the new Information feature that adds Events and Important Messages to the Qubits Attendance system.

---

## Table of Contents

1. [Overview](#overview)
2. [What's New](#whats-new)
3. [Database Setup](#database-setup)
4. [Admin Workflow](#admin-workflow)
5. [Student Experience](#student-experience)
6. [Parent Experience](#parent-experience)
7. [Technical Details](#technical-details)

---

## Overview

The Information feature adds two types of communication to the system:

- **Events** — General announcements visible to everyone (students, parents, admins)
- **Important Messages** — Automated absence warnings sent to specific students

This helps admins communicate with students and parents, and automatically alerts students who are missing too many classes.

---

## What's New

### For Admins

- **Information Tab** — Create and manage events that everyone can see
- **Absence Pool Tab** — See which students need absence warnings and send them messages

### For Students

- **Important Messages Section** — Appears at the very top of the dashboard
  - Shows all events posted by admin
  - Shows absence warnings sent specifically to them
  - Can mark messages as read

### For Parents

- **Important Messages Section** — Appears at the top of their child's dashboard
  - Shows all events posted by admin
  - Shows absence warnings sent to their child
  - Read-only (cannot mark as read)

---

## Database Setup

**IMPORTANT:** You must run this SQL in your Supabase SQL Editor before the feature will work.

```sql
-- Events table: general announcements visible to all portals
CREATE TABLE public.events (
  eventid character varying NOT NULL,
  title character varying NOT NULL,
  description character varying,
  eventdate date,
  postedat timestamp without time zone NOT NULL,
  CONSTRAINT events_pkey PRIMARY KEY (eventid)
);

-- Important messages: student-specific absence notifications
CREATE TABLE public.importantmessages (
  messageid character varying NOT NULL,
  studentid character varying NOT NULL,
  moduleid character varying NOT NULL,
  messagetext character varying NOT NULL,
  absentcountatsend integer NOT NULL,
  sentat timestamp without time zone NOT NULL,
  acknowledged boolean NOT NULL DEFAULT false,
  CONSTRAINT importantmessages_pkey PRIMARY KEY (messageid),
  CONSTRAINT importantmessages_studentid_fkey FOREIGN KEY (studentid) REFERENCES public.students(studentid),
  CONSTRAINT importantmessages_moduleid_fkey FOREIGN KEY (moduleid) REFERENCES public.modules(moduleid)
);

-- Optional index for faster pool queries
CREATE INDEX idx_importantmessages_student_module ON public.importantmessages(studentid, moduleid, absentcountatsend);
```

### How to Run the Migration

1. Open your Supabase project dashboard
2. Click **SQL Editor** in the left menu
3. Click **New Query**
4. Copy and paste the SQL above
5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

The tables are now created and the feature is ready to use.

---

## Admin Workflow

### Creating Events

Events are announcements that all students and parents can see.

**Steps:**

1. Log in to Admin portal
2. Click the **Information** tab
3. In the Events section, fill out the form:
   - **Title** — Short headline (required)
   - **Description** — More details (optional)
   - **Date** — Pick a date if the event happens on a specific day (optional)
4. Click **Create Event**

The event appears immediately in all three portals (Admin, Student, Parent).

**Example Events:**

- "Campus closed tomorrow due to maintenance"
- "Final exams schedule released - check your email"
- "Student orientation on September 20th"

### Deleting Events

1. Go to Admin → Information tab
2. Find the event in the list
3. Click the **Delete** button next to it
4. The event disappears for everyone immediately

**Note:** There is no edit feature yet. To change an event, delete it and create a new one.

---

### Using the Absence Pool

The Absence Pool shows students who have **3 or more absences** in a subject and haven't been warned yet at their current absence level.

**How It Works:**

1. Click the **Absence Pool** tab in Admin
2. You'll see a list of students who need warnings
3. Each row shows:
   - Student name and ID
   - Section
   - Module name
   - Number of absences
4. Each row has a **pre-filled message** you can edit
5. Click **Send Message** to send it to that student

**Example:**

```
Student: John Doe (STU-12345) • Section: CS-Y2-A
Module: Database Systems
Absences: 5

Pre-filled message:
"John Doe has been marked Absent 5 times in Database Systems. 
Please ensure regular attendance going forward."
```

You can edit this message before sending. For example:

```
"You have 5 absences in Database Systems. You're approaching the 
attendance threshold. Please contact your lecturer if you have 
concerns."
```

### What Happens After Sending

- The message is sent to the student immediately
- That student disappears from the pool (they've been notified)
- The student sees the message at the top of their dashboard
- Parents also see the message when they log in

### Re-Entry Logic (Important!)

If a student gets MORE absences after being warned, they **come back** into the pool.

**Example:**

- Student has 3 absences → you send a message
- They disappear from the pool
- Later, they get 3 more absences (now at 6 total)
- They **reappear** in the pool with count = 6
- You can send them another message

This ensures students get reminded if their attendance keeps dropping.

### When the Pool is Empty

If no students currently need warnings, you'll see:

```
No students currently flagged
```

This is normal and means everyone either has good attendance or has already been notified at their current absence level.

---

## Student Experience

### Where Students See Messages

When a student logs into their dashboard, the **Important Messages** section appears at the very top, even before attendance stats.

### What Students See

The section is split into two parts:

#### 1. Events

All events posted by admin appear here. Students see:

- Event title
- Description (if provided)
- Date (if provided)
- How long ago it was posted

**Example:**

```
📅 Events

Campus closed tomorrow due to maintenance
Posted 2h ago

Final exams schedule released
Check your email for details
📆 September 15, 2026 • Posted 1d ago
```

#### 2. Important Messages

Absence warnings sent specifically to this student. They see:

- The module name
- The warning message
- How long ago it was sent
- A **Mark as read** button

**Example:**

```
⚠️ Important Messages

Database Systems
You have been marked Absent 5 times in Database Systems. 
Please ensure regular attendance going forward.
Sent 3h ago
[Mark as read]

Web Development
You have been marked Absent 4 times in Web Development. 
Please contact your lecturer if you need assistance.
Sent 2d ago
[Mark as read]
```

### Marking Messages as Read

When a student clicks **Mark as read**:

- The message stays visible but changes appearance (lighter background)
- This helps students track which warnings they've already seen
- Parents do NOT see the "marked as read" status

### Navigation

Students can still use the top navigation to jump to other sections:

- 📊 Overview
- 📚 Courses
- 📝 Justifications
- ℹ️ Information

The Information link scrolls to the same section they see at the top (in case they scroll past it).

---

## Parent Experience

### What Parents See

Parents see the **exact same information** as their child, with two differences:

1. **No "Mark as read" button** — Parents can only view messages
2. The section appears at the top of the dashboard, just like for students

### Navigation

Parents see:

- 📊 Overview
- 📚 Courses
- ℹ️ Information

They do NOT see the Justifications section (parents can't submit justifications).

---

## Technical Details

### API Endpoints

#### Shared (all portals)

```
GET /api/admin/events
```

Returns all events. Used by all three portals (admin, student, parent).

#### Admin Only

```
POST /api/admin/events
Body: { title, description?, eventdate? }
```

Creates a new event.

```
DELETE /api/admin/events/:eventId
```

Deletes an event.

```
GET /api/admin/absence-pool
```

Returns students with 3+ absences who need warnings.

```
POST /api/admin/absence-pool/send
Body: { studentId, moduleId, messageText, absentCountAtSend }
```

Sends an absence message to a student.

#### Student

```
GET /api/students/:studentId/messages
```

Returns all important messages for this student.

```
PATCH /api/students/:studentId/messages/:messageId/read
```

Marks a message as read.

#### Parent

```
GET /api/parents/:studentId/messages
```

Returns all important messages for this student (via parent portal).

### Database Tables

#### events

| Column      | Type      | Description                    |
| ----------- | --------- | ------------------------------ |
| eventid     | varchar   | Primary key (EVT-timestamp)    |
| title       | varchar   | Event headline (required)      |
| description | varchar   | Event details (optional)       |
| eventdate   | date      | Event date (optional)          |
| postedat    | timestamp | When the event was created     |

#### importantmessages

| Column            | Type      | Description                              |
| ----------------- | --------- | ---------------------------------------- |
| messageid         | varchar   | Primary key (MSG-timestamp)              |
| studentid         | varchar   | Foreign key to students table            |
| moduleid          | varchar   | Foreign key to modules table             |
| messagetext       | varchar   | The warning message text                 |
| absentcountatsend | integer   | Absence count when message was sent      |
| sentat            | timestamp | When the message was sent                |
| acknowledged      | boolean   | Whether student marked it as read        |

### Absence Pool Query Logic

A student appears in the pool when **ALL** of these are true:

1. `attendancesummary.totaleffectiveabsent >= 3` for a (student, module) pair
2. There is NO existing message for that (student, module) where `absentcountatsend >= current totaleffectiveabsent`

This ensures:

- Students only appear if they have 3+ absences
- Students don't appear if they've already been warned at this level
- Students **do** reappear if their absences increase beyond the last warning

**Example:**

```
Student A, Module M1:
- 3 absences → appears in pool
- Admin sends message with absentcountatsend=3
- Student disappears from pool
- Later: 6 absences → reappears in pool (6 > 3)
- Admin sends message with absentcountatsend=6
- Student disappears again
```

### Files Created

**Backend:**

- `backend/src/services/eventService.js` — Event CRUD operations
- `backend/src/services/messageService.js` — Message operations and pool query
- `backend/src/routes/adminRoutes.js` — Updated with new endpoints
- `backend/src/routes/studentRoutes.js` — Updated with new endpoints
- `backend/src/routes/parentRoutes.js` — Updated with new endpoints

**Frontend:**

- `frontend/src/components/shared/InformationPage.tsx` — Shared component for all portals
- `frontend/src/components/admin/AdminAbsencePool.tsx` — Admin pool interface
- `frontend/src/perspectives/AdminPerspective.tsx` — Updated with new tabs
- `frontend/src/components/student/StudentDashboard.tsx` — Updated with information section
- `frontend/src/components/parent/ParentDashboard.tsx` — Updated with information section

**Database:**

- `Data schema/migration_events_messages.sql` — SQL migration file

---

## Common Questions

### Q: What if I delete an event by mistake?

**A:** There's no undo. You'll need to recreate it manually. Consider copying the event details before deleting if you're unsure.

### Q: Can students reply to absence messages?

**A:** No. The system is one-way communication from admin to students. Students should contact their lecturer directly if they have questions.

### Q: What happens if a student is absent in multiple modules?

**A:** They appear in the pool **multiple times** — one row per (student, module) pair. You must send a separate message for each module.

### Q: Can I send a custom message instead of the default?

**A:** Yes! The default is just a template. Edit the message in the text box before clicking Send.

### Q: What counts as an "absence" for the pool?

**A:** The system uses `totaleffectiveabsent` from the attendance summary. This already includes the "two Lates = one Absent" rule, so you don't need to calculate anything.

### Q: Do parents get notified when a message is sent?

**A:** Not separately. Parents see the message when they log into the portal, but there's no email or SMS notification. The message appears immediately on their dashboard.

### Q: Can I see who has read their messages?

**A:** Not yet. The `acknowledged` field is stored in the database, but there's no admin view for it. This could be added in the future.

### Q: Why did a student reappear in the pool after I sent them a message?

**A:** This is normal! It means their absence count increased since you last messaged them. They're now at a higher absence count, so they need a follow-up warning.

---

## Troubleshooting

### "No students currently flagged" but I know students have absences

**Check:**

1. Are the absences recorded in `attendancesummary`?
2. Are they at **3 or more** effective absences?
3. Have they already been sent a message at this absence level?

If #3 is true, they won't appear until their absence count goes up again.

### Events not appearing for students/parents

**Check:**

1. Did you run the SQL migration?
2. Is the backend server running?
3. Open browser console (F12) and look for API errors
4. Try refreshing the page

### "Mark as read" button doesn't work

**Check:**

1. Is this the student portal? (Parent portal doesn't have this button)
2. Check browser console for errors
3. Verify the API endpoint `/api/students/:studentId/messages/:messageId/read` is responding

### Pool endpoint returns empty array but database has messages

**Check:**

1. The pool query filters out students who've already been messaged
2. Verify `attendancesummary.totaleffectiveabsent` values are correct
3. Check if messages already exist in `importantmessages` for those students

---

## Future Enhancements

Possible improvements for later versions:

- Edit events without deleting them
- Email/SMS notifications when messages are sent
- Admin view of which students have read their messages
- Bulk send (message multiple students at once)
- Message templates (save common messages for reuse)
- Filter pool by section or programme
- Schedule events to auto-post at a future date

---

## Support

If you encounter issues not covered in this guide:

1. Check the browser console (F12 → Console tab) for errors
2. Check the backend server logs
3. Verify the database tables were created correctly
4. Ensure all API endpoints are responding

For development questions, review the source files listed in the Technical Details section.

---

**End of Guide**
