const Joi = require("joi");

const schema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),

  phoneNumber: Joi.string()
    .pattern(/^\d{10}$/)
    .required(),

  gender: Joi.string().valid("Male", "Female").required().uppercase(),

  name: Joi.string().min(3).max(20).required().uppercase(),
});

const editUserValidation = (body) => {
  return schema.validate(body);
};

module.exports = { editUserValidation };
