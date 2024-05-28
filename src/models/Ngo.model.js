const { Schema, model } = require("mongoose");

const ngoSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      validate: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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
      type: String,
    },
    identification: {
      //RNA for associations created in France, maybe something else if needed ?
      type: String,
      required: [true, "RNA is required"],
      minlength: 10,
      maxlength: 10,
    },
    donationLink: {
      type: String,
    },
    verifiedDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

function handleDelete(deletedNgo) {
  Mission.deleteMany({ owner: deletedNgo.id });
  Post.deleteMany({ owner: deletedNgo.id });
}
ngoSchema.post("findOneAndDelete", handleDelete);
ngoSchema.post("deleteOne", handleDelete);

const Ngo = model("Ngo", ngoSchema);

module.exports = Ngo;
