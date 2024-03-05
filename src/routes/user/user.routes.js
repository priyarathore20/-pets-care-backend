import express from "express";
import { editUserValidation } from "../../validation/edit.user.validation.js";

const userRouter = express.Router();

// // To edit a user

userRouter.put("/:id", async (request, response) => {
  try {
    const { email, phoneNumber, name, gender } = request?.body;
    const { error } = editUserValidation(request?.body);

    console.log(JSON.stringify(error, null, 2));

    if (error?.details?.length) {
      return res.status(400).send({ message: error.message });
    }

    const { id } = request.params;
    const result = await Users.findByIdAndUpdate(id, {
      email,
      phoneNumber,
      gender,
      name,
    });
    if (!result) {
      return response.status(404).send({ message: "User not found" });
    }
    return response.status(201).send({ message: "User updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default userRouter;
