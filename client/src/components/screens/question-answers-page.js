
import React, { useContext } from "react";
import { UserContext } from "../user-context";
import "../../stylesheets/index.css";
import { getquestion_newest } from "./allSortings";
import { getAnswerMetaData } from "./getAnswer";
import { Divider } from "@mui/material";
import PostCommentPage from "./postCommentScreen";
import { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";


function Comments({ question, answer }) {
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const start = (page - 1) * 3;
  const end = page * 3;



  useEffect(() => {
    let config = {
      maxBodyLength: Infinity,
      url: question
        ? `http://localhost:8000/api/comments?question_id=${question._id}`
        : `http://localhost:8000/api/comments?answer_id=${answer._id}`,
      headers: {},
      method: "get"
    };

    axios.request(config).then((response) => {
        setComments(response.data);
      }).catch((error) => {
        console.log(error);
      });
  }, [answer, question]);

  const sortedComments = comments.sort(
    (a, b) => new Date(b.post_time) - new Date(a.post_time)
  );

  if (sortedComments.length === 0) {
    return (
      <div>
        <div>No comments</div>
        <PostCommentPage
          currentQuestion={question}
          currentAnswer={answer}
          setComments={setComments}
        />
      </div>
    );
  }

  return (
    <div>
      {sortedComments.slice(start, end).map((comment) => (
        <CommentItems key={comment._id} comment={comment} />
      ))}
      <div style={{ margin: 10 }}>
        <button
          onClick={() => setPage(page === 1 ? 1 : page - 1)}
          style={{ marginRight: 10 }}
        >
          prev
        </button>
        <button
          onClick={() => setPage(page * 3 >= sortedComments.length ? page : page + 1)}
        >
          next
        </button>
      </div>
      <PostCommentPage
        currentQuestion={question}
        currentAnswer={answer}
        setComments={setComments}
      />
    </div>
  );
}


function CommentItems({ comment }) {
  const [user, setUser] = useContext(UserContext);
  const [votes, setVotes] = useState(comment.votes.length);

  const handleUpvote = async () => {
    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `http://localhost:8000/api/comments/upvote?comment_id=${comment._id}`,
      headers: {},
      withCredentials: true,
    };

    axios.request(config).then(response => {
      setVotes(response.data.votes);
      console.log("Upvote response data:", JSON.stringify(response.data, null, 2));
    }).catch(error => {
      console.log("Error during upvote:", JSON.stringify(error, null, 2));
    });
  };

  return (
    <div style={{ display: "flex", border: "dotted" }}>
      <p className="answer-text">{comment.text}</p>
      <p className="answer-text">comment by: {comment.posted_by.username}</p>
      <p className="answer-text">votes: {votes}</p>
      {user && (
        <div>
          <button style={{ margin: 10 }} onClick={handleUpvote}>
            Upvote
          </button>
        </div>
      )}
    </div>
  );
}


function tagsListItem(tag) {
  return (
    <div className="tag_item" key={JSON.stringify(tag)}>
      <p>{tag.name}</p>
    </div>
  );
}



