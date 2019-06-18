const Joi = require('joi');
const validationMiddleware = require('../../middlewares/scheme.validator');

const schema = Joi.object().keys({
    FromLocation: Joi.array(),
    ToLocation: Joi.array(),
    Route: Joi.string()
})
.when(Joi.ref('$action'), {
    is: validationMiddleware.POST,
    then: Joi.object({
        FromLocation: Joi.array()
            .length(2)
            .required(),
        ToLocation: Joi.array()
            .length(2)
            .required(),
        Route: Joi.string().required()
    })
});

module.exports = {
    schema
}
