// implement your API here
const express = require("express"); //commonJS module import

const server = express();

server.listen(5000, () => {
  console.log("\n*** API is running on port 5000 ***\n");
});
