require("dotenv").config();
const express = require("express");
const axios = require("axios").default;

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => res.send(`
  <html>
    <head><title>Success!</title></head>
    <body>
      <h1>You did it!</h1>
      <img src="https://media.giphy.com/media/XreQmk7ETCak0/giphy.gif" alt="Cool kid doing thumbs up" />
    </body>
  </html>
`));

app.post("/github", (req, res) => {
  // TODO : Change the content variable to contain the repository name and the Github user name plus emoji flair
  // const content = ":wave: Hi mom!!!!";
  // const avatarUrl = "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif";
  const username = req.body.sender.login;
  const repoName = req.body.repository.name;
  const content = `:taco: :taco: ${username} just starred ${repoName} :rocket: :tada: :tada: :taco:`;
  const avatarUrl = req.body.sender.avatar_url;
  axios
    .post(process.env.DISCORD_WEBHOOK_URL, {
      content: content,
      embeds: [
        {
          image: {
            url: avatarUrl,
          },
        },
      ],
    })
    .then((discordResponse) => {
      console.log("Success!");
      res.status(204).send();
    })
    .catch((err) => console.error(`Error sending to Discord: ${err}`));
});

app.post("/whatsapp", (req, res) => {
  // Handle messages sent by WhatsApp Server
  const username = req.body.contacts[0].profile.name;
  const userID = req.body.contacts[0].wa_id;
  const msgID = req.body.messages[0].id;
  const msgType = req.body.messages[0].type;
  //const msg = req.body.messages[0].text.body; //change into button text
  const msg = req.body.messages[0].button.text;
  const msgStamp = req.body.messages[0].timestamp;
  const msgDateTime = Date.now();
  const content = `Incoming Message: \n
                  Name: ${username} \n
                  WhatsApp Number: ${userID} \n
                  Message ID: ${msgID} \n
                  Message Type: ${msgType} \n
                  Answer: ${msg} \n
                  Timestamp: ${msgStamp}`;
  
  // var mysql = require('mysql');
  // var con = mysql.createConnection({
  //   host: "172.20.3.106",
  //   user: "myuser",
  //   password: "mypass",
  //   database: "whatsapp_logs"
  // });

  // con.connect(function(err) {
  //   if (err) throw err;
  //   console.log("Connected!");
  //   var sql = "INSERT INTO t_chat (whatsapp_name, whatsapp_number, message_id, message_type, message, timestamp, insert_date) VALUES ("+username+","+userID+","+msgID+","+msgType+","+msg+","+msgStamp+","+msgDateTime+")";
  //   con.query(sql, function (err, result) {
  //     if (err) throw err;
  //     console.log("1 record inserted");
  //   });
  // });
  
  axios
    .post(process.env.DISCORD_WEBHOOK_URL, {
      content: content,
      // embeds: [
      //   {
      //     image: {
      //       url: avatarUrl,
      //     },
      //   },
      // ],
    })
    .then((discordResponse) => {
      console.log("Success!");
      res.status(204).send();
    })
    .catch((err) => console.error(`Error sending to Discord: ${err}`));
});

app.use((error, req, res, next) => {
  res.status(500)
  res.send({error: error})
  console.error(error.stack)
  next(error)
})

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
