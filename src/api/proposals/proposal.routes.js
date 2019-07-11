const express = require('express');
const controller = require('./proposal.controller');

const router = express.Router();

router
  .route('/proposals')
  .get(controller.fetchAll)
  .post(controller.set);

router
  .route('/manuscripts/:id')
  .get(controller.fetch);

module.exports = router;
