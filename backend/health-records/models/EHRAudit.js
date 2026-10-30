const { db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

const recordAuditEvent = async ({ event_type, actor_id, actor_role, folder_id, share_id }) => {
  if (!db) return;
  await db.collection('ehr_audit_events').add({
    audit_id: uuidv4(),
    event_type,
    actor_id,
    actor_role,
    folder_id: folder_id || null,
    share_id: share_id || null,
    created_at: new Date().toISOString()
  });
};

module.exports = { recordAuditEvent };
