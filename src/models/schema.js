const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const PetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    sex: {
      type: String,
      required: true,
    },
    breed: {
      type: String,
      required: true,
    },
    species: {
      type: String,
      required: false,
    },
    color: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    healthInformation: {
      type: String,
      required: false,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("Users", UserSchema);
const Pets = mongoose.model("Pets", PetSchema);

module.exports = {
  Users,
  Pets
};
