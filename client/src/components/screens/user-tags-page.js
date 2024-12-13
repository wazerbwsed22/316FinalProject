// import { useEffect, useState, useContext } from "react";
// import { UserContext } from "../user-context";
// import axios from "axios";

// const UserTagsPage = ({showModifyTagScreen, setShowModifyTagScreen, setTag}) => {
//   const [user, setUser] = useContext(UserContext);
//   const [tags, setTags] = useState([]);
//   const [tagQuestions, setTagQuestions] = useState([]);

//   useEffect(() => {
//     const fetchTags = async () => {
//       try {
//         let config = {
//           method: "get",
//           maxBodyLength: Infinity,
//           url: "http://localhost:8000/api/tags",
//           headers: {},
//         };

//         // Get all tags and filter
//         const response = await axios.request(config);
//         const fetchedTags = response.data.filter(
//           (tag) => tag.created_by !== user._id
//         );
//         setTags(fetchedTags);

//         // Get all questions for each tag
//         const tagQuestions = await Promise.all(
//           fetchedTags.map(async (tag) => {
//             return await getQuestions(tag);
//           })
//         );
//         setTagQuestions(tagQuestions);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchTags();
//   }, []);

//   const handleTagBlockClick = (tag) => {
//     setTag(tag);
//     setShowModifyTagScreen(true)
//   };

//   return (
//     <div className="page">
//       <div className="page_topInfo">
//         <div className="page_item_info">
//           <h1>{tags.length} Tags</h1>
//           <h1 style={{ flex: 1, textAlign: "center" }}>User Tags</h1>
//         </div>
//       </div>
//       <div
//         style={{
//           justifyContent: "center",
//           alignItems: "center",
//           textAlign: "center",
//         }}
//       >
//         <div className="tag-container">
//           {tags.map((tag, index) => {
//             const questions = tagQuestions[index] || [];
//             return (
//               <div className="tag-block" key={`TagBlock${JSON.stringify(tag)}`}>
//                 <p
//                   style={{ color: "blue" }}
//                   onClick={() => handleTagBlockClick(tag)}
//                 >
//                   <u>{tag.name}</u>
//                 </p>
//                 <p style={{ color: "blue" }} onClick={() => handleTagBlockClick(tag)}>Edit/Delete</p>
//                 <p>
//                   {questions.length}{" "}
//                   {questions.length ? "questions" : "question"}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };


//  async function getQuestions(tag) {
//   let questions = [];
//   let config = {
//     method: "get",
//     maxBodyLength: Infinity,
//     url: `http://localhost:8000/api/questions?tag=${tag._id}`,
//     headers: {},
//   };

//   await axios
//     .request(config)
//     .then((response) => {
//       questions = response.data;
//     })
//     .catch((error) => {
//       console.log(error);
//     });

//   return questions;
// }

// export default UserTagsPage;



import { useEffect, useState, useContext } from "react";
import { UserContext } from "../user-context";
import axios from "axios";

const UserTagsPage = ({showModifyTagScreen, setShowModifyTagScreen, setTag}) => {
  const [user, setUser] = useContext(UserContext);
  const [tags, setTags] = useState([]);
  const [tagQuestions, setTagQuestions] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: "http://localhost:8000/api/tags",
          headers: {},
        };

        // Get all tags and filter
        const response = await axios.request(config);
        const fetchedTags = response.data.filter(
          (tag) => tag.created_by !== user._id
        );
        setTags(fetchedTags);

        // Get all questions for each tag
        const tagQuestions = await Promise.all(
          fetchedTags.map(async (tag) => {
            return await getQuestions(tag);
          })
        );
        setTagQuestions(tagQuestions);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTags();
  }, []);

  const handleTagBlockClick = (tag) => {
    setTag(tag);
    setShowModifyTagScreen(true)
  };

  return (
    <div className="page">
      <div className="page_topInfo">
        <div className="page_item_info">
          <h1>{tags.length} Tags</h1>
          <h1 style={{ flex: 1, textAlign: "center" }}>User Tags</h1>
        </div>
      </div>
      <div
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div className="tag-container">
          {tags.map((tag, index) => {
            const questions = tagQuestions[index] || [];
            return (
              <div className="tag-block" key={`TagBlock${JSON.stringify(tag)}`}>
                <p
                  style={{ color: "blue" }}
                  onClick={() => handleTagBlockClick(tag)}
                >
                  <u>{tag.name}</u>
                </p>
                <p style={{ color: "blue" }} onClick={() => handleTagBlockClick(tag)}>Edit/Delete</p>
                <p>
                  {questions.length}{" "}
                  {questions.length ? "questions" : "question"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


 async function getQuestions(tag) {
  let questions = [];
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8000/api/questions?tag=${tag._id}`,
    headers: {},
  };

  await axios
    .request(config)
    .then((response) => {
      questions = response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return questions;
}

export default UserTagsPage;