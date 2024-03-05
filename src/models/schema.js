import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
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

const PetSchema = mongoose.Schema(
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
    size: {
      type: String,
      required: false,
    },
    weight: {
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

export const Users = mongoose.model("Users", UserSchema);
export const Pets = mongoose.model("Pets", PetSchema);
