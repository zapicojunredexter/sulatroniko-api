const express = require("express");

const controller = require('./vehicle.controller');
const validationMiddleware = require('../../middlewares/scheme.validator');
const validation = require('./vehicle.validation');

const router = express.Router();

router
    .route("/vehicles")
    .get(controller.fetchVehicles)
    .post(
        validationMiddleware.validate(validationMiddleware.CREATE, validation.schema),
        controller.add,
    )

router
    .route("/vehicles/:id")
    .patch(controller.update)
    
module.exports = router;