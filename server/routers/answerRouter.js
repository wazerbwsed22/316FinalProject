const answersRouter = require("express").Router();
const Answer = require("../models/answers");
const Question = require("../models/questions");
const User = require("../models/users");

// Create an answer and store in database
answersRouter.post("/", async (req, res) => {
  console.log("comes here!!!");
try {

  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
}

// Initialize and save a new Answer document
const newAnswer = new Answer({
    text: req.body.text,
    ans_by: req.session.user._id,
});

    const savedAnswer = await newAnswer.save();
    console.log(" NEW ANSWER ", req.session.user._id);
    
 
        // Push the answer into its question
        const update = await Question.findOneAndUpdate(
          { _id: req.body.question_id },
          { $push: { answers: newAnswer._id } },
          { new: true }
        );

        if (!update) {
          res.status(404).json({ error: "Question not found" });
          return;
        }

    console.log("POSTED ANSWER");
    res.status(200).json({ message: "Successfully saved answer", answer: savedAnswer });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save answer to database", error: error });
}
});

// Get answer(s) of question database.
answersRouter.get("/", async (req, res) => {
//   console.log("getting question from here! ");

//   try {
//     const question_id = req.query.question_id;
//     console.log("EW ",req.query.user_id );

//     if (!question_id) {
//         return res.status(400).json({ error: "Missing parameters: either question_id or user_id must be provided." });
//     }

//     if (question_id) {
//       console.log("in if statement");
//       const questionWithAnswers = await Question.find({}).populate({
//         path: "answers",
//         populate: [
//           {
//             path: "ans_by",
//             model: "User",
//           },
//           {
//             path: "comments",
//             populate: {
//               path: "posted_by",
//               model: "User",
//             },
//           },
//         ],
//       }).populate("tags");
//       console.log("ANSWERES > ", questionWithAnswers);
//       const filteredQuestionWithAnswers = questionWithAnswers.filter(question => {
//         return question.answers.some(answer => {
//           return answer.ans_by._id == req.query.user_id;
//         })
//       });
//       res.status(200).json(filteredQuestionWithAnswers);
//      }

//     else {
//       console.log("in else statement ");


//       const question_id = req.query.question_id;
//       const questionWithAnswers = await Question.findOne({
//         _id: question_id,
//       }).populate({
//         path: "answers",
//         populate: [
//           {
//             path: "ans_by",
//             model: "User",
//           },
//           {
//             path: "comments",
//             populate: {
//               path: "posted_by",
//               model: "User",
//             },
//           },
//         ],
//       });
//       res.status(200).json(questionWithAnswers.answers);

//       }
//     console.log("done with try funct");
// } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to retrieve answers from database", error });
// }

try {
  // If question_id is not present, return all answers by user
  if (!req.query.question_id && req.query.user_id) {
    const questionWithAnswers = await Question.find({}).populate({
      path: "answers",
      populate: [
        {
          path: "ans_by",
          model: "User",
        },
        {
          path: "comments",
          populate: {
            path: "posted_by",
            model: "User",
          },
        },
      ],
    }).populate("tags");
    const filteredQuestionWithAnswers = questionWithAnswers.filter(question => {
      return question.answers.some(answer => {
        return answer.ans_by._id == req.query.user_id;
      })
    });
    res.status(200).json(filteredQuestionWithAnswers);
  } else {
    const question_id = req.query.question_id;
    const questionWithAnswers = await Question.findOne({
      _id: question_id,
    }).populate({
      path: "answers",
      populate: [
        {
          path: "ans_by",
          model: "User",
        },
        {
          path: "comments",
          populate: {
            path: "posted_by",
            model: "User",
          },
        },
      ],
    });
    res.status(200).json(questionWithAnswers.answers);
  }
} catch (error) {
  console.log(error);
  res
    .status(500)
    .json({ message: "Failed to retrieve answers from database" });
}
});

// Delete an answer
answersRouter.delete("/", async (req, res) => {
  if (!req.session.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const deletedAnswer = await Answer.deleteOne({ _id: req.body.answer_id });
    if (!deletedAnswer) {
      res.status(404).json({ error: "Answer not found" });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete answer from database" });
  }
});

answersRouter.patch("/upvote", async (req, res) => {
  try {
    if (!req.session.user || req.session.user.reputation < 50) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Update question votes
    const { answer_id } = req.query;
    let answer = await Answer.findOne({ _id: answer_id });
    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    // If user has already upvoted, remove upvote
    if (answer.votes.includes(req.session.user._id)) {
      answer = await Answer.findOneAndUpdate(
        { _id: answer_id },
        { $pull: { votes: req.session.user._id } },
        { new: true }
      );
      if (answer) {
        // Increment user repuation
        const user = await User.findOneAndUpdate(
          { _id: req.session.user._id },
          { $inc: { reputation: -5 } },
          { new: true }
        );
      }
    } else {
      // If user has already downvoted, remove downvote and add upvote
      answer = await Answer.findOneAndUpdate(
        { _id: answer_id },
        {
          $pull: { downvotes: req.session.user._id },
          $addToSet: { votes: req.session.user._id },
        },
        { new: true }
      );
      if (answer) {
        // Increment user repuation
        const user = await User.findOneAndUpdate(
          { _id: req.session.user._id },
          { $inc: { reputation: 5 } },
          { new: true }
        );
      }
    }

    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    return res.status(200).json({
      messsage: "Success",
      votes: answer.votes.length - answer.downvotes.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

answersRouter.patch("/downvote", async (req, res) => {
  try {
    if (!req.session.user || req.session.user.reputation < 50) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // Update answer votes
    const { answer_id } = req.query;
    let answer = await Answer.findOne({ _id: answer_id });
    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }
    if (answer.downvotes.includes(req.session.user._id)) {
      answer = await Answer.findOneAndUpdate(
        { _id: answer_id },
        { $pull: { downvotes: req.session.user._id } },
        { new: true }
      );
      if (answer) {
        // Increment user reputation
        const user = await User.findOneAndUpdate(
          { _id: req.session.user._id },
          { $inc: { reputation: 10 } },
          { new: true }
        );
      }
    } else {
      answer = await Answer.findOneAndUpdate(
        { _id: answer_id },
        {
          $pull: { votes: req.session.user._id },
          $addToSet: { downvotes: req.session.user._id },
        },
        { new: true }
      );

      if (answer) {
        const user = await User.findOneAndUpdate(
          { _id: req.session.user._id },
          { $inc: { reputation: -10 } },
          { new: true }
        );
      }
    }

    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    return res.status(200).json({
      messsage: "Success",
      votes: answer.votes.length - answer.downvotes.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = answersRouter;
