import Joi from "joi";

// add pet validation schema

const addPetSchema = Joi.object({
  weight: Joi.string(),
  breed: Joi.string().required(),
  size: Joi.string(),
  description: Joi.string().max(50).min(10),
  size: Joi.string(),
  age: Joi.string().required(),
  sex: Joi.string().valid("Male", "Female").required(),
  healthInformation: Joi.string().max(20).min(3),
  name: Joi.string().min(3).max(20).required().uppercase(),
});

export const addPetValidation = (body) => {
  return addPetSchema.validate(body);
};
