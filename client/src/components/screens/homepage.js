
import ListItems from "./listItem";
import { useState, useEffect, useContext } from "react";
import "../../stylesheets/index.css";
import { Button } from "@mui/material";
import {
  sortActiveQuestions,
  newClick,
  sortQuestionsUnanswered,
} from "./allSortings";
import axios from "axios";
import { UserContext } from "../user-context";

/**
 * Renders a page displaying a list of questions.
 *
 * @param {object} appModel - The application model object.
 * @param {function} setAppModel - A function to update the `appModel` object.
 * @returns {JSX.Element} - The rendered page layout with the list of questions and sorting options.
 */
const HomeScreen = ({
  appModel,
  setAppModel,
  setCurrentPage,
  setCurrentQuestion,
}) => {
  const [user, setUser] = useContext(UserContext);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const start = (page - 1) * 5;
  const end = page * 5;

  // fetch posts from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `http://localhost:8000/api/questions`,
          withCredentials: true,
        };

        const response = await axios.request(config);
        setResults(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [page]);

  return (
    <div>
      <div className="page">
        <div className="page_topInfo">
          <div className="page_info_sort">
            <div className="page_item_info">
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h1>All Questions</h1>
              </div>
              <div style={{ flexGrow: 1 }}></div>
              {user && (
                <button
                  id="questionask-button"
                  onClick={() => setCurrentPage("See question")}
                >
                  Ask Question
                </button>
              )}
            </div>
          </div>
          <div className="num-questions-sortby">
            <p>{results.length} questions</p>
            <div style={{ flexGrow: 1 }}></div>
            <ul className="sortby">
              <li>
                <button
                  className="sort-button"
                  id="sortby-newest"
                  onClick={ async () => { 
                    await newClick(setResults, page);
                    console.log("sort by newest")
                  }

                  }
                >
                  Newest
                </button>
              </li>
              <li>
                <button
                  className="sort-button"
                  id="sortby-active"
                  onClick={ async () =>
                    await sortActiveQuestions(setResults, page)
                  }
                >
                  Active
                </button>
              </li>
              <li>
                <button
                  className="sort-button"
                  id="sortby-unanswered"
                  onClick={ async () =>
                    await sortQuestionsUnanswered(setResults, page)
                  }
                >
                  Unanswered
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div id="result-list">
          {results.length ? (
            results.slice(start,end).map((result) => {
              return (
                <ListItems
                  question={result}
                  setCurrentPage={setCurrentPage}
                  setCurrentQuestion={setCurrentQuestion}
                  key={`HomepageResultItem${JSON.stringify(result)}`}
                />
              );
            })
          ) : (
            <h2 style={{ margin: 5 }}>No Questions Found</h2>
          )}
        </div>
      </div>
      <div style={{ position: "fixed", bottom: 0, right: 0, margin: 10 }}>
        <Button
          variant="contained"
          onClick={() => setPage(page === 1 ? 1: page - 1)}
          style={{ marginRight: 10 }}
        >
          prev
        </Button>
        <Button
          variant="contained"
          onClick={() => setPage(page * 5 >= results.length ? page : page + 1)}
        >
          next
        </Button>
      </div>
    </div>
  );
};

export default HomeScreen;