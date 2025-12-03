const express = require('express');
const employeeRoutes = require('./employeeRoutes');
const leaveRoutes = require('./leaveRoutes');
const attendanceRoutes = require('./attendanceRoutes');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));

router.use('/employees', employeeRoutes);
router.use('/leaves', leaveRoutes);
router.use('/attendance', attendanceRoutes);

// Example protected route showing role info
router.get('/me', authenticate, (req, res) => res.json({ user: req.user }));

module.exports = router;

