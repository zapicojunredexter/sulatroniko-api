const Joi = require('joi');
const validationMiddleware = require('../../middlewares/scheme.validator');

const schema = Joi.object().keys({
    "ScheduleId": Joi.string(),
    "DepartFrom": Joi.string(),
    "DepartTo": Joi.string(),
    "DepartureTime": Joi.string(),
    "EstTravelTime": Joi.string()
})
.when(Joi.ref('$action'), {
    "is": validationMiddleware.POST,
    "then": Joi.object({
        "DepartFrom": Joi.string().required(),
        "DepartTo": Joi.string().required(),
        "DepartureTime": Joi.string().required(),
        "EstTravelTime": Joi.string().required()
    })
});

module.exports = {
    schema
}
