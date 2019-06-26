// import userRoutes from './src/api/users/user.routes';

const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const adminSdk = require('./src/services/admin-sdk.service');


adminSdk.initDefaultApp();

const main = express();
main.use(cors());
const routeRoutes = require('./src/api/routes/route.routes');
const userRoutes = require('./src/api/users/user.routes');

main.use(routeRoutes);
main.use(userRoutes);

exports.api = functions.https.onRequest(main);
