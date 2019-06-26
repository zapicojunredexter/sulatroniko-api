const express = require('express');

const routesController = require('./route.controller');

const router = express.Router();

router
  .route('/routes')
  .get(routesController.fetch)
  .post(routesController.add);

module.exports = router;
