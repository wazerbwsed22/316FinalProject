// const questionsRouter = require("express").Router();
// const Question = require("../models/questions");
// const Tag = require("../models/tags");
// const Answer = require("../models/answers");
// const Comment = require("../models/comment");
// const questions = require("../models/questions");
// const axios = require("axios");
// const User = require("../models/users");

// // Create an question and store in database
// questionsRouter.post("/", async (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }
//   try {
//     const { title, summary, question_text, tag_strings } = req.body;

//     // Check if tags exist in database, if not, create them
//     let tags = [];
//     tags = await Promise.all(
//       tag_strings.map(async (tag_string) => {
//         const tag = await Tag.findOne({ name: tag_string });
//         if (tag) {
//           return tag.id;
//         } else {
//           const newTag = new Tag({
//             name: tag_string,
//             created_by: req.session.user._id,
//           });
//           const savedTag = await newTag.save();
//           if (!savedTag) {
//             return res.status(400).json({ error: "Could not save tag" });
//           }
//           console.log(savedTag);
//           return savedTag.id;
//         }
//       })
//     );

//     console.log(tags);
//     const question = new Question({
//       title: title,
//       summary: summary,
//       text: question_text,
//       tags: tags,
//       asked_by: req.session.user._id,
//     });
//     const savedQuestion = await question.save();
//     if (!savedQuestion) {
//       return res.status(400).json({ error: "Could not save question" });
//     }
//     return res.status(201).json(savedQuestion);
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ error: "Internal server error", json: error });
//   }
// });

// // Get question(s) database.
// questionsRouter.get("/", async (req, res) => {
//   console.log("in here get questions");
//   try {
//     const { question_id, tag } = req.query;

//     // If question_id is present, return that question
//     if (question_id) {
//       const question = await Question.findById(question_id).populate([
//         "tags",
//         "answers",
//         "asked_by",
//         "comments",
//         {
//           path: "comments",
//           populate: {
//             path: "posted_by",
//             model: "User",
//           },
//         },
//       ]);
//       if (!question) {
//         return res.status(404).json({ error: "Question not found" });
//       }
//       return res.status(200).json(question);
//     }

//     // If tag is present, return questions with that tag
//     if (tag) {
//       let questions = await Question.find({ tags: { $in: [tag] } }).populate([
//         "tags",
//         "answers",
//         "asked_by",
//         "comments",
//         {
//           path: "comments",
//           populate: {
//             path: "posted_by",
//             model: "User",
//           },
//         },
//       ]);
//       return res.status(200).json(questions);
//     }

//     // If no query parameters are present, return all questions
//     let questions = await Question.find({})
//       .sort({ posted_time: -1 })
//       .populate([
//         "tags",
//         "answers",
//         "asked_by",
//         "comments",
//         {
//           path: "comments",
//           populate: {
//             path: "posted_by",
//             model: "User",
//           },
//         },
//       ]);
//     return res.status(200).json(questions);
    
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Update a question
// questionsRouter.patch("/", async (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }
//   const { question_id, summary, title, question_text, tag_strings } = req.body;

//   const updateFields = {};
//   if (title) {
//     updateFields.title = title;
//   }
//   if (summary) {
//     updateFields.summary = summary;
//   }
//   if (question_text) {
//     updateFields.text = question_text;
//   }
//   if (tag_strings) {
//     // Check if tags exist in database, if not, create them
//     let tags = [];
//     tags = await Promise.all(
//       tag_strings.map(async (tag_string) => {
//         const tag = await Tag.findOne({ name: tag_string });
//         if (tag) {
//           return tag.id;
//         } else {
//           const newTag = new Tag({
//             name: tag_string,
//             created_by: req.session.user._id,
//           });
//           const savedTag = await newTag.save();
//           if (!savedTag) {
//             return res.status(400).json({ error: "Could not save tag" });
//           }
//           console.log(savedTag);
//           return savedTag.id;
//         }
//       })
//     );
//     updateFields.tags = tags;
//   }
//   const question = await Question.findOneAndUpdate(
//     { _id: question_id, asked_by: req.session.user._id },
//     updateFields,
//     { new: true }
//   );
//   if (!question) {
//     return res.status(404).json({ error: "Question not found" });
//   }
//   return res.status(200).json(question);
// });

// // Delete a question
// questionsRouter.delete("/", async (req, res) => {
//   try {
//     if (!req.session.user) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }
//     const { question_id } = req.query;
//     let question = await Question.findOne({ _id: question_id });
//     question = await question.populate(["answers", "comments"]);
//     if (!question) {
//       return res.status(404).json({ error: "Question not found" });
//     }
    
//     // Delete comments of the answers
//     for (const answer of question.answers) {
//       await Comment.deleteMany({ _id: { $in: answer.comments } });
//     }

