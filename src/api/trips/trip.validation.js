const Joi = require('joi');
const validationMiddleware = require('../../middlewares/scheme.validator');

const schema = Joi.object().keys({
    "TripId": Joi.string(),
    "ScheduleId": Joi.string(),
    "DriverId": Joi.string(),
    "MaxCapacity": Joi.number(),
    "Status": Joi.string()
})
.when(Joi.ref('$action'), {
    is: validationMiddleware.POST,
    then: Joi.object({
        DriverId: Joi.string().required(),
        RouteId: Joi.string().required(),
        DepartTime: Joi.string().required(),
        DepartDate: Joi
            .date()
            .min('now')
            .required(),
        VehicleId: Joi.string().required(),
        Price: Joi.number().required()
    })
});

module.exports = {
    schema
}
