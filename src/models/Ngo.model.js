const { Schema, model } = require("mongoose");

const ngoSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required."],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  image: {
    type: Image,
  },
  identification: {
    //RNA for associations created in France, maybe something else if needed ?
    type: String,
    required: [true, "RNA is required"],
    maxlength: 10,
  },
  donationLink: {
    type: String,
    default: null,
  },
  verified: {
    default: false,
  },
});

const Ngo = model("Ngo", ngoSchema);

module.exports = Ngo;
