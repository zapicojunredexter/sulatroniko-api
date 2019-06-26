const express = require('express');
const controller = require('./publisher.controller');

const router = express.Router();

router
  .route('/publishers')
  .get(controller.fetchAll);

router
  .route('/publishers/:id')
  .get(controller.fetch)
  .post(controller.set);

module.exports = router;
