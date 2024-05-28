const { Schema, model } = require("mongoose");

const missionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      maxlength: 100,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: Date,
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: 1000,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Ngo",
      required: [
        true,
        "Must be affiliated to an organization. Something must be really wrong",
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Mission = model("Mission", missionSchema);

module.exports = Mission;
