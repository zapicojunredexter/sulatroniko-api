const express = require("express");

const routesController = require('./route.controller');
// const errrorMiddleware = require('../../middlewares/errors');

const validationMiddleware = require('../../middlewares/scheme.validator');

const routeValidation = require('./route.validation');

const router = express.Router();

router
    .route("/routes")
    .get(routesController.fetchRoutes)
    .post(
        validationMiddleware.validate(validationMiddleware.CREATE, routeValidation.schema),
        routesController.addRoutes
    );

    /*
router
    .route("/users/:id")
    .get(userController.fetchUser)
    .put(userController.update)
    .delete(userController.delete)
    .all(errrorMiddleware.allowOnly([
        'GET',
        'DELETE',
        'POST',
        'PUT'
    ]))
    */
    
module.exports = router;