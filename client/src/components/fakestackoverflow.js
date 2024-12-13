import { useState, useEffect, useContext } from "react";
import HomeScreen from "./screens/homepage.js";
import Header from "./header.js";
import PostCommentPage from "./screens/postCommentScreen.js";
import QuestionAnswersPage from "./screens/question-answers-page.js";
import PostQuestionPage from "./screens/post-question-page.js";
import SearchResults from "./screens/searchingResults.js";
import TagsPage from "./screens/tagsPage.js";
import TagQuestionsPage from "./screens/questionOfTag.js";
import NavigationBar from "./navigation-bar.js";
import NewAnswer from "./screens/newAnswer.js";
import AccountCreationPage from "./screens/registerScreen.js";
import LoginPage from "./screens/loginpageScreen.js";
import { UserContext } from "./user-context.js";
import Profile from "./screens/userProfile.js";


const FakeStackOverflow = () => {
  const [user, setUser] = useContext(UserContext);
  const [page, setCurrentPage] = useState("Homepage");
  const [searchString, setSearchString] = useState("");

  const [searchResults, setSearchResults] = useState([]); // For search result page
  const [tag, setTag] = useState(""); // For Tag Questions page
  const [currentQuestion, setCurrentQuestion] = useState(undefined); //For question answers page and post answer page. Stores a qid.
  const [currentAnswer, setCurrentAnswer] = useState(undefined); //For post comment page. Stores an aid.
  var currentPageComponent = <div></div>;

  switch (page) {
    case "Homepage":
      console.log("okay");

      currentPageComponent = (
        <HomeScreen
        setCurrentPage={setCurrentPage}
          setCurrentQuestion={setCurrentQuestion}
        />
      );
      break;
    case "Search":
      currentPageComponent = (
        <SearchResults
        setCurrentPage={setCurrentPage}
          searchString={searchString}
          results={searchResults}
          setResults={setSearchResults}
          setCurrentQuestion={setCurrentQuestion}
        />
      );
      break;
    case "Answers":
      console.log("OMFRR");
      currentPageComponent = (
        <QuestionAnswersPage
        setCurrentPage={setCurrentPage}
          question={currentQuestion}                  
          setCurrentAnswer={setCurrentAnswer}
          setCurrentQuestion={setCurrentQuestion}
        />
      );
      break;
    case "See question":
      console.log("HERE?");
      currentPageComponent = (<PostQuestionPage setCurrentPage={setCurrentPage} />);
      break;

      case "Tags":
      currentPageComponent = (
        <TagsPage setCurrentPage={setCurrentPage} setTag={setTag} />
      );
      break;

    case "Post Answer":
      currentPageComponent = (
        <NewAnswer setCurrentPage={setCurrentPage} currentQuestion={currentQuestion}/>
      );
      break;
    case "Tag Questions":
      currentPageComponent = (<TagQuestionsPage tag={tag} setCurrentPage={setCurrentPage} setCurrentQuestion={setCurrentQuestion}/>
      );
      break;
    case "Account Creation":
      currentPageComponent = (
        <AccountCreationPage setCurrentPage={setCurrentPage} />
      );
      break;
    case "Login":
      currentPageComponent = <LoginPage setCurrentPage={setCurrentPage} />;
      break;
    case "Profile":
      currentPageComponent = (
        <Profile setCurrentPage={setCurrentPage}/>
      );
      break;
      case "Post Comment":
        currentPageComponent = (<PostCommentPage setCurrentPage={setCurrentPage} currentQuestion={currentQuestion}
            currentAnswer={currentAnswer}       />
        );
        break;
    default:
      currentPageComponent = (
        <HomeScreen setCurrentPage={setCurrentPage}
          setCurrentQuestion={setCurrentQuestion}
        />
      );
      break;
  }

  return (
    <div>
      <div>
        <Header
          searchString={searchString}
          setSearchString={setSearchString}
          setCurrentPage={setCurrentPage}
          setSearchResults={setSearchResults}
        />
        <div className="container">
          <div> </div>
          <NavigationBar setCurrentPage={setCurrentPage} />
          <div id="content" style={{ overflow: "auto" }}>
            {currentPageComponent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FakeStackOverflow;
