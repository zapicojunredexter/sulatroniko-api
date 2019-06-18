const responses = require('../models/Response');
const Route = require('./Route');

// const usersCollection = collectionsService.getUsersCollection();

const {
    // NotFoundResponse,
    SuccessResponse,
    ServerErrorResponse
} = responses;

// const UserNotFound = new NotFoundResponse('User could not be found','User could not be found');
const ServerSuccess = new SuccessResponse('Success', {"success": true});
const ServerError = new ServerErrorResponse('Error', {"success": false});

exports.fetchRoutes = async (req, res) => {
    try {
        const routes = await Route.retrieveAll();

        return res.status(ServerSuccess.status).send(routes);
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
}

exports.addRoutes = async (req, res) => {
    try {
        const {body} = req;
        await Route.create(body);

        return res.status(200).send({"success": true});
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
};

exports.fetchRoute = (req, res) => {
    try {
        return res.status(200).send({"success": true});
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
}

exports.update = (req, res) => {
    try {
        return res.status(200).send({"success": true});
    } catch (error) {
        return res.status(ServerError.error).send({"error": error.message});
    }
};

exports.delete = (req, res) => {
    try {
        return res.status(200).send({"success": true});
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
};