const QuestionAnswersPage = ({setCurrentPage, setCurrentAnswer, question,  userMode, setCurrentQuestion
}) => {
  const navi = useNavigate();
  const [user, setUser] = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [votes, setVotes] = useState(question.votes.length);
  const start = (page - 1) * 5;
  const end = page * 5;

  const handleUpvote = async () => {
    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `http://localhost:8000/api/questions/upvote/?question_id=${question._id}`,
      headers: {},
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response);
        setVotes(response.data.votes);
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleDownvote = async () => {
    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `http://localhost:8000/api/questions/downvote/?question_id=${question._id}`,
      headers: {},
      withCredentials: true,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response);
        setVotes(response.data.votes);
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  var questionText = question.text;
  const hyperlinkRegex = /\[[^\]]+\]\([^)]+\)/g;
  var textArray = questionText.split(hyperlinkRegex);
  var hyperlinks = questionText.match(hyperlinkRegex);
  if (hyperlinks != null) {
    var hyperlinkLink = hyperlinks.map((hyperlink) =>
      hyperlink
        .match(/\(((https:\/\/|http:\/\/)).*\)/g)[0]
        .replace(/(\(|\))/g, "")
    ); //gets link from ()
    var hyperlinkHTML = hyperlinks.map((hyperlink, index) => (
      <a href={hyperlinkLink[index]} target="_blank" rel="noreferrer noopener">
        {hyperlink.match(/^\[[^\]]*\]/g)[0].replace(/(\[|\])/g, "")}
      </a>
    ));
    var i = 0;
    textArray = textArray.flatMap((text) => [text, hyperlinkHTML[i++]]);
  }
  const [answers, setAnswers] = useState([]);

  // Update with latest answers from the server
  useEffect(() => {
    const updateAnswers = async () => {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `http://localhost:8000/api/answers?question_id=${question._id}`,
        headers: {},
      };

      let answers = [];
      await axios
        .request(config)
        .then((response) => {
          answers = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
      setAnswers(getquestion_newest(answers));
    };
    updateAnswers();
  }, [question]);
console.log(answers)
  // Increment View
  useEffect(() => {
    const incrementView = async () => {
      let config = {
        method: "patch",
        maxBodyLength: Infinity,
        url: `http://localhost:8000/api/questions/view?question_id=${question._id}`,
        headers: {},
        withCredentials: true,
      };

      axios
        .request(config)
        .then((response) => {
          console.log("viewed question");
        })
        .catch((error) => {
          console.log(error);
        });
    };
    incrementView();
  }, [question]);

  return (
    <div>
      {answers ? (
        <div className="page">
          <div className="page-top">
            <div className="page-info">
              <p className="page-info-item">
                <b>{answers.length} answers</b>
              </p>
              <p className="page-info-item">
                <b>{votes} votes</b>
              </p>
              <h2 style={{ flexGrow: 1 }}>{question.title}</h2>
              {user && (
                <button
                  id="questionask-button"
                  onClick={() => setCurrentPage("Post Question")}
                >
                  Ask Question
                </button>
              )}
            </div>
            <div className="page-info">
              <p className="page-info-item">
                <b>{question.views + 1} views</b>
              </p>
              <p className="page-info-item" style={{ flexGrow: 1 }}>
                {textArray.map((text) => text)}
              </p>
              <QuestionMetaData question={question} />
            </div>
            <div
              className="result-item-tag-list"
              style={{ justifyContent: "right" }}
            >
              <h4>Tags: </h4>
              {question.tags.map((tag) => tagsListItem(tag))}
            </div>
            {user && (
              <div>
                <Button onClick={() => handleUpvote()}>Upvote</Button>
                <Button onClick={() => handleDownvote()}>Downvote</Button>
              </div>
            )}
            <div></div>
            <div>
              <h3>Question Comments</h3>
              <Comments question={question} answer={null} />
            </div>
          </div>
          <div>
          </div>
          <div>
            {userMode && <h1>Answers By Me</h1>}
            {userMode && (
              <h4>
                {
                  answers
                    .filter((answer) => answer.ans_by === user._id)
                    .map((answer) => (
                      <AnswerResultListItem
                        answer={answer}
                        key={`${answer._id}`}
                      />
                    )).length
                }{" "}
                answers from me
              </h4>
            )}
            {userMode
              ? answers
                  .filter((answer) => answer.ans_by === user._id)
                  .map((answer) => (
                    <AnswerResultListItem
                      answer={answer}
                      key={`${answer._id}`}
                    />
                  ))
              : null}
          </div>
            <Divider style={{ backgroundColor: 'black', borderWidth: '3px' }} />
          <div>
            <h1>Answers</h1>
            {answers.slice(start, end).map((answer) => (
              <AnswerResultListItem answer={answer} key={`${answer._id}`} />
            ))}
          </div>
          <div style={{ margin: 1 }}>
            <button
              className="button-blue"
              id="question-answer-button"
              onClick={() => setCurrentPage("Post Answer")}
            >
              Answer Question
            </button>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <div style={{ position: "fixed", bottom: 0, right: 0, margin: 10 }}>
        <Button
          variant="contained"
          onClick={() => setPage(page === 1 ? 1 : page - 1)}
          style={{ marginRight: 10 }}
        >
          prev
        </Button>
        <Button
          variant="contained"
          onClick={() => setPage(page * 5 >= answers.length ? page : page + 1)}
        >
          next
        </Button>
      </div>
    </div>
  );
};


const AnswerResultListItem = ({ answer }) => {
  const [user, setUser] = useContext(UserContext);
  const [votes, setVotes] = useState(answer.votes.length);

  const handleUpvote = async () => {
    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `http://localhost:8000/api/answers/upvote?answer_id=${answer._id}`,
      headers: {},
      withCredentials: true,
    };

    axios.request(config).then(response => {
      setVotes(response.data.votes);
      console.log("Upvote response data:", JSON.stringify(response.data));
    }).catch(error => {
      console.log("Error during upvote:", JSON.stringify(error));
    });
  };

  const handleDownvote = async () => {
    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `http://localhost:8000/api/answers/downvote?answer_id=${answer._id}`,
      headers: {},
      withCredentials: true,
    };

    axios.request(config).then(response => {
      setVotes(response.data.votes);
      console.log("Downvote response data:", JSON.stringify(response.data));
    }).catch(error => {
      console.log("Error during downvote:", JSON.stringify(error));
    });
  };

  const answerText = answer.text;
  const hyperlinkRegex = /\[[^\]]+\]\([^)]+\)/g;
  const textArray = answerText.split(hyperlinkRegex);
  const hyperlinks = answerText.match(hyperlinkRegex);
  let elements = [];

  if (hyperlinks) {
    const hyperlinkLinks = hyperlinks.map(hyperlink =>
      hyperlink.match(/\(((https:\/\/|http:\/\/)).*\)/g)[0].replace(/(\(|\))/g, "")
    );

    const hyperlinkHTML = hyperlinks.map((hyperlink, index) => 
      <a href={hyperlinkLinks[index]} target="_blank" rel="noreferrer noopener">
        {hyperlink.match(/^\[[^\]]*\]/g)[0].replace(/(\[|\])/g, "")}
      </a>
    );

    textArray.forEach((text, index) => {
      elements.push(text);
      if (hyperlinkHTML[index]) {
        elements.push(hyperlinkHTML[index]);
      }
    });
  } else {
    elements.push(answerText);
  }

  return (
    <div style={{ justifyContent: "center",
      borderLeft: "none",
      borderStyle: "dotted",
      borderRight: "none",
      borderTop: "none",
    }}>
      <div className="result-item">
      <p className="answer-text">{textArray.map((text) => text)}</p>
        {getAnswerMetaData(answer)}
      </div>
      <div style={{ margin: 10 }}>
        <div>
          <p>{votes} votes</p>
          {user && (
            <div>
              <button onClick={handleUpvote}>Upvote</button>
              <button onClick={handleDownvote}>Downvote</button>
            </div>
          )}
          <h4>Answer Comments:</h4>
          <Comments comment={null} answer={answer} />
        </div>
      </div>
    </div>
  );
};




