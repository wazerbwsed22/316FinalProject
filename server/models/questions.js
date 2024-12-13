const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: 50,
    required: true,
  },
  summary: {
    type: String,
    maxlength: 140,
    required: true,
  },
  text: {
    type: String,
  },
  tags: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
      required: true,
    }],
    validate: {
      validator: function(tags) {
        return tags.length >= 1;
      },
      message: 'one or more tag is required.'
    }
  },
  answers: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
    }],
    default: [],
  },
  comments: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    }],
    default: [],
  },
  asked_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  posted_time: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Number,
    default: 0,
  },
  votes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  downvotes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
});

questionSchema.virtual("url").get(function() {
  return `posts/question/${this._id}`;
});

module.exports = mongoose.model("Question", questionSchema);
