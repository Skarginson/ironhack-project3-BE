const { Schema, model } = require("mongoose");

const userSchema = new Schema(
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
      select: false,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    organizations: {
      type: [
        {
          organization: { type: Schema.Types.ObjectId, ref: "Organization" },
          monthlyDonation: {
            amount: {
              type: Number,
              required: [true, "Donation Amount is required"],
              min: 1,
            },
            startDate: {
              type: Date,
              required: [true, "Donation StartDate is required"],
            },
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
