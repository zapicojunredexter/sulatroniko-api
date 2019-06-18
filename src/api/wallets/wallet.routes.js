const express = require("express");

const walletController = require('./wallet.controller');

const validationMiddleware = require('../../middlewares/scheme.validator');
const validation = require('./wallet.validation');

const router = express.Router();

router
    .route("/wallets/users/:id")
    .get(walletController.fetchUsersWallet)

router
    .route("/wallets")
    .post(
        validationMiddleware.validate(validationMiddleware.CREATE, validation.schema),
        walletController.add
    )
    .get(walletController.fetchWallets)

    
module.exports = router;