// const { Pets } = require("../models/schema");
import { authChecker } from "../../middleware/auth.check.middleware.js";
import { Pets } from "../../models/schema.js";
import express from "express";

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
    let age = request.body.age;
    let name = request.body.name;
    let sex = request.body.sex;
    let breed = request.body.breed;
    let weight = request.body.weight;
    let description = request.body.description;
    let healthInformation = request.body.healthInformation;
    let species = request.body.species;
    let addedBy = request?.user?.id;
    if (
      !age ||
      !sex ||
      !breed ||
      !species ||
      !weight ||
      !name ||
      !description ||
      !healthInformation ||
      !addedBy
    ) {
      return response.status(400).send({
        message: "Send all required fields",
      });
    }
    const newPet = {
      name: name,
      age: age,
      weight: weight,
      sex: sex,
      species: species,
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

petRouter.get("/:id", async (request, response) => {
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

// To update a pet

petRouter.put("/:id", async (request, response) => {
  try {
    console.log("Inside update a pets");
    if (
      !request.body.name ||
      !request.body.breed ||
      !request.body.sex ||
      !request.body.age ||
      !request.body.weight ||
      !request.body.healthInformation ||
      !request.body.description
    ) {
      return response.status(400).send({
        message: "Send all required fields",
      });
    }
    const { id } = request.params;
    const result = await Pets.findByIdAndUpdate(id, request.body);
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
