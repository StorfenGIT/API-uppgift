let express = require("express");
let app = express();
app.listen(3000);
console.log("Servern körs på port 3000");

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/api.html");
});


app.get("/users", function (req, res) {
  let sql = "SELECT * FROM users";

  con.query(sql, function (err, result, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("Fel i databasanropet!");
      throw err;
    }
    res.json(result);
  });
});

const mysql = require("mysql");
con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "api2023",
  multipleStatements: true,
});


app.get("/users/:id", function (req, res) {
  let userId = req.params.id;
  let sql = `SELECT * FROM users WHERE id = ${userId}`;

  con.query(sql, function (err, result, fields) {
    if (err) {
      console.log(err);
      res.status(500).send("Fel i databasanropet!");
      throw err;
    }

    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).send("Användaren hittades inte");
    }
  });
});

app.use(express.json());

app.post("/users", function (req, res) {
 
  if (isValidUserData(req.body)) {

    let sql = `INSERT INTO users (username, password, name, email)
    VALUES ('${req.body.username}', 
    '${req.body.password}',
    '${req.body.name}',
    '${req.body.email}');
    SELECT LAST_INSERT_ID();`;

    con.query(sql, function (err, result, fields) {
      if (err) {
        console.log(err);
        res.status(500).send("Fel i databasanropet!");
        throw err;
      }
      console.log(result);
      let output = {
        id: result[0].insertId,
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        email: req.body.email,
      };
      res.json(output);
    });
  } else {
    res.status(422).send("username required!"); 
  }
});


function isValidUserData(body) {
  return body && body.username;

}
