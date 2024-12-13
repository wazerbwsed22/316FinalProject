// import React, { useState, useContext } from "react";
// import axios from "axios";
// import { UserContext } from "../user-context";


// const PostCommentPage = ({currentQuestion, setCurrentPage, setComments, currentAnswer, setVotes}) => {
//   const [user, setUser] = useContext(UserContext);
//   const [comment, setComment] = useState("");

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!user || user.reputation < 50) {
//       alert("You must have at least 50 reputation to post a comment");
//       return;
//     }

//     if (currentAnswer) {
//       let data = JSON.stringify({
//         answer_id: currentAnswer._id,
//         text: comment,
//         question_id: "",
//       });
//       let config = {
//         method: "post",
//         maxBodyLength: Infinity,
//         url: "http://localhost:8000/api/comments",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         data: data,
//         withCredentials: true,
//       };

//       await axios
//         .request(config)
//         .then((response) => {
//           console.log(JSON.stringify(response.data));
//         })
//         .catch((error) => {
//           alert("Error posting comment");
//           console.log(error);
//         });
//     } else if (currentQuestion) {
//       let data = JSON.stringify({
//         answer_id: "",
//         text: comment,
//         question_id: currentQuestion._id,
//       });
//       let config = {
//         method: "post",
//         maxBodyLength: Infinity,
//         url: "http://localhost:8000/api/comments",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         data: data,
//         withCredentials: true,
//       };

//       await axios
//         .request(config)
//         .then((response) => {
//           console.log(JSON.stringify(response.data));
//         })
//         .catch((error) => {
//           alert("Error posting comment");
//           console.log(error);
//         });
//     }

//     // get the comments again
//     let config = {
//       method: "get",
//       maxBodyLength: Infinity,
//       url: currentQuestion
//         ? `http://localhost:8000/api/comments?question_id=${currentQuestion._id}`
//         : `http://localhost:8000/api/comments?answer_id=${currentAnswer._id}`,
//       headers: {},
//     };

//     axios
//       .request(config)
//       .then((response) => {
//         setComments(response.data);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   return (
//     <div className="form">
//       <form
//         onSubmit={async (event) => await handleSubmit(event)}
//         style={{ flexGrow: 1 }}
//       >
//         <h5>Comment Text*</h5>
//         <input
//           type="text"
//           className="single-line-textbox"
//           id="question-title-input"
//           required
//           minLength="1"
//           maxLength="140"
//           onChange={(event) => setComment(event.target.value)}
//         />

//         <div
//           style={{ display: "flex", flexDirection: "row", marginTop: "3vh" }}
//         >
//           <input type="submit" value="Post Comment" />
//         </div>
//       </form>
//     </div>
//   );
// };

// export default PostCommentPage;


import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../user-context";


const PostCommentPage = ({ cur_answers, setComments, setCurrentPage, currentQuestion, current_screen}) => {
  const [user, setUser] = useContext(UserContext);
  const [commentText, setCommentText] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user || user.reputation < 50) {
      alert("You must have at least 50 reputation to post a comment");
      console.error("You must have at least 50 reputation to post a comment");
      return;
    }

    if (cur_answers) {
      let data = JSON.stringify({
        answer_id: cur_answers._id,
        text: commentText,
        question_id: "",
      });
      let config = {
        maxBodyLength: Infinity,
        method: "post",
        url: "http://localhost:8000/api/comments",
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        data: data,

      };

      await axios.request(config).then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          alert("Error with comment");
          console.log(error);
        });
    } else if (currentQuestion) { //question is valid
      let data = JSON.stringify({
        answer_id: "",
        text: commentText,
        question_id: currentQuestion._id,
      });
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:8000/api/comments",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
        withCredentials: true,
      };

      await axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          alert("Error posting comment");
          console.log(error);
        });
    }

    let resourceType = currentQuestion ? 'question_id' : 'answer_id';
    let resourceId = currentQuestion ? currentQuestion._id : cur_answers._id;
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `http://localhost:8000/api/comments?${resourceType}=${resourceId}`,
      headers: {},
    };


    axios.request(config).then((response) => {
        setComments(response.data);
      }).catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <form
        onSubmit={async (event) => await handleSubmit(event)}>
        <h5>Comment Text*</h5>
        <input
          type="text"
          className="line_textbox"
          id="question-title-input"
          required
          minLength="1"
          maxLength="140"
          onChange={(event) => setCommentText(event.target.value)} />

        <div style={{ display: "flex", marginTop: "3vh" , flexDirection: "row"}}>
          <input type="submit"  className="colored_Button" />
        </div>
      </form>
    </div>
  );
};

export default PostCommentPage;