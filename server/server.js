
const app = require("./app");
console.log("starting server");
app.listen(8000, () => {
  console.log("listening on port 8000");
});