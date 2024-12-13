const commentsRouter = require("express").Router();
const Comment = require("../models/comment");
const Answer = require("../models/answers");
const Question = require("../models/questions");
// Create a comment and store in database
commentsRouter.post("/", async (req, res) => {
  if (!req.session.user) {
    res.status(401).json({ message: "You must be logged in to comment" });
    return; 
  }

  try {
    const answer_id = req.body.answer_id;
    const question_id = req.body.question_id;
    const newComment = new Comment({
      text: req.body.text,
      posted_by: req.session.user._id,
    });
    const savedComment = await newComment.save();

    // Push the comment into its answer if answer is defined
    if (answer_id) {
      const update = await Answer.findOneAndUpdate(
        { _id: answer_id },
        { $push: { comments: newComment._id } },
        { new: true }
      );
      console.log(update);
      if (update)
        res.status(200).json({
          message: "Successfully saved comment",
          comment: savedComment,
        });
      return;
    }
    // Push the comment into its question if question is defined
    console.log("question id ", question_id);
    if (question_id) {
      const update = await Question.findOneAndUpdate(
        { _id: question_id },
        { $push: { comments: newComment._id } },
        { new: true }
      );
      if (update)
        res.status(200).json({
          message: "Successfully saved comment",
          comment: savedComment,
        });
      return;
    }
    res.status(400).json({ message: "Error saving comment" });
    console.log("posting comments");
  } catch (error) {
    console.log("error???");
    res
      .status(500)
      .json({ message: "Error saving comment", error: error.message });
  }
});

// Get comment(s) database.
commentsRouter.get("/", async (req, res) => {
  try {
    const question_id = req.query.question_id;
    const answer_id = req.query.answer_id;
    if (question_id) {
      const questionWithComments = await Question.findOne({
        _id: question_id,
      }).populate({
        path: "comments",
        populate: { path: "posted_by", model: "User" },
      });
      if (questionWithComments)
        res.status(200).json(questionWithComments.comments);
      else res.status(404).json({ message: "Question not found" });
    }

    if (answer_id) {
      const answerWithComments = await Answer.findOne({
        _id: answer_id,
      }).populate({
        path: "comments",
        populate: { path: "posted_by", model: "User" },
      });
      if (answerWithComments) res.status(200).json(answerWithComments.comments);
      else res.status(404).json({ message: "Answer not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting comments", error: error.message });
  }
});

// Update a comment
commentsRouter.patch("/", async (req, res) => {
  if (!req.session.user) {
    res.status(401).json({ message: "You must be logged in to comment" });
    return;
  }
  if (req.session.user._id !== req.body.posted_by) {
    res.status(401).json({ message: "You can only edit your own comment" });
    return;
  }

  try {
    const comment_id = req.body.comment_id;
    const text = req.body.text;
    const update = await Comment.findOneAndUpdate(
      { _id: comment_id },
      { text: text },
      { new: true }
    );
    if (update)
      res
        .status(200)
        .json({ message: "Successfully updated comment", comment: update });
    else res.status(400).json({ message: "Error updating comment" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating comment", error: error.message });
  }
});

// Delete a comment
commentsRouter.delete("/", async (req, res) => {
  if (!req.session.user || req.session.user._id !== req.body.posted_by) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const comment_id = req.body.comment_id;
    const answer_id = req.body.answer_id;
    const question_id = req.body.question_id;
    const update = await Comment.deleteOne({ _id: comment_id });
    if (update.deletedCount === 1) {
      // Pull the comment from its answer if answer is defined
      if (answer_id) {
        const update = await Answer.findOneAndUpdate(
          { _id: answer_id },
          { $pull: { comments: comment_id } },
          { new: true }
        );
        if (update)
          res
            .status(200)
            .json({ message: "Successfully deleted comment", comment: update });
        return;
      }
      // Pull the comment from its question if question is defined
      if (question_id) {
        const update = await Question.findOneAndUpdate(
          { _id: question_id },
          { $pull: { comments: comment_id } },
          { new: true }
        );
        if (update)
          res
            .status(200)
            .json({ message: "Successfully deleted comment", comment: update });
        return;
      }
    }
    res.status(400).json({ message: "Error deleting comment" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting comment", error: error.message });
  }
});

// Upvote a comment
commentsRouter.patch("/upvote", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Update question votes
    const { comment_id } = req.query;
    let comment = await Comment.findOne({ _id: comment_id });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Remove user ID from votes set if already present
    if (comment.votes.includes(req.session.user._id)) {
      comment = await Comment.findOneAndUpdate(
        { _id: comment_id },
        {
          $pull: { votes: req.session.user._id },
        },
        { new: true }
      );
    } else {
      // Add user ID to votes set if not already present
      comment = await Comment.findOneAndUpdate(
        { _id: comment_id },
        {
          $addToSet: { votes: req.session.user._id },
        },
        { new: true }
      );
    }

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    console.log(comment);
    return res.status(200).json({
      messsage: "Success",
      votes: comment.votes.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = commentsRouter;
