const { Schema, model, SchemaType } = require("mongoose");

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      maxlength: 100,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      maxlength: 4000,
    },
    image: {
      type: String,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Ngo",
      required: [true, "Must be linked to an organization"],
    },
    mission: {
      type: Schema.Types.ObjectId,
      ref: "Mission",
    },
  },
  {
    timestamps: true,
  }
);

const Post = model("Post", postSchema);

module.exports = Post;
