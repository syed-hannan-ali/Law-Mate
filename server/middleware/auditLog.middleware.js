// utils/logAudit.js
const AuditLog = require("@models/auditLog.model.js");


async function logAudit({ user, action, target, description, metadata }) {
    console.log(user)
    try {
        await AuditLog.create({
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
            action,
            target,
            description,
            metadata,
        });
    } catch (err) {
        console.error("Audit log error:", err.message);
    }
}

module.exports = logAudit;
