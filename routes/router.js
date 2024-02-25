import express from "express";
import { Pets, Users } from "../models/schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

const secretKey = "your-secret-key";

// Function to generate JWT
function generateToken(user) {
  const { _id, phoneNumber, email, gender, name } = user;
  return jwt.sign({ id: _id, phoneNumber, email, gender, name }, secretKey, {
    expiresIn: "6d",
  });
}

const phoneNumberRegex = /^\d{10}$/;
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

/* User CRU request */

// To get all users

router.get("/", async (request, response) => {
  try {
    const users = await Users.find({});
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

// To create a user

router.post("/signup", async (req, res) => {
  try {
    let email = req?.body?.email;
    let phoneNumber = req?.body?.phoneNumber;
    let password = req?.body?.password;
    let name = req?.body?.name;
    let gender = req?.body?.gender;

    if (!phoneNumberRegex.test(phoneNumber)) {
      console.log("Valid phone number!");
      return res.status(400).json({ message: "Invalid phone number" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (!gender) {
      return res.status(400).json({ message: "Enter your gender" });
    }

    if (!name) {
      return res.status(400).json({ message: "Enter your name" });
    }

    if (!password) {
      return res.status(400).json({ message: "Enter your password" });
    }

    const existUser = await Users.findOne({ email: email });
    if (existUser) {
      return res
        .status(409)
        .json({ message: "User already exists. Login instead!" });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = new Users({
      email,
      phoneNumber,
      name,
      gender,
      password: hashedPassword,
    });
    await newUser.save();

    const token = generateToken(newUser);
    res.status(201).json({ token, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// To login a user

router.post("/login", async (req, res) => {
  try {
    const { password, email } = req?.body ?? {};

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (!password) {
      return res.status(400).json({ message: "Enter your password" });
    }

    // Find the user in the database
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate a JWT and send it in the response
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// To get a user

router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const user = await Users.findById(id);
    return response.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// // To edit a user

router.put("/:id", async (request, response) => {
  try {
    if (
      !request.body.name ||
      !request.body.email ||
      !request.body.phoneNumber ||
      !request.body.gender ||
      !request.body.password
    ) {
      return response.status(400).send({
        message: "Send all required fields: title, author, publishYear",
      });
    }
    const { id } = request.params;
    const result = await Users.findByIdAndUpdate(id, request.body);
    if (!result) {
      return response.status(404).send({ message: "User not found" });
    }
    return response.status(201).send({ message: "User updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
