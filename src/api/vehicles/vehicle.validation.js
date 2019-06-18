const Joi = require('joi');
const validationMiddleware = require('../../middlewares/scheme.validator');

const schema = Joi.object().keys({
    PlateNumber: Joi.string(),
    Seats: Joi.object()
})
.when(Joi.ref('$action'), {
    is: validationMiddleware.POST,
    then: Joi.object({
        PlateNumber: Joi.string().required(),
        Seats: Joi.object().required()
    })
});

module.exports = {
    schema
}
