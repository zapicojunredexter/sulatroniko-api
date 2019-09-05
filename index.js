// import userRoutes from './src/api/users/user.routes';

const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const adminSdk = require('./src/services/admin-sdk.service');


adminSdk.initDefaultApp();

const main = express();
const routeRoutes = require('./src/api/routes/route.routes');
const userRoutes = require('./src/api/users/user.routes');
const authorRoutes = require('./src/api/authors/author.routes');
const publisherRoutes = require('./src/api/publishers/publisher.routes');
const manuscriptRoutes = require('./src/api/manuscripts/manuscript.routes');
const threadRoutes = require('./src/api/threads/thread.routes');
const reviewRoutes = require('./src/api/reviews/review.routes');
const copyWriterRoutes = require('./src/api/copywriters/copywriter.routes');
const transactionRoutes = require('./src/api/transactions/transaction.routes');

main.use(cors({ origin: true }));

main.use(routeRoutes);
main.use(userRoutes);
main.use(authorRoutes);
main.use(publisherRoutes);
main.use(manuscriptRoutes);
main.use(threadRoutes);
main.use(reviewRoutes);
main.use(copyWriterRoutes);
main.use(transactionRoutes);

exports.api = functions.https.onRequest(main);
