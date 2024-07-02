const express = require('express');
const { Users } = require('../../models/schema');
const { editUserValidation } = require('../../validation/edit.user.validation');

const userRouter = express.Router();

// To edit a user
userRouter.put('/:id', async (req, res) => {
  try {
    const { email, phoneNumber, name, gender } = req.body;
    const { error } = editUserValidation(req.body);

    if (error.details.length) {
      return res.status(400).send({ message: error.message });
    }

    const { id } = req.params;
    const result = await Users.findByIdAndUpdate(id, { email, phoneNumber, gender, name });
    if (!result) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = userRouter;
