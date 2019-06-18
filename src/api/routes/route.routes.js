const express = require("express");

const routesController = require('./route.controller');

const router = express.Router();

router
    .route("/routes")
    .get(routesController.fetchRoutes)
    .post(routesController.addRoutes);
    
module.exports = router;