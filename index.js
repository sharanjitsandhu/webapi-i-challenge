// implement your API here
const express = require("express"); //commonJS module import

//importing data locally
//add this for GET request
const db = require("./data/db.js");

const server = express();

//middleware / add this for POST request
server.use(express.json());

server.get("/", (req, res) => {
  //passing a function with homies
  res.send("It's working!");
});

//GET /users => return a list of users in JSON format
server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      // this method will do two things:
      // 1. set the appropriate headers
      // 2. set the body
      res.status(200).json(users);
    })
    .catch(err => {
      //handle error
      res.status(500).json({
        error: err,
        message: "The users information could not be retrieved."
      });
    });
});

server.get("/api/users/:id", (req, res) => {
  //   const { id } = req.params;
  const id = req.params.id;
  db.findById(id)
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "The user information could not be retrieved."
      });
    });
});

server.post("/api/users", (req, res) => {
  //one way to get data from the client is in the request's body
  //axios.post(url, data) => the data shows up as the body on the server
  const userInfo = req.body;

  if (userInfo.name && userInfo.bio) {
    db.insert(userInfo)
      .then(userId => {
        db.findById(userId.id).then(user => {
          res.status(201).json(user);
        });
      })
      .catch(err => {
        //handle error
        res.status(500).json({
          error: err,
          message: "There was an error while saving the user to the database."
        });
      });
  } else {
    res
      .status(400)
      .json({ message: "Please provide name and bio for the user." });
  }
});

server.delete("/api/users/:id", (req, res) => {
  //axios.delete(.../users/${id})
  const userId = req.params.id; //req.params has the URL parameters
  db.remove(userId)
    .then(removed => {
      if (removed) {
        res.status(204).end(); //sends back a response to the client without sending any data
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        message: "The user could not be removed."
      });
    });
});

server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const user = req.body;

  if (user.name && user.bio) {
    db.update(id, user)
      .then(updated => {
        if (updated) {
          db.findById(id).then(user => {
            res.json(user);
          });
        } else {
          //404 invalid id
          res.status(404).json({
            message: "The user with the specified ID does not exist."
          });
        }
      })
      .catch(err => {
        // something else went wrong
        res.status(500).json({
          error: err,
          message: "Please provide name and bio for the user."
        });
      });
  } else {
    res
      .status(400) //400 name or bio is missing
      .json({ message: "Please provide name and bio for the user." });
  }
});

server.listen(5000, () => {
  console.log("\n*** API is running on port 5000 ***\n");
});
