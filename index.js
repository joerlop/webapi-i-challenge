const express = require("express"); // import the express package

const server = express(); // creates the server

const db = require("./data/db");

server.use(express.json());

// handle requests to the root of the api, the / route
server.get("/", (req, res) => {
  res.send("Hello from Express");
});

server.post("/api/users", (req, res) => {
  const user = req.body;
  if (!user.name || !user.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    db.insert(user)
      .then(user => {
        res.status(201).json(user);
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the user to the database"
        });
      });
  }
});

server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The users information could not be retrieved." });
    });
});

server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;

  db.findById(id)
    .then(user => {
      if (user) res.json(user);
      else
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." });
    });
});

server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;

  db.remove(id)
    .then(user => {
      if (user) res.json(user);
      else
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
    })
    .catch(err => {
      res.status(500).json({ error: "The user could not be removed" });
    });
});

server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const user = req.body;

  if (!user.name || !user.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    db.update(id, user)
      .then(user => {
        console.log(user);
        if (user) res.json(user);
        else
          res
            .status(404)
            .json({
              message: "The user with the specified ID does not exist."
            });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: "The user information could not be modified." });
      });
  }
});

// watch for connections on port 5000
server.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);
