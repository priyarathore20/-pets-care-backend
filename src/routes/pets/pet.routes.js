const express = require('express');
const { Pets, Users } = require('../../models/schema');
const { authChecker } = require('../../middleware/auth.check.middleware');
const { addPetValidation } = require('../../validation/pets.validation');

const petRouter = express.Router();

/* Pet CRUD requests */

// To get all pets
petRouter.get('/', authChecker, async (req, res) => {
  try {
    const userId = req.user.id;
    const pets = await Pets.find({ addedBy: userId });
    res.status(200).json({ count: pets.length, data: pets });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// To create a pet
petRouter.post('/add-pet', authChecker, async (req, res) => {
  try {
    const addedBy = req.user.id;
    const { name, age, color, species, sex, breed, description, healthInformation } = req.body;
    const { error } = addPetValidation(req.body);

    if (error.details.length) {
      return res.status(400).send({ message: error.message });
    }

    const newPet = { name, age, species, color, sex, breed, description, healthInformation, addedBy };
    const pet = await Pets.create(newPet);
    res.status(201).send(pet);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// To get a specified pet
petRouter.get('/details/:id', authChecker, async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await Pets.findById(id);
    res.status(200).json(pet);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// To delete a specified pet
petRouter.delete('/delete-pet/:id', authChecker, async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await Pets.findById(id);
    if (!pet) {
      return res.status(404).send({ message: 'Pet not found!' });
    }
    await pet.deleteOne({ id });
    res.status(200).send({ message: 'Pet deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// To update a pet
petRouter.put('/edit-pet/:id', authChecker, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, weight, sex, breed, description, healthInformation } = req.body;
    const { error } = addPetValidation(req.body);

    if (error.details.length) {
      return res.status(400).send({ message: error.message });
    }

    const result = await Pets.findByIdAndUpdate(id, { name, age, weight, sex, description, healthInformation, breed });
    if (!result) {
      return res.status(404).send({ message: 'Pet not found' });
    }
    res.status(200).send({ message: 'Pet updated successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// To get pet and owner details
petRouter.get('/get-pet-and-owner-details/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await Pets.findById(id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    const user = await Users.findById(pet.addedBy);
    res.status(200).json({
      name: pet.name,
      age: pet.age,
      sex: pet.sex,
      breed: pet.breed,
      species: pet.species,
      color: pet.color,
      description: pet.description,
      healthInformation: pet.healthInformation,
      ownerEmail: user.email,
      ownerPhoneNumber: user.phoneNumber,
      ownerName: user.name,
      ownerGender: user.gender,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = petRouter;
