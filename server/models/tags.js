
const mongoose = require("mongoose");
const tagSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

tagSchema.virtual("url").get(function() {
  return `posts/tag/${this._id}`;
});


module.exports = mongoose.model("Tag", tagSchema);