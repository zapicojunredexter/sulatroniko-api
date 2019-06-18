const express = require("express");

const terminalController = require('./terminal.controller');
const errrorMiddleware = require('../../middlewares/errors');
const validationMiddleware = require('../../middlewares/scheme.validator');

const terminalValidation = require('./terminal.validation');

const router = express.Router();

router
    .route("/terminals")
    .get(terminalController.fetchTerminals)
    .post(
        validationMiddleware.validate(validationMiddleware.CREATE, terminalValidation.schema),
        terminalController.add
    )
    .all(errrorMiddleware.allowOnly([
        'GET',
        'POST'
    ]))

router
    .route("/terminals/:id")
    .get(terminalController.fetchTerminal)
    .delete(terminalController.delete)
    .put(terminalController.update)
    .all(errrorMiddleware.allowOnly([
        'GET',
        'DELETE',
        'PUT'
    ]))
    
module.exports = router;