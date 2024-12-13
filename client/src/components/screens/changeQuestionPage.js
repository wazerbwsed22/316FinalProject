import React, { useState } from "react";
import axios from "axios";

const ChangeQuestionPage = ({ setShowModifyScreen, question }) => {
  const [questionTitle, setQuestionTitle] = useState(question.title);
  const [questionText, setQuestionText] = useState(question.text);
    const [questionSummary, setQuestionSummary] = useState(question.summary);

    const [tags, setTags] = useState(question.tags.map(tag => tag.name).join(' '));
  
  const [tagsError, setTagsError] = useState("");
  const [hyperlinkError, setHyperlinkError] = useState("");

  const deleteQuestion = async () => {
    let config = {
      maxBodyLength: Infinity,
      method: 'delete',
      withCredentials: true,
      url: `http://localhost:8000/api/questions?question_id=${question._id}`,
    };

    try {
      const res = await axios.request(config);
      setShowModifyScreen(false);
      console.log(`Deleted the following question: ${JSON.stringify(res.data)}`);
    } catch (error) {
      console.log(error);
    }
  };

  const validateInput = () => {
    const tagsArray = tags.split(" ").filter(tag => tag.length > 0);
  
    if (!questionTitle) {
      setTagsError("Title cannot be empty.");
      return false;
    }
    
    if (!questionText) {
      setTagsError("Question text cannot be empty.");
      return false;
    }
  
    if (tagsArray.length > 5) {
      setTagsError("Cannot have more than 5 tags.");
      return false;
    }
  
    if (tagsArray.some(tag => tag.length > 10)) {
      setTagsError("Each tag must be less than 10 characters long.");
      return false;
    }
  
    return true;
  };
  

  const updateQuestion = async (event) => {
    event.preventDefault();
    
     let validChanges = true;
    const tagsArray = tags.split(" ").filter(tag => tag.trim().length > 0);
    const isValidTags = tagsArray.length <= 5 && tagsArray.every(tag => tag.length <= 10);
    const isValidLinks = !/[^\]]\(\s*\)/.test(questionText);

    if (!questionTitle || !questionText || !isValidTags || !isValidLinks) {
      validChanges = false;
      if (!isValidTags) {
        setTagsError("Each tag must be less than 10 characters. No more than total 5 tags");
      }
      if (!isValidLinks) {
        setHyperlinkError("Hyperlink can't be empty");
      }
      return;
    }

    if (validChanges) {
      const updateData = JSON.stringify({
        question_id: question._id,
        summary: questionSummary,
        title: questionTitle,
        questiontext: questionText,
        tagStrings: tagsArray,
        updated_ques: {},
        flag_check : 0,
      });
      

      let updateConfig = {
        method: "patch",
        maxBodyLength: Infinity,
        url: "http://localhost:8000/api/questions",
        headers: { "Content-Type": "application/json" },
        data: updateData,
        withCredentials: true,
      };

      try {
        const response = await axios.request(updateConfig);
        console.log(`Modified question: ${JSON.stringify(response.data)}`);
        setShowModifyScreen(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="form">
      <form onSubmit={updateQuestion} style={{ flexGrow: 1 }}>
        <h1>Update Question Title*</h1>
        <input
          type="text"
          id="questiontitle-input"
          value={questionTitle}
          required
          minLength="1"
          maxLength="50"
          onChange={(event) => setQuestionTitle(event.target.value)}
        />
        <h1>Update Question Summary*</h1>
        <input
          type="text"
          id="question-summary-input"
          value={questionSummary}
          required
          maxLength="140"
          onChange={(event) => setQuestionSummary(event.target.value)}
          style={{ width: "100%" }}
        />
        <h1>Update Question Text*</h1>
        <textarea
          id="questiontitle-input"
          value={questionText}
          required
          onChange={(event) => setQuestionText(event.target.value)}
        />
        <Hyperlinkerror hyperlinkError={hyperlinkError} />
        <h1>Update Tags*</h1>
        <input
          type="text"
          id="question-tags-input"
          value={tags}
          onChange={(event) => setTags(event.target.value)}
        />
        <Tagerror tagsError={tagsError} />
        <br>
        </br>        
        
        <button  onClick={deleteQuestion}> Delete </button>
        <button  onClick={() => setShowModifyScreen(false)}> Cancel  </button>
        <input type="submit" value="Modify Question"  />

        <div style={{ display: "flex", flexDirection: "row", marginTop: "1vh" }}>
          <p style={{ color: "red" }}> *indicated mandatory fields</p>
        </div>
      </form>
    </div>
  );
};

const Tagerror = ({ tagsError }) => {
  return (
    <div>
      <p style={{ color: "red" }}>{tagsError}</p>
    </div>
  );
};

const Hyperlinkerror = ({ hyperlinkError }) => {
  return (
    <div>
      <p style={{ color: "red" }}>{hyperlinkError}</p>
    </div>
  );
};

export default ChangeQuestionPage;