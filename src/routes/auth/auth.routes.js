const express = require('express');
const { Users } = require('../../models/schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { loginValidation, signupValidation } = require('../../validation/auth.validation');
const { JWT_SECRET_KEY } = require('../../config');

const authRouter = express.Router();

// Function to generate JWT
function generateToken(user) {
  const { _id, phoneNumber, email, gender, name } = user;
  return jwt.sign({ id: _id, phoneNumber, email, gender, name }, JWT_SECRET_KEY, { expiresIn: '6d' });
}

// To create a user
authRouter.post('/signup', async (req, res) => {
  try {
    const { error } = signupValidation(req.body);

    if (error.details.length) {
      return res.status(400).send({ message: error.message });
    }

    const { name, email, password, gender, phoneNumber } = req.body;
    const existUser = await Users.findOne({ email });

    if (existUser) {
      return res.status(409).json({ message: 'User already exists. Login instead!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Users({ email, phoneNumber, name, gender, password: hashedPassword });
    await newUser.save();

    const token = generateToken(newUser);
    res.status(201).json({ token, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// To login a user
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = loginValidation(req.body);

    if (error.details.length) {
      return res.status(400).send({ message: error.message });
    }

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server Error. Please try again later' });
  }
});

module.exports = authRouter;
