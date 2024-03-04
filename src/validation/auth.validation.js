import Joi from "joi";

const schema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().required(),

  phoneNumber: Joi.string()
    .pattern(/^\d{10}$/)
    .required(),

  gender: Joi.string().valid("male", "female").required(),

  name: Joi.string().min(3).max(20).required(),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});

export const signupValidation = (body) => {
  return schema.validate(body);
};