//     // Delete comments of the question
//     await Comment.deleteMany({ _id: { $in: question.comments } });

//     // Delete answers of the question
//     await Answer.deleteMany({ _id: { $in: question.answers } });

//     question = await Question.findOneAndDelete({
//       _id: question_id,
//       asked_by: req.session.user._id,
//     });
//     console.log(req.session.user._id);
//     if (!question) {
//       return res.status(404).json({ error: "Question not found" });
//     }

//     return res.status(200).json(question);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

// questionsRouter.patch("/view", async (req, res) => {
//   try {
//     if (!req.session.user) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }
//     const { question_id } = req.query;
//     const question = await Question.findOneAndUpdate(
//       { _id: question_id },
//       { $inc: { views: 1 } },
//       { new: true }
//     );
//     if (!question) {
//       return res.status(404).json({ error: "Question not found" });
//     }
//     return res.status(200).json({ messsage: "Success", views: question.views });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

// questionsRouter.patch("/upvote", async (req, res) => {
//   try {
//     if (!req.session.user || req.session.user.reputation < 50) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     // Update question votes
//     const { question_id } = req.query;
//     let question = await Question.findOne({ _id: question_id });
//     if (!question) {
//       return res.status(404).json({ error: "Question not found" });
//     }
//     // Remove user ID from downvotes set if already present
//     if (question.votes.includes(req.session.user._id)) {
//       question = await Question.findOneAndUpdate(
//         { _id: question_id },
//         { $pull: { votes: req.session.user._id } },
//         { new: true }
//       );
//       if (question) {
//         // Increment user repuation
//         const user = await User.findOneAndUpdate(
//           { _id: req.session.user._id },
//           { $inc: { reputation: -5 } },
//           { new: true }
//         );
//       }
//     } else {
//       // Add user ID to votes set if not already present
//       question = await Question.findOneAndUpdate(
//         { _id: question_id },
//         {
//           $pull: { downvotes: req.session.user._id },
//           $addToSet: { votes: req.session.user._id },
//         },
//         { new: true }
//       );
//       if (question) {
//         // Increment user repuation
//         const user = await User.findOneAndUpdate(
//           { _id: req.session.user._id },
//           { $inc: { reputation: 5 } },
//           { new: true }
//         );
//       }
//     }

//     if (!question) {
//       return res.status(404).json({ error: "Question not found" });
//     }

//     return res.status(200).json({
//       messsage: "Success",
//       votes: question.votes.length - question.downvotes.length,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

// questionsRouter.patch("/downvote", async (req, res) => {
//   try {
//     if (!req.session.user || req.session.user.reputation < 50) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }
//     // Update question votes
//     const { question_id } = req.query;
//     let question = await Question.findOne({ _id: question_id });
//     if (!question) {
//       return res.status(404).json({ error: "Question not found" });
//     }

//     // Remove user ID from votes set if already present
//     if (question.downvotes.includes(req.session.user._id)) {
//       question = await Question.findOneAndUpdate(
//         { _id: question_id },
//         { $pull: { downvotes: req.session.user._id } },
//         { new: true }
//       );
//       if (question) {
//         // Increment user reputation
//         const user = await User.findOneAndUpdate(
//           { _id: req.session.user._id },
//           { $inc: { reputation: 10 } },
//           { new: true }
//         );
//       }
//     } else {
//       // Add user ID to votes set if not already present
//       question = await Question.findOneAndUpdate(
//         { _id: question_id },
//         {
//           $pull: { votes: req.session.user._id },
//           $addToSet: { downvotes: req.session.user._id },
//         },
//         { new: true }
//       );
//       if (question) {
//         // Decrement user reputation
//         const user = await User.findOneAndUpdate(
//           { _id: req.session.user._id },
//           { $inc: { reputation: -10 } },
//           { new: true }
//         );
//       }
//     }

//     if (!question) {
//       return res.status(404).json({ error: "Question not found" });
//     }

//     return res.status(200).json({
//       messsage: "Success",
//       votes: question.votes.length - question.downvotes.length,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = questionsRouter;

const questionsRouter = require("express").Router();
const Question = require("../models/questions");
const Tag = require("../models/tags");
const Answer = require("../models/answers");
const Comment = require("../models/comment");
const questions = require("../models/questions");
const axios = require("axios");
const User = require("../models/users");

