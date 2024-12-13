
import axios from "axios";
import { UserContext } from "../user-context"; 
import React, { useEffect, useState, useContext } from "react";


const ListItems = ({ question, setShowModifyAnswerScreen, setCurrentQuestion }) => {
  const [votes, setVotes] = useState(question.votes.length);
  const [user, setUser] = useContext(UserContext);
  const handleUpvote = async () => {
    let config = {
      maxBodyLength: Infinity,
      method: "patch",
      withCredentials: true,
      url: `http://localhost:8000/api/questions/upvote/?question_id=${question._id}`,
      headers: {},
    };

    axios.request(config).then((response) => {
        console.log(response)
        setVotes(response.data.votes)
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
        console.log(response)
        setVotes(response.data.votes)
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="item_list">
      <div className="item_display">
        <p>{question.answers.length} answers</p>
        <p>{question.views} views</p>
        <p>{votes} votes</p>
      </div>
      <div className="title_tag">
        <p
          className="question-title"
          onClick={() => {
            setCurrentQuestion(question);
            setShowModifyAnswerScreen(true);
          }}>
          {question.title}
        </p>
        <p>{question.summary}</p>
        <div className="tag_list">
          {question.tags.map((tag) => tagsListItem(tag))}
        </div>
      </div>
      <div className="time_display">
        <div>
          <QuestionMetaData question={question} />
        </div>
      </div>
      {user && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <buttton onClick={() => handleUpvote()}>Upvote</buttton>
          <buttton onClick={() => handleDownvote()}>Downvote</buttton>
        </div>
      )}
    </div>
  );
};

function tagsListItem(tag) {
  return (
    <div className="tag_item" key={JSON.stringify(tag)}>
      <p>{tag.name}</p>
    </div>
  );
}


const UserAnswersPage = ({ setShowModifyAnswerScreen, setQuestion , showModifyAnswerScreen }) => {
    const [answers, setAnswers] = useState([]);
    const [user, setUser] = useContext(UserContext);
    const fetchAnswers = async () => {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `http://localhost:8000/api/answers?user_id=${user.user._id}`,
        headers: {},
      };

      await axios
        .request(config)
        .then((response) => {
          const filteredAnswers = response.data.filter(answer => answer.asked_by === user.user._id);
          console.log(response.data)
          setAnswers(filteredAnswers);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  
    useEffect(() => {
      fetchAnswers();
  
      const interval = setInterval(() => {
        fetchAnswers();
      }, 1000);
  
      return () => {
        clearInterval(interval);
      };
    }, []);
  
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            border: "solid",
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
          }}
        >
          <h1>Answered Questions</h1>
        </div>
        {answers.map((question) => (
          <div
            style={{
              border: "dotted",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
            }}
          >
            <h3
              onClick={() => {
                setQuestion(question);
                setShowModifyAnswerScreen(true);
              }}
            >
            <ListItems question={question} setCurrentQuestion={setQuestion} setShowModifyAnswerScreen={setShowModifyAnswerScreen} />
            </h3>
          </div>
        ))}
      </div>
    );
  };


  function QuestionMetaData({ question }) {
    var currDate = new Date();
    const questionDate = new Date(question.posted_time);
    var currDateArr = currDate.toString().split(" ");
    var questionDateFormat = questionDate.toString().split(" ");
    if (currDateArr[1] === questionDate[1] &&  currDateArr[2] === questionDateFormat[2] && currDateArr[3] === questionDateFormat[3]) {
      if (currDate - questionDate < 60000) {
        var secondsAgo = Math.floor((currDate - questionDate) / 1000);
        return (
          <div>
            <p> <span style={{ color: "green" }}>{question.asked_by.username}</span> asked{" "}
              {secondsAgo} seconds ago
            </p>
          </div>
        );
      } else if (currDate - questionDate < 3600000) {
        var minutesAgo = Math.floor((currDate - questionDate) / 60000);
        return (
          <div>
            <p>
              <span style={{ color: "green" }}>{question.asked_by.username}</span> asked{" "}
              {minutesAgo} minutes ago
            </p>
          </div>
        );
      } else if (currDate - questionDate < 86400000) {
        var hoursAgo = Math.floor((currDate - questionDate) / 3600000);
        return (
          <div>
            <p>
              <span style={{ color: "green" }}>{question.asked_by.username}</span> asked{" "}
              {hoursAgo} hours ago
            </p>
          </div>
        );
      }
    } else {
      var hourAndMinutes = questionDateFormat[4].split(":").slice(0, 2).join(":");
      return (
        <div>
          <p>
            <span style={{ color: "green" }}>{question.asked_by.username}</span> asked{" "}
            {questionDateFormat[1]} {questionDateFormat[2]} at {hourAndMinutes}
          </p>
        </div>
      );
    }
  }
  
export default UserAnswersPage;