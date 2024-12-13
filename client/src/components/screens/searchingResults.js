

import ListItems from "./listItem";
import { UserContext } from "../user-context";
import { useContext, useState } from "react";
import { handleActiveQuestion, unansweredQuestionSearch, sortNewestQuestion} from "./allSortings";


const SearchResults = ({
  setCurrentPage,
  results,
  setResults,
  searchString,
  setCurrentQuestion,
}) => {
  const { user } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const begin = (page - 1) * itemsPerPage;
  const end = page * itemsPerPage;

  const handlePaginationClick = (direction) => {
    setPage(prev => {
      if (direction === 'prev') {
        return prev === 1 ? 1 : prev - 1;
      }
      return (prev * itemsPerPage >= results.length) ? prev : prev + 1;
    });
  };

  const handleSortClick = async (sortFunction) => {
    await sortFunction(setResults, searchString);
  };

  return (
    <div id="content" style={{ overflow: "auto" }}>
      <div className="page">
        <div className="page-top">
          <div className="page-info-and-sortby">
            <h1>Search Results</h1>
            {user && (
              <button onClick={() => setCurrentPage("Post Question")}>
                Ask Question
              </button>
            )}
            <div className="num-questions-sortby">
              <p>{results.length} questions</p>
              <ul className="sortby">
                {['Newest', 'Active', 'Unanswered'].map(sortType => (
                  <li key={sortType}>
                    <button
                      className="sort-button"
                      onClick={() => handleSortClick(window[`handleSortBy${sortType}ClickSearch`])}
                    >
                      {sortType}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div id="result-list">
          {results.length ? (
            results.slice(begin, end).map(result => (
              <ListItems
                question={result}
                setCurrentPage={setCurrentPage}
                setCurrentQuestion={setCurrentQuestion}
                key={result.id} // Assuming each result has a unique id
              />
            ))
          ) : (
            <h2 style={{ margin: "5vh" }}>No Questions Found</h2>
          )}
        </div>
        <div style={{ position: "fixed", bottom: 0, right: 0, margin: 10 }}>
          <button onClick={() => handlePaginationClick('prev')}>
            Prev
          </button>
          <button onClick={() => handlePaginationClick('next')}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};


export default SearchResults;
