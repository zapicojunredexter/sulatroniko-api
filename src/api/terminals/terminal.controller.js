const responses = require('../models/Response');
const Terminal = require('./Terminal');

const {
    NotFoundResponse,
    SuccessResponse,
    ServerErrorResponse
} = responses;

const UserNotFound = new NotFoundResponse('Terminal could not be found','Terminal could not be found');
const ServerSuccess = new SuccessResponse('Success', {"success": true});
const ServerError = new ServerErrorResponse('Error', {"success": false});

exports.fetchTerminals = async (req, res) => {
    try {
        const terminals = await Terminal.retrieveAll();
    
        return res.status(ServerSuccess.status).send(terminals);
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
}

exports.fetchTerminal = async (req, res) => {
    try {
        const {id} = req.params;
        
        const terminal = await Terminal.retrieve(id);

        if (!terminal) {
            return res.status(UserNotFound.status).send(UserNotFound);
        }

        return res.status(ServerSuccess.status).send(terminal);    
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
}

exports.add = async (req, res) => {
    try {
        const {body} = req;

        const terminal = new Terminal(body);
        const newId = await terminal.create();
        terminal.TerminalId = newId;
        const isEdited = await terminal.update();

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

        const terminal = await Terminal.retrieve(id);

        if (!terminal) {
            return res.status(UserNotFound.status).send(UserNotFound);
        }
        await Terminal.update(id,{
            TerminalId: id,
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
        const terminal = await Terminal.retrieve(id);

        if (!terminal) {
            return res.status(UserNotFound.status).send(UserNotFound);
        }
        const terminalRecord = new Terminal(terminal);
        await terminalRecord.delete();

        return res.status(ServerSuccess.status).send(ServerSuccess);
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
};
