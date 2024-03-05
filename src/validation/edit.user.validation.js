import Joi from "joi";

const schema = Joi.object({
  email: Joi.string().email().required(),

  phoneNumber: Joi.string()
    .pattern(/^\d{10}$/)
    .required(),

  gender: Joi.string().valid("Male", "Female").required().uppercase(),

  name: Joi.string().min(3).max(20).required().uppercase(),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});

export const editUserValidation = (body) => {
  return schema.validate(body);
};
