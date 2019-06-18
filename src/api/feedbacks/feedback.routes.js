
const express = require("express");

const feedbackController = require('./feedback.controller');
const validationMiddleware = require('../../middlewares/scheme.validator');

const feedbackValidation = require('./feedback.validation');

const router = express.Router();

router
    .route("/feedbacks")
    .get(feedbackController.fetchFeedbacks)
    .post(
        validationMiddleware.validate(validationMiddleware.CREATE, feedbackValidation.schema),
        feedbackController.addFeedback
    )

router
    .route("/feedbacks/:id")
    .get(feedbackController.fetchDriverFeedbacks)
    
module.exports = router;