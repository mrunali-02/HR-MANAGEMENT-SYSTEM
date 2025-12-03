const Joi = require('joi');

const leaveCreateSchema = Joi.object({
  employeeId: Joi.string().max(50).required(),
  leaveType: Joi.string().valid('Sick', 'Casual', 'Paid', 'Emergency').required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required(),
  reason: Joi.string().max(500).allow(''),
  days: Joi.number().min(0.5).required(),
  emergency: Joi.boolean().default(false)
});

module.exports = {
  leaveCreateSchema
};

