import Joi from "joi";

// add pet validation schema

const addPetSchema = Joi.object({
  breed: Joi.string().required(),
  species: Joi.string().required(),
  description: Joi.string().max(250).required(),
  color: Joi.string().required(),
  age: Joi.string().required(),
  sex: Joi.string().required(),
  healthInformation: Joi.string().max(250).min(3),
  name: Joi.string().min(3).max(20).required().uppercase(),
});

export const addPetValidation = (body) => {
  return addPetSchema.validate(body);
};
