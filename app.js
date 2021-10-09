//jshint esversion:6

const express = require('express');
const request = require('postman-request');
const https = require('https');

const app = express();

//required to obtain info from html file when POST request completed
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//required as express has issues loading static files such as .js, .css and images
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/signup.html');
});

app.post('/', function (req, res) {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;

  let data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = 'https://us5.api.mailchimp.com/3.0/lists/64ec07f530';

  const options = {
    method: 'POST',
    auth: 'charlie1:85fa3a11b8e2b189f457ff7223e2fa7d-us5',
  };

  const request = https.request(url, options, function (response) {
    console.log(response.statusCode);

    console.log(response.statusCode);
    if (response.statusCode === 200) {
      res.sendFile(__dirname + '/success.html');
    } else {
      res.sendFile(__dirname + '/failure.html');
    }

    response.on('data', function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post('/failure', function (req, res) {
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, function () {
  console.log('server is running on port 3000');
});

//API KEY
//85fa3a11b8e2b189f457ff7223e2fa7d-us5

//List ID
// 64ec07f530
