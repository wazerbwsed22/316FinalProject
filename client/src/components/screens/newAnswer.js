import { UserContext } from "../user-context";
import { useContext } from "react";
import axios from "axios";
import { useState } from "react";


const PostAnswerPage = ({ setCurrentPage, currentQuestion }) => {
  const [user, setUser] = useContext(UserContext);
  const [answerText, setAnswerText] = useState("");
  const [hyperlinkError, setHyperlinkError] = useState("");




const handlePostAnswerClick = (event) => {
  event.preventDefault();
  let valid = true;

  const hyperlinkIssues = checkHyperlinks(answerText);
  
  if (hyperlinkIssues) {
    setHyperlinkError(hyperlinkIssues);
    valid = false;
  }

  if (answerText.trim().length > 0 && valid) {
    createAnswer(answerText, currentQuestion)
      .then(() => setCurrentPage("Answers"))
      .catch(error => console.error(`Failed to post answer: ${error}`));
  } else {
    console.log("Invalid Answer Form");
  }
};

function checkHyperlinks(text) {
  if (/\[.*\]\(\)/g.test(text)) {
    return "Hyperlink Invalid: () must not be empty";
  }

  if (/\[[^\]]*\]\((?!(https:\/\/|http:\/\/)).*\)/g.test(text)) {
    return "Hyperlink Invalid: link in () must start with https:// or http://";
  }
  return null; 
}



  return (
    <div className="form">
      <form onSubmit={(event) => handlePostAnswerClick(event)}>
        <h1>Answer Text*</h1>
        <textarea
          id="answer-text-input"
          minLength="1"
          required
          onChange={(event) => setAnswerText(event.target.value)}></textarea><HyperlinkError hyperlinkError={hyperlinkError} />

        <div style={{ display: "flex", flexDirection: "row", marginTop: "4vh" }} >
          <input type="submit" value="Post Answer" />
          <div style={{ flexGrow: 2 }}></div>
          <p style={{ color: "red" }}> * indicated mandatory fields</p>
         </div>
          </form>
    </div>
  );
};




export const createAnswer = async (text, question) => {
  let data = JSON.stringify({
    question_id: question._id,
    text: text,
  });

  let config = {
    data: data,

    maxBodyLength: Infinity,
    method: "post",
    url: "http://localhost:8000/api/answers",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  
  let response;
  await axios
    .request(config)
    .then((response) => {
      response = response.data;
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });

  return response;
};


const HyperlinkError = ({ hyperlinkError }) => {
  return (
    <div>
      <p style={{ color: "red" }}>{`${hyperlinkError}`}</p>
    </div>
  );
};


export default PostAnswerPage;