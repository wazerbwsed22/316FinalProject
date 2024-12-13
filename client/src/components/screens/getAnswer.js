
    export function getAnswerMetaData(answer) {
      var currDate = new Date();
      var currDateArr = currDate.toString().split(" ");
      var answerDate = new Date(answer.posted_time);
      var answerDateArr = answerDate.toString().split(" ");
      var metaDataString = "";
      //If answer was posted on day X
      if (
        currDateArr[1] === answerDateArr[1] &&
        currDateArr[2] === answerDateArr[2] &&
        currDateArr[3] === answerDateArr[3]
      ) {
        if (currDate - answerDate < 60000) {
          //the answer date should appear in seconds (if posted 0 mins. ago)
          var secondsAgo = Math.floor((currDate - answerDate) / 1000);
          metaDataString = <p><span style={{color: "green"}}>{answer.ans_by.username}</span> answered {secondsAgo} seconds ago</p>;
        } else if (currDate - answerDate < 3600000) {
          //minutes (if posted 0 hours ago)
          var minutesAgo = Math.floor((currDate - answerDate) / 60000);
          metaDataString = <p><span style={{color: "green"}}>{answer.ans_by.username}</span> answered {minutesAgo} minutes ago</p>;
        } else if (currDate - answerDate < 86400000) {
          //r hours (if posted less than 24 hrs ago).
          var hoursAgo = Math.floor((currDate - answerDate) / 3600000);
          metaDataString = <p><span style={{color: "green"}}>{answer.ans_by.username}</span> answered {hoursAgo} hours ago</p>;
        }
      } else {
        //<username> answered  <Month><day> at <hh:min>.
        var hourAndMinutes = answerDateArr[4].split(":").slice(0, 2).join(":");
        metaDataString = <p><span style={{color: "green"}}>{answer.ans_by.username}</span> answered {answerDateArr[1]} {answerDateArr[2]} at {hourAndMinutes}</p>;
      }
      return metaDataString;
    }