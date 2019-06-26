const express = require('express');
const controller = require('./review.controller');

const router = express.Router();

router
  .route('/reviews')
  .get(controller.fetchAll)
  .post(controller.set);

router
  .route('/reviews/:id')
  .get(controller.fetch);

module.exports = router;
