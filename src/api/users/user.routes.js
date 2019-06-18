const express = require("express");

const userController = require('./user.controller');
const errrorMiddleware = require('../../middlewares/errors');
const validationMiddleware = require('../../middlewares/scheme.validator');
const userValidation = require('./user.validation');

const router = express.Router();

/*
router
    .route("/user/registration")
    .post(
        validationMiddleware.validate(validationMiddleware.CREATE, userValidation.schema),
        userController.registerDriver,
    );
*/

router
    .route("/users/drivers")
    .get(userController.fetchDrivers)
    .post(
        validationMiddleware.validate(validationMiddleware.CREATE, userValidation.schema),
        userController.registerDriver,
    );
router
    .route("/users/commuters")
    .get(userController.fetchCommuters);

router
    .route("/users")
    .get(userController.fetchUsers)
    .post(
        validationMiddleware.validate(validationMiddleware.CREATE, userValidation.schema),
        userController.add,
    )
    .all(errrorMiddleware.allowOnly([
        'GET',
        'POST'
    ]))


router
    .route("/users/:id")
    .get(userController.fetchUser)
    .post(
        validationMiddleware.validate(validationMiddleware.CREATE, userValidation.schema),
        userController.setUser,
    )
    .put(userController.update)
    .delete(userController.delete)
    
module.exports = router;