// Create and store a question
//done
questionsRouter.post("/", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const { title, summary, question_text, tag_strings } = req.body;

    // Check if tags exist in database, if not, create them
    let tags_list = [];
    tags_list = await Promise.all(
      tag_strings.map(async (tag_string) => {
        const tag = await Tag.findOne({ name: tag_string });
        if (tag) {
          return tag.id;
        } else {
          const newTag = new Tag({
            name: tag_string,
            created_by: req.session.user._id,
          });
          console.log("new tag ",newTag );
          const saved_tag = await newTag.save();
          if (!saved_tag) {
            return res.status(400).json({ error: "Could not save tag" });
          }
          console.log(saved_tag);
          return saved_tag.id;
        }
      })
    );

    const new_question = new Question({
      title: title,
      text: question_text,
      tags: tags_list,
      summary: summary,
      asked_by: req.session.user._id,
    });
    const saved_question = await new_question.save();
    if (!saved_question) {
      return res.status(400).json({ error: "Not able to save question" });
    }
    return res.status(201).json(saved_question);
  } catch (error) {
    return res.status(500).json({ error: "Server error", json: error });
  }

});



// Get questions.
//done
questionsRouter.get("/", async (req, res) => {
  try {
    //const { question_id, tag } = req.query;
    const question_id = req.query.question_id;
    const tag = req.query.tag;

    // If question_id is present, return that question
    if (question_id) {
      const question = await Question.findById(question_id).populate([
        "tags",
        "answers",
        "asked_by",
        "comments",
        {
          path: "comments",
          populate: {
            path: "posted_by",
            model: "User",
          },
        },
      ]);
      if (!question) {
        return res.status(404).json({
          status: 'error',
          message: 'Question not found'
      });
      }
      return res.status(200).json(question);
    }
    // If tag, return questions
    if (tag) {
      let questions = await Question.find({ tags: { $in: [tag] } }).populate([
        "tags",
        "answers",
        "asked_by",
        "comments",
        {
          path: "comments",
          populate: {
            path: "posted_by",
            model: "User",
          },
        },
      ]);
      return res.status(200).json(questions);
    }

    // If no query present, return all questions
    let questions = await Question.find({})
      .sort({ posted_time: -1 })
      .populate([
        "tags",
        "answers",
        "asked_by",
        "comments",
        {
          path: "comments",
          populate: {
            path: "posted_by",
            model: "User",
          },
        },
      ]);
    return res.status(200).json(questions);
  } catch (err) {
    return res.status(500).json({ error: "Some err" });
  }
});

// Delete question
//done
questionsRouter.delete("/", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "not allow" });
  }
  try {
    const question_id  = req.query.question_id;
    let question = await Question.findOne({ _id: question_id });
    question = await question.populate(["answers", "comments"]);
    if (!question) {
      return res.status(404).json({ error: "Question was not found" });
    } 
    await Comment.deleteMany({ _id: { $in: question.comments } });
    await Answer.deleteMany({ _id: { $in: question.answers } });
    for (const ans of question.answers) {
      await Comment.deleteMany({ _id: { $in: ans.comments } });
    }
    question = await Question.findOneAndDelete({
      _id: question_id,
      asked_by: req.session.user._id,
    });
    console.log(req.session.user._id);
    if (question) {
      return res.status(200).json(question);
    }
    else
    {
      return res.status(404).json({ error: "Question not found" });
    }

    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "some err" });
  }
});

// Update
//done
questionsRouter.patch("/", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  // console.log("kkaok" , req.body);
  const question_id = req.body.question_id;
  const summary = req.body.summary;
  const title = req.body.title;
  const question_text = req.body.question_text;  
  const tag_strings = req.body.tag_strings;
  const updated_ques = {};
  var flag_check = 0;

  const new_fields = {};
  if (title) {
    new_fields.title = title;
    flag_check = 1;
  }
  if (summary) {
    new_fields.summary = summary;
    flag_check = 1;
  }
  if (question_text) {
    new_fields.text = question_text;
    flag_check = 1;
  }
  if (tag_strings) {
    let tags = [];
    tags = await Promise.all(
      tag_strings.map(async (tag_string) => {
        const tag_temp = await Tag.findOne({ name: tag_string });
        const tag = await Tag.findOne({ name: tag_string });
        if (tag) {
          return tag.id;
        } else {
          const new_Tag = new Tag({
            name: tag_string,
            created_by: req.session.user._id,
          });
          const saved_Tag = await new_Tag.save();
          if (!saved_Tag) {
            return res.status(400).json({ error: "Can't save tag" });
          }
          return saved_Tag.id;
        }
      })
    );
    new_fields.tags = tags;
  }

  const question = await Question.findOneAndUpdate(
    { _id: question_id, asked_by: req.session.user._id }, new_fields, { new: true }
  );
  if (!question) {
    return res.status(404).json({ error: "Question was not found" });
  }
  return res.status(200).json(question);
});


// questionsRouter.patch("/", async (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ err: "not allow" });
//   }

//   console.log("kkaok" , req.body);
//   const question_id = req.body.question_id;
//   const summary = req.body.summary;
//   const title = req.body.title;
//   const question_text = req.body.question_text;  // Ensure consistency in naming convention
//   const tagStrings = req.body.tag_strings;
//   const updated_ques = {};
//   var flag_check = 0;

