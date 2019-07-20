const express = require('express');
const controller = require('./manuscript.controller');

const router = express.Router();

router
  .route('/manuscripts')
  .get(controller.fetchAll)
  .post(controller.set);

router
  .route('/manuscripts/:id')
  .get(controller.fetch)
  .patch(controller.edit);

module.exports = router;
