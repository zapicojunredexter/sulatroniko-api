const admin = require('firebase-admin');

const USERS_COLLECTION = 'Users';

const TERMINALS_COLLECTION = 'Terminals';

const SCHEDULES_COLLECTION = 'Schedules';

const TRIPS_COLLECTION = 'Trips';

const BOOKINGS_COLLECTION = 'Bookings';

const FEEDBACKS_COLLECTION = 'Feedbacks';

const WALLETS_COLLECTION = 'Wallets';

const ROUTES_COLLECTION = 'Routes';

const VEHICLES_COLLECTION = 'Vehicles';

const getUsersCollection = () => admin.firestore().collection(USERS_COLLECTION);

const getTerminalsCollection = () => admin.firestore().collection(TERMINALS_COLLECTION);

const getSchedulesCollection = () => admin.firestore().collection(SCHEDULES_COLLECTION);

const getTripsCollection = () => admin.firestore().collection(TRIPS_COLLECTION);

const getBookingsCollection = () => admin.firestore().collection(BOOKINGS_COLLECTION);

const getFeedbacksCollection = () => admin.firestore().collection(FEEDBACKS_COLLECTION);

const getWalletsCollection = () => admin.firestore().collection(WALLETS_COLLECTION);

const getRoutesCollection = () => admin.firestore().collection(ROUTES_COLLECTION);

const getVehiclesCollection = () => admin.firestore().collection(VEHICLES_COLLECTION);


module.exports = {
  getTerminalsCollection,
  getUsersCollection,
  getSchedulesCollection,
  getTripsCollection,
  getBookingsCollection,
  getFeedbacksCollection,
  getWalletsCollection,
  getRoutesCollection,
  getVehiclesCollection,
};
