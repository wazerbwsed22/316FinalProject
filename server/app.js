const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const middleware = require("./middleware");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require('body-parser');

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({     
  extended: true
})); 
app.use(middleware.requestLogger);
app.use(
  session({
    secret: "secret string",
    cookie: {},
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/fake_so'})
  })
)

const questionsRouter = require("./routers/questionRouter");
const answersRouter = require("./routers/answerRouter");
const tagsRouter = require("./routers/tagsRouter");
const usersRouter = require("./routers/userRouter");
const commentsRouter = require("./routers/commentRouter");
app.use("/api/questions", questionsRouter);
app.use("/api/answers", answersRouter);
app.use("/api/tags", tagsRouter);
app.use("/api/users", usersRouter);
app.use("/api/comments", commentsRouter);

app.use(middleware.unknownEndpoint);

mongoose
  .connect("mongodb://127.0.0.1:27017/fake_so")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("failed to connect to database");
  });

module.exports = app;