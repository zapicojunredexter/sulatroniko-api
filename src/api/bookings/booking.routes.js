const express = require("express");

const bookingsController = require('./booking.controller');
const errrorMiddleware = require('../../middlewares/errors');
// const validationMiddleware = require('../../middlewares/scheme.validator');

// const bookingValidations = require('./booking.validation');

const router = express.Router();

router
    .route("/bookings")
    .get(bookingsController.fetchBookings)
    .post(bookingsController.add)
    .all(errrorMiddleware.allowOnly([
        'GET',
        'POST'
    ]))
    
/*
    // .post(
    //     validationMiddleware.validate(validationMiddleware.CREATE, bookingValidations.schema),
    //     bookingsController.add
    // )
    */
router
    .route("/bookings/cancel/:id")
    .put(bookingsController.cancelBookingViaCommuter)

router
    .route("/bookings/:id")
    .get(bookingsController.fetchBooking)
    .delete(bookingsController.delete)
    .put(bookingsController.update)
    .all(errrorMiddleware.allowOnly([
        'GET',
        'DELETE',
        'PUT'
    ]))
    
module.exports = router;