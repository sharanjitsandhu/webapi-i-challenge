// implement your API here
const express = require("express"); //commonJS module import

//importing data locally
//add this for GET request
const db = require("./data/db.js");

const server = express();

//add this for POST request
server.use(express.json());

server.get("/", (req, res) => {
  //passing a function with homies
  res.send("It's working!");
});

//GET /users => return a list of users in JSON format

server.get("/users", (req, res) => {
  db.find()
    .then(users => {
      // this method will do two things:
      // 1. set the appropriate headers
      // 2. set the body
      res.status(200).json(users);
    })
    .catch(err => {
      //handle error
      res.json({ error: err, message: "Something broke!" });
    });
});

server.post("/users", (req, res) => {
  //one way to ge data from the client is in the request's body
  //axios.post(url, data) =. the dat ashows up as the bosy on the server
  const userInfo = req.body;
  console.log("request body: ", userInfo);

  db.insert(userInfo)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      //handle error
      res.json({
        error: err,
        message: "Please provide name and bio for the user."
      });
    });
});

server.listen(5000, () => {
  console.log("\n*** API is running on port 5000 ***\n");
});
