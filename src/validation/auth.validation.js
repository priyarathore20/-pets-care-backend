const Joi = require("joi");

// signup validation schema
const signupSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),

  password: Joi.string().required(),

  phoneNumber: Joi.string()
    .pattern(/^\d{10}$/)
    .required(),

  gender: Joi.string().valid("Male", "Female").required(),

  name: Joi.string().min(3).max(20).required(),
});

const signupValidation = (body) => {
  return signupSchema.validate(body);
};

// login validation schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().required(),
});

const loginValidation = (body) => {
  return loginSchema.validate(body);
};

module.exports = { signupValidation, loginValidation };
