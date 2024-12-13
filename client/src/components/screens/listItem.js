
import axios from "axios";
import { UserContext } from "../user-context";

import { useContext, useState } from "react";

function tagsListItem(tag) {
  return (
    <div className="tag_item" key={JSON.stringify(tag)}>
      <p>{tag.name}</p>
    </div>
  );
}


const ListItems = ({  setCurrentPage, question, setCurrentQuestion, questionItem }) => {
  const [user, setUser] = useContext(UserContext);
  const [votes, setVotes] = useState(question.votes.length);


  const downvote = async () => {
    let config = {
      method: "patch",
      withCredentials: true,
      url: `http://localhost:8000/api/questions/downvote/?question_id=${question._id}`,
      headers: {},
      maxBodyLength: Infinity,
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

  const upvote = async () => {
    let config = {
     method: "patch",
     url: `http://localhost:8000/api/questions/upvote/?question_id=${question._id}`,
     headers: {},
     maxBodyLength: Infinity,
     withCredentials: true,
   };

   axios.request(config).then((response) => {
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
            setCurrentPage("Answers"); }}>
              {question.title}
        </p>
        <p>{question.summary}</p>
        <div className="tag_list">
          {question.tags.map((tag) => tagsListItem(tag))}
        </div>
      </div>
      <div className="time_display">
        <div>
        <QuestionTime question={question} />
        </div>
      </div>
      {user && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button onClick={() => upvote()}>Upvote</button>
          <button onClick={() => downvote()}>Downvote</button>
        </div>
      )}
    </div>
  );
};

function QuestionTime({ question }) {
  var currDate = new Date();
  var currDateArr = currDate.toString().split(" ");
  const questionDate = new Date(question.posted_time);
  var questionDateArr = questionDate.toString().split(" ");
  //If question was posted on day X
  if (
    currDateArr[1] === questionDateArr[1] &&
    currDateArr[2] === questionDateArr[2] &&
    currDateArr[3] === questionDateArr[3]
  ) {
    if (currDate - questionDate < 60000) {
      //the question date should appear in seconds (if posted 0 mins. ago)
      var secondsAgo = Math.floor((currDate - questionDate) / 1000);
      return (
        <div>
          <p>
            <span style={{ color: "green" }}>{question.asked_by.username}</span> asked{" "}
            {secondsAgo} seconds ago
          </p>
        </div>
      );
    } else if (currDate - questionDate < 3600000) {
      //minutes (if posted 0 hours ago)
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
    //<username> questioned  <Month><day> at <hh:min>.
    var hourAndMinutes = questionDateArr[4].split(":").slice(0, 2).join(":");
    return (
      <div>
        <p>
          <span style={{ color: "green" }}>{question.asked_by.username}</span> asked{" "}
          {questionDateArr[1]} {questionDateArr[2]} at {hourAndMinutes}
        </p>
      </div>
    );
  }
}


export default ListItems;