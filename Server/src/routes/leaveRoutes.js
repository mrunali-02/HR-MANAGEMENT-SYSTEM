const express = require('express');
const { authenticate, authorizeRoles } = require('../middlewares/auth');
const asyncHandler = require('../middlewares/asyncHandler');
const validateBody = require('../middlewares/validator');
const { leaveCreateSchema } = require('../validators/leaveValidators');
const leaveController = require('../controllers/leaveController');

const router = express.Router();

router.use(authenticate);

router.get('/validate', asyncHandler(leaveController.validateLeave));
router.get('/:employeeId/balances', asyncHandler(leaveController.getBalances));
router.get('/:employeeId', asyncHandler(leaveController.getHistory));
router.post('/', validateBody(leaveCreateSchema), asyncHandler(leaveController.createLeave));

router.get('/', authorizeRoles('Admin', 'HR', 'Manager'), asyncHandler(leaveController.listLeaveRequests));
router.patch('/:id/status', authorizeRoles('Admin', 'HR', 'Manager'), asyncHandler(leaveController.updateStatus));

module.exports = router;

