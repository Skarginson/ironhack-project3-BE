const { Schema, model } = require("mongoose");

const missionSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    maxlength: 100,
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"],
  },
  endDate: {
    type: Date,
    default: null,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
});

const Mission = model("mission", missionSchema);

module.exports = Mission;
