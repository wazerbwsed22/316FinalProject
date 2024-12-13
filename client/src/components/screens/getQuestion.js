
import axios from 'axios';


export function getAnswers(question, model) {
  return model.data.answers.filter((answer) => {
    return question.answers.find((ansId) => ansId === answer._id);
  });
}

export async function view_Question(question, setAppModel, appModel) {
  let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: `http://localhost:8000/api/questions?question_id=${question._id}`,
    headers: { }
  };
  
  await axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
  setAppModel(undefined);
}




export function getTags(question, model) {
  return model.data.tags.filter((tag) => {
    return question.tags.find((id) => tag._id === id);
  });
}

export function getQuestionMetaData(question) {
    const currentDate = new Date();
    const questionDate = new Date(question.posted_time);
    const currentDateArray = currentDate.toDateString().split(" ");
    const questionDateArray = questionDate.toDateString().split(" ");
  
    const timeDifference = currentDate - questionDate;
    const secondsAgo = Math.floor(timeDifference / 1000);
    const minutesAgo = Math.floor(timeDifference / 60000);
    const hoursAgo = Math.floor(timeDifference / 3600000);
  
    if (currentDateArray[1] === questionDateArray[1] && currentDateArray[2] === questionDateArray[2] && currentDateArray[3] === questionDateArray[3]) {
      if (timeDifference < 60000) {
        return (
          <div>
            <p><span style={{ color: "green" }}>{question.asked_by.username}</span> asked {secondsAgo} seconds ago</p>
          </div>
        );
      } else if (timeDifference < 3600000) {
        return (
          <div>
            <p><span style={{ color: "green" }}>{question.asked_by.username}</span> asked {minutesAgo} minutes ago</p>
          </div>
        );
      } else if (timeDifference < 86400000) {
        return (
          <div>
            <p><span style={{ color: "green" }}>{question.asked_by.username}</span> asked {hoursAgo} hours ago</p>
          </div>
        );
      }
    } else {
      const hourAndMinutes = questionDateArray[4].split(":").slice(0, 2).join(":");
      return (
        <div>
          <p><span style={{ color: "green" }}>{question.asked_by.username}</span> asked {questionDateArray[1]} {questionDateArray[2]} at {hourAndMinutes}</p>
        </div>
      );
    }
  }
  