const functions = require("firebase-functions");
const express = require("express");
const adminSdk = require("./src/services/admin-sdk.service");
const cors = require("cors");

adminSdk.initDefaultApp();

const main = express();
main.use(cors());
const routeRoutes = require("./src/api/routes/route.routes");

main.use(routeRoutes);

exports.api = functions.https.onRequest(main)

