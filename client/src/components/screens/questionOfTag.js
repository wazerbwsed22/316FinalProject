
import ListItems from "./listItem";
import { UserContext } from "../user-context";
import { useContext } from "react";
import axios from "axios";

import { sortNewesthandle, unansweredClickSearch, sortActiveQuestion} from "./allSortings";
import { Button } from "@mui/material";

import { useState, useEffect } from "react";


const TagQuestionsPage = ({ tag, setCurrentPage, setCurrentQuestion }) => {

  const { user } = useContext(UserContext);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = page * itemsPerPage;


  useEffect(() => {
    const fetchTagQuestions = async () => {
      try {
        //  questions for tag
        const tagQuestions = await getQuestions(tag);
        setResults(tagQuestions);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTagQuestions();
  }, [tag]);

const handleSortClick = async (sortFunction) => {
  const sortedResults = await sortFunction(tag);
  setResults(sortedResults);
};

return (
  <div className="page">
    <div className="page-top">
      <h2 style = {{color:"#008080"}}>Question of Tag [{tag.name}] Results </h2>
      {user && (
        <button onClick={() => setCurrentPage("Post Question")}>
          Ask Question
        </button>
      )}
      <div className="num-questions-sortby">
        <p>{results.length} questions</p>
        <ul className="sortby">
          <li>
            <button
              className="sort-button"
              onClick={() => handleSortClick(sortNewesthandle)}>
              Newest
            </button>
          </li>
          <li>
            <button
              className="sort-button"
              onClick={() => handleSortClick(sortActiveQuestion)}>
              Active
            </button>
          </li>
          <li>
            <button
              className="sort-button"
              onClick={() => handleSortClick(unansweredClickSearch)}
            >
              Unanswered
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div id="result-list">
      {results.length ? (
        results.slice(startIndex, endIndex).map((result) => (
          <ListItems question={result} setCurrentPage={setCurrentPage} setCurrentQuestion={setCurrentQuestion}
            key={result.id} 
          />
        ))
      ) : (
        <h2 style={{ margin: "4vh" }}>No Questions Found</h2>
      )}
    </div>
    <div style={{ position: "fixed", bottom: 0, right: 0, margin: 10 }}>
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        style={{ marginRight: 10 }}>
        Prev
      </button>
      <button
        onClick={() => setPage(page * itemsPerPage >= results.length ? page : page + 1)}>
        Next
      </button>
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

export default TagQuestionsPage;


