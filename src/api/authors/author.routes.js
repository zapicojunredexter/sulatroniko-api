const express = require('express');
const controller = require('./author.controller');

const router = express.Router();

router
  .route('/authors')
  .get(controller.fetchAll);

router
  .route('/authors/:id')
  .get(controller.fetch)
  .post(controller.set);

module.exports = router;
