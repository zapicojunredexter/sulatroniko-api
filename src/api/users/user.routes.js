const express = require('express');
const controller = require('./user.controller');

const router = express.Router();

router
  .route('/users')
  .get(controller.fetchAll);

router
  .route('/users/:id')
  .get(controller.fetch)
  .post(controller.set);

module.exports = router;