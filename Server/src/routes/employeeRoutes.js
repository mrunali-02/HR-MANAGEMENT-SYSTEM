// server/src/routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/employeeController');

// GET /api/employees
router.get('/', ctrl.listEmployees);

// POST /api/employees
router.post('/', ctrl.createEmployee);

// GET /api/employees/:id
router.get('/:id', ctrl.getEmployeeById);

// PUT /api/employees/:id
router.put('/:id', ctrl.updateEmployee);

module.exports = router;