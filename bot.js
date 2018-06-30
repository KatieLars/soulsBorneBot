require('dotenv').config()
var twit = require(’twit’);
var config = require(’./config.js’);
var Twitter = new twit(config);
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
var sheets = google.sheets('v4');

//initial auth stuff that may need to be used again for some other reason
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
//only authorization we need because get requests are the only thing we're doing
//const TOKEN_PATH = 'credentials.json'; //but what is credentials.json?
//initially will get token from first login
function authorize(credentials, callback) {
  (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

//tweet
var tweet = () => {
  // const client_id = process.env.GOOGLE_CLIENT_ID;
  // const client_secret = process.env.GOOGLE_CLIENT_SECRET;
  // const redirect_uri = process.env.REDIRECT_URI
  // const oAuth2Client = new google.auth.OAuth2(
  //     client_id, client_secret, redirect_uri[0]);
  // //grabs constants from hidden .env file
  // const {client_secret, client_id, redirect_uris} = credentials.installed
  let credentials = {client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URI}
    //establishing a set group of values, then adding OAuth
  credentials.OAuth2Client =  new google.auth.OAuth2(
      client_id, client_secret, redirect_uri[0]);
  if (err) return console.log('Error constructing content', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(credentials, grabBosses);
 };

//first makes an api call to Google Sheets
//makes a second api call to Twitter to post the tweet
//1. at 8:30 am and 5:30 pm:
//2. calls the spread sheet
//3. gets this data and randomly chooses

  //apiCall(`1LZy3cPZAW-STv1jiUIJC1WBAU2n4Lj7VcLdEn_H1_Gc`, "A2:C27", "COLUMN")


var apiCall = (id, range, majorDimension) => {
  var request = {
    spreadsheetId: `${id}`,
    range: `${range}`,
    majorDimension: `${majorDimension}`
  };
  sheets.spreadsheets.values.get(request, function(err, response) {
    if (err) {
      console.error(err);
      return;
    }
    else {
      c
    }
  });
});

function authorize(callback) {
  // TODO: Change placeholder below to generate authentication credentials. See
  // https://developers.google.com/sheets/quickstart/nodejs#step_3_set_up_the_sample
  //
  // Authorize using one of the following scopes:
  //   'https://www.googleapis.com/auth/drive'
  //   'https://www.googleapis.com/auth/drive.file'
  //   'https://www.googleapis.com/auth/drive.readonly'
  //   'https://www.googleapis.com/auth/spreadsheets'
  //   'https://www.googleapis.com/auth/spreadsheets.readonly'
  var authClient = null;

  if (authClient == null) {
    console.log('authentication failed');
    return;
  }
  callback(authClient);
}


Twitter.post('statuses/update', params, (err, data) => {
  if(!err) {

  }
})


tweet()

setInterval(tweet, 28800000);
