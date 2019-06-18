const admin = require('firebase-admin');
const responses = require('../models/Response');
const User = require('../users/User');
const Trip = require('../trips/Trip');
const Booking = require('./Booking');
const constants = require('../../utils/constants');
const collectionService = require('../../services/collections.service');

const {
    getBookingsCollection,
    getUsersCollection,
    getTripsCollection
} = collectionService;

const {REFUND_AMOUNT} = constants;

const {
    NotFoundResponse,
    SuccessResponse,
    ServerErrorResponse
} = responses;

const BookingsNotFound = new NotFoundResponse('Booking could not be found','Booking could not be found');
const UserNotFound = new NotFoundResponse('User could not be found','User could not be found');
// const TripNotFound = new NotFoundResponse('Trip could not be found','Trip could not be found');
const ServerSuccess = new SuccessResponse('Success', {"success": true});
const ServerError = new ServerErrorResponse('Error', {"success": false});


exports.fetchBookings = async (req, res) => {
    try {
        const result = await Booking.retrieveAll();

        return res.status(ServerSuccess.status).send(result);
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
}

exports.fetchBooking = async (req, res) => {
    try {
        const {id} = req.params;
        
        const booking = await Booking.retrieve(id);

        if (!booking) {
            return res.status(BookingsNotFound.status).send(BookingsNotFound);
        }

        const user = await User.retrieve(booking.CommuterId);

        if (!user) {
            return res.status(UserNotFound.status).send(UserNotFound);
        }

        const response = {
            Booking: booking,
            Commuter: user
        };


        return res.status(ServerSuccess.status).send(response);    
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
}

exports.add = async (req, res) => {
    try {
        const {body} = req;
        const batch = admin.firestore().batch();
        const {
            CommuterId,
            Seats,
            TripId
        } = body;

        const [
            user,
            trip
        ] = await Promise.all([
            User.retrieve(CommuterId),
            Trip.retrieve(TripId)
        ]);

        if (!user) {
            throw new Error('User does not exists');
        }
        if (user.AccountType !== "Commuter") {
            throw new Error('User is not a commuter');
        }
        if (!trip) {
            throw new Error('Trip does not exists');
        }
        const amountPayable = trip.Price * Seats.length;
        if (user.WalletBalance < amountPayable) {
            throw new Error('Not enough credits');
        }
        // adding new booking doc
        const addBookingRef = getBookingsCollection().doc();
        const toBeAdded = {
            Id: addBookingRef.id,
            CommuterId,
            Seats,
            Trip: {
                Id: trip.Id,
                Route: trip.Route,
                Schedule: trip.Schedule,
                Driver: trip.Driver,
                Vehicle: {
                    Id: trip.Vehicle && trip.Vehicle.Id,
                    PlateNumber: trip.Vehicle && trip.Vehicle.PlateNumber
                }
            },
            AmtPaid: amountPayable,
            Status: 'Waiting',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            deleted: false
        };
        batch.set(addBookingRef, toBeAdded);

        // update user balance
        const updateUserRef = getUsersCollection().doc(CommuterId);
        const newFields = {
            WalletBalance: user.WalletBalance - amountPayable,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        batch.update(updateUserRef, newFields);

        // update trip seats
        const nSeats = trip.Vehicle.Seats;
        Seats.forEach((seat) => {
            if (typeof nSeats[seat] === 'undefined') {
                throw new Error('Non existent seat');
            }
            if (nSeats[seat]) {
                throw new Error('Seat already occupied');
            }
            nSeats[seat] = true;
        });
        const updateThreadRef = getTripsCollection().doc(TripId);
        const newVehicle = {
            ...trip.Vehicle,
            Seats: nSeats
        };
        const newTrip = {
            Vehicle: newVehicle,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        batch.update(updateThreadRef, newTrip);

        await batch.commit();

        return res.status(ServerSuccess.status).send(ServerSuccess);

        /*
        const scheme = {
            Id,
            CommuterId, // passed as params
            - maybe not needed AmtPaid,
            Seats, // passed as params
            TripId, //passed as params
            Status,
            - maybe not needed Route { / derived from trips
                Id,
                Route,
                FromLocation:[],
                ToLocation: [],
            },
            - maybe not needed Schedule {/ derived form trip
                DepartTime,
                DepartDate,
            },
        }
        */
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
};

exports.update = async (req, res) => {
    try {
        const {id} = req.params;
        const {body} = req;

        const result = await Booking.retrieve(id);

        if (!result) {
            return res.status(BookingsNotFound.status).send(BookingsNotFound);
        }
        await Booking.update(id,{
            ...body,
            BookingId: id
        });
    
        return res.status(ServerSuccess.status).send(ServerSuccess);
    } catch (error) {
        return res.status(ServerError.error).send({"error": error.message});
    }
};

exports.delete = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await Booking.retrieve(id);

        if (!result) {
            return res.status(BookingsNotFound.status).send(BookingsNotFound);
        }
        await Booking.delete(id);

        return res.status(ServerSuccess.status).send(ServerSuccess);
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
};

exports.cancelBookingViaCommuter = async (req, res) => {
    try {
        const {id} = req.params;
        const batch = admin.firestore().batch();
        const booking = await Booking.retrieve(id);

        if (!booking) {
            return res.status(BookingsNotFound.status).send(BookingsNotFound);
        }
        if (booking.Status !== 'Waiting') {
            throw new Error('Booking can not be cancelled');
        }

        const {AmtPaid,CommuterId,Seats} = booking;
        const user = await User.retrieve(CommuterId);

        if (!user) {
            return res.status(UserNotFound.status).send(UserNotFound);
        }
        const refunded = AmtPaid - REFUND_AMOUNT;
        const newUser = {
            WalletBalance: user.WalletBalance + refunded
        };
        const userRef = getUsersCollection().doc(CommuterId);
        batch.update(userRef, newUser);
        
        const bookingRef = getBookingsCollection().doc(id);
        batch.update(bookingRef, {
            Status: "Cancelled"
        });
        
        const tripRef = getTripsCollection().doc(booking.Trip.Id);
        Seats.forEach((seat) => {
            batch.update(tripRef, {
                [`Vehicle.Seats.${seat}`]: false
            });
        });

        await batch.commit();

        return res.status(ServerSuccess.status).send({success: true});
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
}
