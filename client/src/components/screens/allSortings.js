
import axios from "axios";
	
export default async function searchQuestions(searchString) {

  const modelQuestions = get_allQuestions();
  const modelTags = getAllTags();
  searchString = searchString.toLowerCase().trim();
      const questions = new Set();
      const searchWord = searchString.split(" ").filter(word => word.length > 0); //split into words
      modelQuestions.forEach(question => {
      const titleWords = question.title.toLowerCase().split(' ');
      const textWords = question.text.toLowerCase();
      const tags = question.tags ? question.tags.map(tag => tag.name.toLowerCase()) : [];
        const isMatch = searchWord.some(word => 
        titleWords.includes(word) || textWords.includes(word) || tags.includes(word)
      );
     // console.log("IS MATCHHH " + isMatch);
  
      // if matches add to set
      if (isMatch) {
        questions.add(question);
       // console.log("This is the set size " + questions.size);
      }
    });

    var new_set_for_tags = new Set();
      new_set_for_tags = search_tags_for_text(searchString, modelQuestions, modelTags);
      
      if(new_set_for_tags.size > 0){

        for (let item of new_set_for_tags) {
          questions.add(item);
        }

      }
      return Array.from(questions);
    }
  
  function search_tags_for_text(search_str, modelQuestions,modelTags ){
    var tags_str = search_str.toLowerCase().match(/\[[^\]]*\]/g);
    var ques = new Set()
    
    if (tags_str) {
      tags_str.forEach((tagStringWBrackets) => {

        var tagName = tagStringWBrackets.replace(/(\[|\])/g, "");
        //get tag
        var tagGetName = search_str.toLowerCase().match(/\[[^\]]*\]/g);
    
        var foundTag = modelTags.find((tag) => tagName == tag.name);
        if (foundTag) {
         
          getQuestions(foundTag).forEach((question) => {
            ques.add(question);
          });
        }
      });
    }  
    return ques; 
  }



async function allquestions_active() {
  let configuration = {
    maxBodyLength: Infinity,
    method: "get",
    withCredentials: true,
    url: `http://localhost:8000/api/questions`,
    headers: {},
  };

  let sorted_question = [];
  await axios.request(configuration).then((response) => {
      sorted_question = response.data;
    }).catch((error) => { console.log(error);
    });
  
  return sortByActive(sorted_question);
}


async function getquestions_unanswer() {
  let configuration = {
    method: "get",
    url: `http://localhost:8000/api/questions`,
    headers: {},
    maxBodyLength: Infinity,
    withCredentials: true,
  };

  let sorted_question = [];
  await axios.request(configuration).then((response) => {
      sorted_question = response.data;
    }).catch((error) => { console.log(error);
    });

  return sorted_unanswered(sorted_question);
}

function getquestion_newest(answers) {
  var result = [...answers].sort((answer1, answer2) => {
    if (answer1 === undefined) {
      return 1;
    } else if (answer2 === undefined) {
      return -1;
    } else {
      return new Date(answer2.posted_time) - new Date(answer1.posted_time);
    }
  });
  return result;
}





function sort_newestQuestion(questions) {
  return questions.slice().sort((a, b) => new Date(b.posted_time) - new Date(a.posted_time));
}

async function newest_questions() {
  let configuration = {
    maxBodyLength: Infinity,
    method: "get",
    url: `http://localhost:8000/api/questions`,
    withCredentials: true,
    headers: {},
  };

  let sorted_questions = [];
  await axios.request(configuration).then((response) => {
    sorted_questions = response.data;
    }).catch((error) => { console.log(error); });
  return sort_newestQuestion(sorted_questions);
}




const get_allQuestions = async (tag) => {
  let config = {
    maxBodyLength: Infinity,
    url: `http://localhost:8000/api/questions`,
    headers: {},
    method: "get",
    withCredentials: true,
  };

  let allQuestions = [];

  await axios.request(config).then((response) => {
      allQuestions = response.data;
    }).catch((error) => { console.log(error);
    });
  return allQuestions;
};

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


export async function getQuestions(tag) {
  let tag_questions = [];
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8000/api/questions?tag=${tag._id}`,
    headers: {},
  };

  await axios.request(config).then((response) => {
      tag_questions = response.data; }).catch((error) => { console.log(error);
    });
  return tag_questions;
}




function sortByActive(questions) {
  return [...questions].sort((a, b) => {
    const aLatest = recentAnswer(a.answers);
    const bLatest = recentAnswer(b.answers);
    if (!aLatest) return 1; 
    if (!bLatest) return -1; 
    return new Date(bLatest.posted_time) - new Date(aLatest.posted_time);
  });
}


function sorted_unanswered(questions) {
  return [...questions].filter((question) => {
    return question.answers.length === 0 ? true : false;
  });
}



function recentAnswer(answers) {
  return answers && answers.length > 0 ? getquestion_newest(answers)[0] : undefined;
}


async function sortActiveQuestions(setResults) {
  var results = await allquestions_active();
  setResults(results);
}

async function newClick(setResults) {
  var results = await newest_questions();
  setResults(results);
}

async function sortQuestionsUnanswered(setResults) {
  var results = await getquestions_unanswer();
  setResults(results);
}


async function unansweredQuestionSearch(setResults, searchString) {
  let results = await searchQuestions(searchString);
  setResults(sorted_unanswered(results));
}



async function handleActiveQuestion(setResults, searchString) {
  let results = await searchQuestions(searchString);
  setResults(sortByActive(results));
}

async function sortNewestQuestion(setResults, searchString) {
  let results = await searchQuestions(searchString);
  setResults(sort_newestQuestion(results));
}

async  function unansweredClickSearch(setResults, tag) {
  let results = await searchQuestions(`[${tag.name.toLowerCase()}]`);
  console.log(results);
  setResults(sorted_unanswered(results));
}

async function sortNewesthandle(setResults, tag) {
  let results = await searchQuestions(`[${tag.name.toLowerCase()}]`);
  console.log(results);
  setResults(sort_newestQuestion(results));
}

async function sortActiveQuestion(setResults, tag) {
  let results = await searchQuestions(`[${tag.name.toLowerCase()}]`);
  console.log(results);
  setResults(sortByActive(results));
}



export { sortActiveQuestions, sortQuestionsUnanswered, newClick, sortNewestQuestion, unansweredQuestionSearch, handleActiveQuestion, sortNewesthandle,
  sortActiveQuestion, unansweredClickSearch, sort_newestQuestion, getquestion_newest, sortByActive, sorted_unanswered,
};

