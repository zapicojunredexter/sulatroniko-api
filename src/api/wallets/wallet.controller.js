const responses = require('../models/Response');
const User = require('../users/User');
const collectionsService = require('../../services/collections.service');

const {getWalletsCollection} = collectionsService;

const Wallet = require('./Wallet');

const {
    // NotFoundResponse,
    SuccessResponse,
    ServerErrorResponse
} = responses;

// const UserNotFound = new NotFoundResponse('User could not be found','User could not be found');
const ServerSuccess = new SuccessResponse('Success', {"success": true});
const ServerError = new ServerErrorResponse('Error', {"success": false});

exports.fetchWallets = (req, res) => {
    try {
        return res.send("HAhAHIHI");
        // return res.status(ServerSuccess.status).send(response.docs.map((obj) => obj.data()));
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
}

exports.add = async (req, res) => {
    try {
        const {body} = req;
        const {UserId,Amount} = body;
    
        const user = await User.retrieve(UserId);
        if (!user) {
            throw new Error('User does not exists');
        }
        if (user.AccountType !== "Commuter") {
            throw new Error('User is not a commuter');
        }
        const newUser = {
            WalletBalance: Number(user.WalletBalance) + Number(Amount)
        };
        await User.update(UserId,newUser);
        await Wallet.create({User: UserId,
            Amount});

        return res.status(ServerSuccess.status).send({succes: true});
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
};

exports.fetchUsersWallet = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.retrieve(id);
        if (!user) {
            throw new Error('User does not exists');
        }

        const walletsCollection = getWalletsCollection();

        const walletsResponse = await walletsCollection.where("User","==",id).get();
        const wallets = walletsResponse.docs.map((data) => ({Id: data.id,
            ...data.data()}));
        const response = {
            ...user,
            WalletHistory: wallets
        };

        return res.status(ServerSuccess.status).send(response);    
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
}

exports.update = (req, res) => {
    try {

        /*
        const {id} = req.params;
        const {body} = req;
        */
        return res.status(ServerSuccess.status).send(ServerSuccess);
    } catch (error) {
        return res.status(ServerError.error).send({"error": error.message});
    }
};

exports.delete = (req, res) => {
    try {
        // const {id} = req.params;

        return res.status(ServerSuccess.status).send(ServerSuccess);
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
};
