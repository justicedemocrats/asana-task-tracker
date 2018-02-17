var express = require("express");
var Webtask = require("webtask-tools");
var bodyParser = require("body-parser");
var request = require("superagent");
var asana = require("asana");
var app = express();

var client = asana.Client.create().useAccessToken(process.env.ASANA_KEY);

app.use(bodyParser.json());

app.get("/", function(req, res) {
  res.status(200).send("hey there! i'm just hanging out over here.");
});

app.post("/handle", function(req, res) {
  const events = res.body.events;
  events.forEach(e => {
    if (e.type == "task") {
      client.tasks.get(e.resource).then(task => {
        e.task = task;

        request
          .post(process.env.ZAP_URL)
          .send(e)
          .end((err, res) => {
            if (err) {
              return console.log(
                `Could not sync ${JSON.stringify(e)}: ${JSON.stringify(err)}`
              );
            }

            console.log(`Sent off ${JSON.stringify(e)}`);
          });
      });
    }
  });

  res.sendStatus(200);
});

app.listen(process.env.PORT || 3000);