function QuestionMetaData({ question }) {
  const currentDate = new Date();
  const questionDate = new Date(question.posted_time);
  const currentDateArray = currentDate.toDateString().split(" ");
  const questionDateArray = questionDate.toDateString().split(" ");

  const timeDifference = currentDate - questionDate;
  const secondsAgo = Math.floor(timeDifference / 1000);
  const minutesAgo = Math.floor(timeDifference / 60000);
  const hoursAgo = Math.floor(timeDifference / 3600000);

  if (currentDateArray[1] === questionDateArray[1] && currentDateArray[2] === questionDateArray[2] && currentDateArray[3] === questionDateArray[3]) {
    if (timeDifference < 60000) {
      return (
        <div>
          <p><span style={{ color: "green" }}>{question.asked_by.username}</span> asked {secondsAgo} seconds ago</p>
        </div>
      );
    } else if (timeDifference < 3600000) {
      return (
        <div>
          <p><span style={{ color: "green" }}>{question.asked_by.username}</span> asked {minutesAgo} minutes ago</p>
        </div>
      );
    } else if (timeDifference < 86400000) {
      return (
        <div>
          <p><span style={{ color: "green" }}>{question.asked_by.username}</span> asked {hoursAgo} hours ago</p>
        </div>
      );
    }
  } else {
    const hourAndMinutes = questionDateArray[4].split(":").slice(0, 2).join(":");
    return (
      <div>
        <p><span style={{ color: "green" }}>{question.asked_by.username}</span> asked {questionDateArray[1]} {questionDateArray[2]} at {hourAndMinutes}</p>
      </div>
    );
  }
}


export default QuestionAnswersPage;