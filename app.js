const ours = require("./module/index");

// let d = ours.createDS("/Users/username/Documents");
let d = ours.createDS();

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const args = process.argv.slice(2)
const port = 1234;

app.use(bodyParser.json());

app.get("/read/:key", (req, res) => {
  d.read(req.params.key)
    .then(data => {
      res.send(data);
    })
    .catch(data => {
      res.send(data);
    });
});

app.post("/write", (req, res) => {
  d.store(req.body.key, req.body.value, req.body.ttl)
    .then(data => {
      res.send(data);
    })
    .catch(ds => res.send(ds));
});

app.delete("/delete/:key", (req, res) => {
  d.delete(req.params.key).then(data => {
    res.send(data);
  });
});

app.listen(port, () => console.log(`app listening on port ${port}!`));