//   if (summary) {
//     updated_ques.summary = summary;
//     flag_check = 1;
//   }
//   if (question_text) {
//     updated_ques.question_text = question_text;  // Correct property name as per your schema
//     flag_check = 1;
//   }
//   if (title) { 
//     updated_ques.title = title;
//     flag_check = 1;
//   }
//   if (tagStrings) {
//     flag_check = 1;
//     let tags_list = await Promise.all(
//       tagStrings.map(async (tag_str) => {
//         const tag = await Tag.findOne({ name: tag_str });
//         if (tag) {
//           return tag.id;
//         } else {
//           const newTag = new Tag({
//             name: tag_str,
//             created_by: req.session.user._id,
//           });
//           const saved_tag = await newTag.save();
//           if (!saved_tag) {
//             return res.status(400).json({ error: "Tag was not saved" });
//           }
//           return saved_tag.id;
//         }
//       })
//     );
//     updated_ques.tags = tags_list;
//   }
//   const quest = await Question.findOneAndUpdate(
//     { _id: question_id, asked_by: req.session.user._id },
//     updated_ques,
//     { new: true }
//   );
//   console.log(quest)
//   if (!quest) {
//     return res.status(404).json({ err: "Question was not found" });
//   }
//   return res.status(200).json(quest);
// });

//done
questionsRouter.patch("/upvote", async (req, res) => {
  try {
    //check user rep as well -mJahnavi
    if (!req.session.user || req.session.user.reputation < 50) {
      return res.status(401).json({ error: "not allow" });
    }
    const  question_id  = req.query.question_id;
    let quest= await Question.findOne({ _id: question_id });
    if (!quest) {
      return res.status(404).json({ error: "Question was not found" });
    }
    if (quest.votes.includes(req.session.user._id)) {
      quest = await Question.findOneAndUpdate(
        { _id: question_id },
        { $pull: { votes: req.session.user._id } },
        { new: true }
      );
      if (quest) {
        const user = await User.findOneAndUpdate(
          { _id: req.session.user._id },
          { $inc: { reputation: -5 } },
          { new: true }
        );
      }
    } else {
      // Add user ID to votes set if not already present
      quest = await Question.findOneAndUpdate(
        { _id: question_id },
        {
          $pull: { downvotes: req.session.user._id },
          $addToSet: { votes: req.session.user._id },
        },
        { new: true }
      );
      if (quest) {
        const user = await User.findOneAndUpdate(
          { _id: req.session.user._id },
          { $inc: { reputation: 5 } },
          { new: true }
        );
      }
    }
    if (!quest) {
      return res.status(404).json({ error: "Question was not found" });
    }
    return res.status(200).json({
      votes: quest.votes.length - quest.downvotes.length,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ e: "Some Error" });
  }
});

//done
questionsRouter.patch("/downvote", async (req, res) => {
  try {
    if (!req.session.user || req.session.user.reputation < 50) {
      return res.status(401).json({ error: "no allow" });
    }
    // Update question votes
    const  question_id  = req.query.question_id;
    let quest = await Question.findOne({ _id: question_id });
    if (!quest) {
      return res.status(404).json({ error: "Question was not found" });
    }
    
    if (quest.downvotes.includes(req.session.user._id)) {
      quest = await Question.findOneAndUpdate(
        { _id: question_id },
        { $pull: { downvotes: req.session.user._id } },
        { new: true }
      );
      if (quest) {
        // Increment user reputation
        const user = await User.findOneAndUpdate(
          { _id: req.session.user._id },
          { $inc: { reputation: 10 } },
          { new: true }
        );
      }
    } else {
      // Add user ID to votes set if not already present
      quest = await Question.findOneAndUpdate(
        { _id: question_id },
        {
          $pull: { votes: req.session.user._id },
          $addToSet: { downvotes: req.session.user._id },
        },
        { new: true }
      );
      if (quest) {
        // Decrement user reputation
        const user = await User.findOneAndUpdate(
          { _id: req.session.user._id },
          { $inc: { reputation: -10 } },
          { new: true }
        );
      }
    }

    if (!quest) {
      return res.status(404).json({ error: "Questionw was not found" });
    }
    return res.status(200).json({
      votes: quest.votes.length - quest.downvotes.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Some error" });
  }
});

//done
questionsRouter.patch("/view", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "not allow" });
    }
    const  question_id  = req.query.question_id;
    const ques = await Question.findOneAndUpdate(
      { _id: question_id },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!ques) {
      return res.status(404).json({ error: "Question was not found" });
    }
    return res.status(200).json({ views: ques.views });
  } catch (error) {
    return res.status(500).json({ error: "Error debug more to find" });
  }
});

module.exports = questionsRouter;



