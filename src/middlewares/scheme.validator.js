const Joi = require('joi');
// const response = require('../api/models/Response');

// const {BadRequestResponse} = response;

const POST = 'POST';
const PATCH = 'PATCH';
const DELETE = 'DELETE';
const GET = 'GET';
const PUT = 'PUT';

const CREATE = {"action": POST};
const UPDATE = {"action": PATCH};
const REPLACE = {"action": PUT};
const REMOVE = {"action": DELETE};
const FIND = {"action": GET};

const checkErrors = (result) => {
    let errorResponse = null;
    if (result.error) {
        const {details} = result.error;
        const errors = [];
        details.map((error) => errors.push(error.message));
        errorResponse = {
            status: 400,
            error: errors.join(','),
            message: 'Invalid request to project resource.',
            data: errors
        };
        
    }

    return errorResponse;
};

const validate = (action, schema) => (
    req,
    res,
    next,
) => {
    const result = Joi.validate(req.body, schema,{
        "abortEarly": false,
        "context": {...action}
    });
    const responseErrors = checkErrors(result);
    if (responseErrors) {
        return res
            .status(responseErrors.status)
            .send(responseErrors);
        // return next(responseErrors);
    }

    return next();
};

module.exports = {
    CREATE,
    DELETE,
    FIND,
    GET,
    PATCH,
    POST,
    PUT,
    REMOVE,
    REPLACE,
    UPDATE,
    validate
};
