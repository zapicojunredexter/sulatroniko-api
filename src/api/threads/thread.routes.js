const express = require('express');
const controller = require('./thread.controller');

const router = express.Router();

router
  .route('/threads/:id')
  .post(controller.addMessage);

module.exports = router;