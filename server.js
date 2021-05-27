const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.API_port || 333;

//this is all bcrypt stuff
const bcrypt = require("bcrypt");
const saltRounds = 13;
//this is my array of users
const users = require("./users").users;

//handling json body requests
app.use(express.json());
app.use(cors());

app.post("/register", async (req, resp) => {
  let matchUser = users.find((user) => req.body.email === user.email);
  if (!matchUser) {
    //bcrypt has a hash method that creates an encrypted password
    //the method takes what you're encrypting and how many times
    let hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    let newUser = {
      __id: Date.now(),
      email: req.body.email,
      password: hashedPassword,
    };
    users.push(newUser);
    console.log(`list of users ${users}`);
    resp.status(201).send({ data: newUser });
  } else {
    resp.status
      .status(400)
      .send({
        error: { code: 400, message: `that email address is already in usage` },
      });
  }
});

app.post("/login", async (req, res) => {
  //get the email and password from req.body
  //find the match for the email
  let matchUser = users.find((user) => req.body.email === user.email);
  if (matchUser) {
    //validate the password using bcrypt
    let submittedPass = req.body.password; //plain text from browser
    let savedPass = userMatch.password; //that has been hashed
    const passwordDidMatch = await bcrypt.compare(submittedPass, savedPass);
    if (passwordDidMatch) {
      res.status(200).send({ data: { token: "this is a fake token" } });
    } else {
      res.status(401).send({
        error: { code: 401, message: "invalid username and/or password." },
      });
    }
  } else {
    //cause a delay to hide the fact that there was no match
    let fakePass = `$je31m${saltRounds}leeisthebestttt`;
    await bcrypt.compare(submittedPass, fakePass);
    //to slow down the process, primarily against hackers
    res
      .status(401)
      .send({
        error: { code: 401, message: "invalid username and/or password." },
      });
  }
});

app.listen(port, (err) => {
  if (err) {
    console.error("Failure to launch server");
    return;
  }
  console.log(`Listening on port ${port}`);
});
