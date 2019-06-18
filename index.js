const functions = require("firebase-functions");
const express = require("express");
const adminSdk = require("./src/services/admin-sdk.service");
const cors = require("cors");

adminSdk.initDefaultApp();

const main = express();
main.use(cors());
const userRoutes = require("./src/api/users/user.routes");
const terminalRoutes = require("./src/api/terminals/terminal.routes");
const scheduleRoutes = require("./src/api/schedules/schedule.routes");
const tripRoutes = require("./src/api/trips/trip.routes");
const bookingRoutes = require("./src/api/bookings/booking.routes");
const feedbackRoutes = require("./src/api/feedbacks/feedback.routes");
const walletRoutes = require("./src/api/wallets/wallet.routes");
const routeRoutes = require("./src/api/routes/route.routes");
const vehicleRoutes = require("./src/api/vehicles/vehicle.routes");

main.use(userRoutes);
main.use(terminalRoutes);
main.use(scheduleRoutes);
main.use(tripRoutes);
main.use(bookingRoutes);
main.use(feedbackRoutes);
main.use(walletRoutes);
main.use(routeRoutes);
main.use(vehicleRoutes);

exports.api = functions.https.onRequest(main)

