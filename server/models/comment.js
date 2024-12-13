// Comment Document Schema
const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  text: {
      type: String,
      required: true,
  },
  posted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  votes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  post_time: {
    type: Date,
    default: Date.now,
  },
});

commentSchema.virtual("url").get(function() {
  return `posts/comment/${this._id}`;
});

module.exports = mongoose.model("Comment", commentSchema);
