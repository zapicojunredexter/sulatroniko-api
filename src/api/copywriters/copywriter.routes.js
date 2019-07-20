const express = require('express');
const controller = require('./copywriter.controller');

const router = express.Router();

router
  .route('/copywriters')
  .get(controller.fetchAll)
  .post(controller.add);

router
  .route('/copywriters/publishers/:id')
  .get(controller.fetchByPublisher);

router
  .route('/copywriters/:id')
  .get(controller.fetch)
  .patch(controller.edit)
  .post(controller.set);

module.exports = router;
