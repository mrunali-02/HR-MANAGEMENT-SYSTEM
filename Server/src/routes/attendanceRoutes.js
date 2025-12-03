const express = require('express');
const { authenticate } = require('../middlewares/auth');
const asyncHandler = require('../middlewares/asyncHandler');
const attendanceController = require('../controllers/attendanceController');

const router = express.Router();

router.use(authenticate);

router.get('/me', asyncHandler(attendanceController.getMyAttendance));
router.get('/', asyncHandler(attendanceController.getSummary));

module.exports = router;

