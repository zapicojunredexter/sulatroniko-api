const Joi = require('joi');
const validationMiddleware = require('../../middlewares/scheme.validator');

const schema = Joi.object().keys({
    Amount: Joi.number(),
    User: Joi.string()
})
.when(Joi.ref('$action'), {
    is: validationMiddleware.POST,
    then: Joi.object({
        Amount: Joi.number().positive()
        .required(),
        UserId: Joi.string().required()
    })
});

module.exports = {
    schema
}
