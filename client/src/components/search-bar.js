
import axios from "axios";

const SearchBar = ({
  searchString,
  setSearchString,
  setCurrentPage,
  setSearchResults,
}) => {
  return (
    <div className="search-bar" style={{justifyContent: "center", alignItems: "center"}}>
      <input
        type="text"
        id="search"
        name="q"
        placeholder="Search...."
        onChange={(event) => {
          setSearchString(event.target.value);
        }}
        onKeyDown={ async (event) => {
          if (event.key === "Enter") {
            setCurrentPage("Search");
            setSearchResults((await searchQuestions(searchString)));
          }
        }}
        style={{border: 'solid'}}
      />
    </div>
  );
};
async function searchQuestions(searchString) {
  searchString = searchString.toLowerCase();
  var questions = new Set();

  //Search for titles and texts with at least one word in the search string
  var searchStringWords = searchString
    .replace(/[{}=\-_`~().,^&*/#!$%;:]/g, " ")
    .split(" ");
  searchStringWords = searchStringWords.filter((word) => {
    if (word.trim().length === 0) {
      return false;
    } else {
      return true;
    }
  });

  const allQuestions = await getAllQuestions();
  searchStringWords.forEach((word) => {
    var resultQuestions = allQuestions.filter((question) => {
      return (
        question.title
          .toLowerCase()
          .replace(/[{}=\-_`~().,^&*/#!$%;:]/g, " ")
          .split(" ")
          .find((titleWord) => word === titleWord) ||
        question.text
          .toLowerCase()
          .replace(/[{}=\-_`~().,^&*/#!$%;:]/g, " ")
          .split(" ")
          .find((textWord) => word === textWord)
      );
    });
    resultQuestions.forEach((question) => {
      questions.add(question);
    });
  });


  const getAllTags = async () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:8000/api/tags",
      headers: {},
      withCredentials: true,
    };
  
    let allTags = [];
  
    await axios
      .request(config)
      .then((response) => {
        allTags = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    return allTags;
  };

  
  
  const allTags = await getAllTags();
  var searchStringTags = searchString.toLowerCase().match(/\[[^\]]*\]/g);
  if (searchStringTags) {
    await Promise.all(searchStringTags.map( async (tagStringWithBrackets) => {
      var tagName = tagStringWithBrackets.replace(/(\[|\])/g, "");
      tagName = tagName.trim();
      //get tag
      var foundTag = allTags.find(
        (tag) => tagName.toLowerCase() === tag.name.toLowerCase()
      );
      if (foundTag) {
        //add questions with tag
        const questionsOfTag = await getQuestions(foundTag);
        questionsOfTag.forEach((question) => {
          questions.add(question);
        });
      }
    }));
  }

  return Array.from(questions);
}


const getAllQuestions = async (tag) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8000/api/questions`,
    headers: {},
    withCredentials: true,
  };

  let allQuestions = [];

  await axios
    .request(config)
    .then((response) => {
      allQuestions = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return allQuestions;
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





export default SearchBar;
