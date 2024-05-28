const { Schema, model, SchemaType } = require("mongoose");

const postSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    maxlength: 100,
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  image: {
    type: Image,
    default: null,
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Ngo",
    required: [true, "Must be linked to an organization"],
  },
  mission: {
    type: Schema.Types.ObjectId,
    ref: "Mission",
    default: null,
  },
});

const Post = model("post", postSchema);

module.exports = Post;
