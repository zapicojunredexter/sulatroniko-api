const Joi = require('joi');
const validationMiddleware = require('../../middlewares/scheme.validator');

const schema = Joi.object().keys({
    "BirthDate": Joi.string(),
    "ContactNumber": Joi.string(),
    "FirstName": Joi.string(),
    "Gender": Joi.string()
        .valid('male', 'female'),
    "LastName": Joi.string(),
    notifToken: Joi.string()
})
.when(Joi.ref('$action'), {
    is: validationMiddleware.POST,
    then: Joi.object({
        email: Joi.string().email(),
        password: Joi.string(),
        BirthDate: Joi.string().required(),
        ContactNumber: Joi.string().required(),
        FirstName: Joi.string().required(),
        Gender: Joi.string()
            .valid('male', 'female')
            .required(),
        LastName: Joi.string().required(),
        AccountType: Joi.string()
            .valid('Commuter', 'Driver')
            .required(),
        notifToken: Joi.string()
    })
});

module.exports = {
    schema
}
