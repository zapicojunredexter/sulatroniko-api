const Joi = require('joi');
const validationMiddleware = require('../../middlewares/scheme.validator');

const schema = Joi.object().keys({
    "DriverId": Joi.string(),
    "CommuterId": Joi.string(),
    "Score": Joi.number(),
    "Comment": Joi.string().allow("")
})
.when(Joi.ref('$action'), {
    "is": validationMiddleware.POST,
    "then": Joi.object({
        "DriverId": Joi.string().required(),
        "CommuterId": Joi.string().required(),
        "Score": Joi.number().required(),
        "Comment": Joi.string().required()
        .allow("")
    })
});

module.exports = {
    schema
}
