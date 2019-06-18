const express = require("express");

const scheduleController = require('./schedule.controller');
const errrorMiddleware = require('../../middlewares/errors');
const validationMiddleware = require('../../middlewares/scheme.validator');

const scheduleValidation = require('./schedule.validation');

const router = express.Router();

router
    .route("/schedules")
    .get(scheduleController.fetchSchedules)
    .post(
        validationMiddleware.validate(validationMiddleware.CREATE, scheduleValidation.schema),
        scheduleController.add
    )
    .all(errrorMiddleware.allowOnly([
        'GET',
        'POST'
    ]))

router
    .route("/schedules/:id")
    .get(scheduleController.fetchSchedule)
    .delete(scheduleController.delete)
    .put(scheduleController.update)
    .all(errrorMiddleware.allowOnly([
        'GET',
        'DELETE',
        'PUT'
    ]))
    
module.exports = router;