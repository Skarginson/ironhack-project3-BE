const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      // Rajouter la validation pour les mails via regex
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    organizations: {
      type: [
        {
          organisation: { type: Schema.Types.ObjectId, ref: "Ngo" },
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
