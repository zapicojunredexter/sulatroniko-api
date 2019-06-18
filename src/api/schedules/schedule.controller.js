const responses = require('../models/Response');
const Schedule = require('./Schedule');

const {
    NotFoundResponse,
    SuccessResponse,
    ServerErrorResponse
} = responses;

const UserNotFound = new NotFoundResponse('Schedule could not be found','Schedule could not be found');
const ServerSuccess = new SuccessResponse('Success', {"success": true});
const ServerError = new ServerErrorResponse('Error', {"success": false});

exports.fetchSchedules = async (req, res) => {
    try {
        const result = await Schedule.retrieveAll();
    
        return res.status(ServerSuccess.status).send(result);
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
}
exports.fetchSchedule = async (req, res) => {
    try {
        const {id} = req.params;
        
        const result = await Schedule.retrieve(id);

        if (!result) {
            return res.status(UserNotFound.status).send(UserNotFound);
        }

        return res.status(ServerSuccess.status).send(result);    
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
}

exports.add = async (req, res) => {
    try {
        const {body} = req;

        const result = new Schedule(body);
        const newId = await result.create();
        result.ScheduleId = newId;
        const isEdited = await result.update();

        if (!isEdited) {
            throw new Error("Could not set ID");
        }

        return res.status(ServerSuccess.status).send(ServerSuccess);
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
};

exports.update = async (req, res) => {
    try {
        const {id} = req.params;
        const {body} = req;

        const result = await Schedule.retrieve(id);

        if (!result) {
            return res.status(UserNotFound.status).send(UserNotFound);
        }
        await Schedule.update(id,{
            ScheduleId: id,
            ...body
        });
    
        return res.status(ServerSuccess.status).send(ServerSuccess);
    } catch (error) {
        return res.status(ServerError.error).send({"error": error.message});
    }
};

exports.delete = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await Schedule.retrieve(id);

        if (!result) {
            return res.status(UserNotFound.status).send(UserNotFound);
        }
        const record = new Schedule(result);
        await record.delete();

        return res.status(ServerSuccess.status).send(ServerSuccess);
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
};