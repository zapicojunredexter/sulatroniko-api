const express = require("express");

const tripsController = require('./trip.controller');
const errrorMiddleware = require('../../middlewares/errors');
const validationMiddleware = require('../../middlewares/scheme.validator');

const tripValidation = require('./trip.validation');

const router = express.Router();

router
    .route("/trips")
    .get(tripsController.fetchTrips)
    .post(
        validationMiddleware.validate(validationMiddleware.CREATE, tripValidation.schema),
        tripsController.add
    )
    .all(errrorMiddleware.allowOnly([
        'GET',
        'POST'
    ]))

router
    .route("/trips/cancel/:id")
    .put(tripsController.cancelTrip)

router
    .route("/trips/:id")
    .get(tripsController.fetchTrip)
    .delete(tripsController.delete)
    .put(tripsController.update)
    .all(errrorMiddleware.allowOnly([
        'GET',
        'DELETE',
        'PUT'
    ]))


router
    .route("/trips/schedules/:routeId")
    .get(tripsController.fetchRouteUpcomingTripsDate)
    
module.exports = router;