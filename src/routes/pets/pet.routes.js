// const { Pets } = require("../models/schema");
import { authChecker } from "../../middleware/auth.check.middleware.js";
import { Pets } from "../../models/schema.js";
import express from "express";
import { addPetValidation } from "../../validation/pets.validation.js";

const petRouter = express.Router();

/* Pet CRUD requests */

// To get all pets //

petRouter.get("/", authChecker, async (req, response) => {
  try {
    let userId = req?.user?.id;
    console.log("Inside get all pets");
    const users = await Pets.find({ addedBy: userId });
    console.log("fetched users");
    return response.status(200).json({
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.log("error fetching");
    response.status(500).send({ message: error.message });
  }
});

// To create a pet

petRouter.post("/add-pet", authChecker, async (request, response) => {
  try {
    console.log("Inside add a pets");
    const addedBy = request?.user?.id;
    const { name, age, weight, sex, breed, description, healthInformation } =
      request?.body ?? {};

    const { error } = addPetValidation(request?.body);
    console.log(JSON.stringify(error, null, 2));

    if (error?.details?.length) {
      return response.status(400).send({ message: error.message });
    }

    const newPet = {
      name: name,
      age: age,
      weight: weight,
      sex: sex,
      breed: breed,
      description: description,
      healthInformation: healthInformation,
      addedBy: addedBy,
    };

    const pet = await Pets.create(newPet);
    console.log("Created");

    return response.status(201).send(pet);
  } catch (error) {
    console.log("error creating:", error);
    response.status(500).send({ message: error.message });
  }
});

// To get a specified pet

petRouter.get("/details/:id", authChecker, async (request, response) => {
  try {
    console.log("Inside get a pets");
    const { id } = request.params;
    const pet = await Pets.findById(id);
    return response.status(200).json(pet);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// To delete a specified pet

petRouter.delete("/details/:id", authChecker, async (request, response) => {
  try {
    console.log("Inside get a pets");
    const addedBy = request?.user?.id;
    const { id } = request?.params;
    const pet = await Pets.findById(id);
    if (!pet) {
      return response.status(404).send({ message: "Pet not found!" });
    }
    await pet.deleteOne({ id });
    return response.status(200).send({ message: "Pet deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// To update a pet

petRouter.put("/details/:id", authChecker, async (request, response) => {
  try {
    console.log("Inside update a pets");
    console.log("Inside add a pets");
    const { name, age, weight, sex, breed, description, healthInformation } =
      request?.body ?? {};

    const { error } = addPetValidation(request?.body);
    console.log(JSON.stringify(error, null, 2));

    if (error?.details?.length) {
      return response.status(400).send({ message: error.message });
    }

    const { id } = request.params;
    const result = await Pets.findByIdAndUpdate(id, {
      name,
      age,
      weight,
      sex,
      description,
      healthInformation,
      weight,
      breed,
    });
    if (!result) {
      return response.status(404).send({ message: "Pet not found" });
    }
    return response.status(201).send({ message: "Pet updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default petRouter;
