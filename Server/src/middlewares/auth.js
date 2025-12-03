const admin = require('../config/firebaseAdmin');
const pool = require('../config/db');
const logger = require('../utils/logger');

async function fetchEmployeeByUid(uid) {
  const [rows] = await pool.query(
    `SELECT e.id,
            e.firebase_uid AS firebaseUid,
            e.employee_id AS employeeId,
            e.name,
            e.email,
            e.department,
            e.avatar_color AS avatarColor,
            r.name AS role,
            r.id AS roleId
     FROM employees e
     JOIN roles r ON r.id = e.role_id
     WHERE e.firebase_uid = ?
     LIMIT 1`,
    [uid]
  );
  return rows[0];
}

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'Missing Authorization header' });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    const employee = await fetchEmployeeByUid(decoded.uid);

    if (!employee) {
      logger.warn('Firebase UID %s not mapped to employees table', decoded.uid);
      return res.status(403).json({ message: 'User not provisioned in HR system' });
    }

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      ...employee
    };

    return next();
  } catch (error) {
    logger.error('Auth error', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  return next();
};

module.exports = {
  authenticate,
  authorizeRoles
};

