const express = require('express');
const controller = require('./transaction.controller');

const router = express.Router();

router
  .route('/proposals')
  .get(controller.fetchAll)
  .post(controller.set);

router
  .route('/transactions/progress/:id')
  .post(controller.addProgress)
  .patch(controller.editProgress);
router
  .route('/transactions/:id')
  .get(controller.fetch);

module.exports = router;
