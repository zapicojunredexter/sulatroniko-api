const express = require('express');
const controller = require('./user.controller');

const router = express.Router();

router
  .route('/users/multiple')
  .get(controller.fetchAllUserTypes)
  .post(controller.fetchMultiple);

router
  .route('/users')
  .get(controller.fetchAll)
  .post(controller.add);

router
  .route('/users/login')
  .post(controller.login);

router
  .route('/users/register')
  .post(controller.add);

router
  .route('/users/notifs/:userId/:notifId')
  .get(controller.setNotifRead);

router
  .route('/users/email/:username')
  .get(controller.sendEmail);

router
  .route('/users/notifs/:userId')
  .post(controller.addNotif);

router
  .route('/users/:id')
  .get(controller.fetch)
  .post(controller.set);


module.exports = router;
