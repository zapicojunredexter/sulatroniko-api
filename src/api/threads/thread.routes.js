const express = require('express');
const controller = require('./thread.controller');

const router = express.Router();


router
  .route('/threads')
  .post(controller.create);

router
  .route('/threads/:id')
  .post(controller.addMessage)
  .patch(controller.edit);

module.exports = router;
