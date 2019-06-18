const Joi = require('joi');
const validationMiddleware = require('../../middlewares/scheme.validator');

const schema = Joi.object().keys({
    "Coordinates": Joi.array().items(Joi.number()),
    "TerminalAddress": Joi.string(),
    "TerminalContactNumber": Joi.string()
})
.when(Joi.ref('$action'), {
    "is": validationMiddleware.POST,
    "then": Joi.object({
        "Coordinates": Joi.array().items(Joi.number())
            .required(),
        "TerminalAddress": Joi.string().required(),
        "TerminalContactNumber": Joi.string().required()
    })
});

module.exports = {
    schema
}
