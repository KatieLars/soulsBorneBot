require('dotenv').config()
var twit = require('twit');
var config = require('./config.js');
var Twitter = new twit(config);
const fs = require('fs'); //file system
const readline = require('readline');
const {google} = require('googleapis');
var borneBosses = []

// Twitter.post('statuses/update', { status: 'Look, I am tweeting!' }, function(err, data, response) {
//   console.log(data)
// });

//initial auth stuff that may need to be used again for some other reason
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
//only authorization we need because get requests are the only thing we're doing
const TOKEN_PATH = 'credentials.json'; //created to store access token

//tweet
var preTweet = () => {
  let credentials = {client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URI.split(",")}
    //establishing a set group of values, then adding OAuth
  credentials.OAuth2Client =  new google.auth.OAuth2(
      credentials.client_id, credentials.client_secret, credentials.redirect_uri[0]);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(credentials, grabBosses);
};//end preTweet

var tweet = (bossArray) => {
  var randomBoss = randomFromArray(bossArray)
  var b64content = fs.readFileSync(randomBoss[1], { encoding: 'base64' })
  Twitter.post('media/upload', { media_data: b64content }, function (err, data, response) {
    if (err){
      console.log('ERROR:');
      console.log(err);
    }
    else{
      console.log('Image uploaded!');
      console.log('Now tweeting it...');
      Twitter.post('statuses/update', {
        media_ids: new Array(data.media_id_string),//what is data?
        status: `${randomBoss[0]}: ${randomBoss[2]}`
      },
        function(err, data, response) {
          if (err){
            console.log('ERROR:');
            console.log(err);
          }
          else{
            console.log('Posted an image!');
          }
        }
      );
    }
  });
  // var params = {
  // q: '#nodejs, #Nodejs',  // REQUIRED
  // result_type: 'recent',
  // lang: 'en'
  // }

  // Twitter.post('media/upload', params, (err, data) => {
  //
  //   //there needs to be a randomizer and an array that tracks
  //     //those bosses that have already been posted
  //   // if(!err) {
  //   //
  //   // }
  // })

}

function authorize(credentials, callback) {
  fs.readFile(TOKEN_PATH, (err, token) => {
    //fires if no token (error)
    if (err) return getNewToken(credentials.OAuth2Client, callback);
    //sets token for session
    credentials.OAuth2Client.setCredentials(JSON.parse(token));
    //Proceeds with API call once token set
    callback(credentials.OAuth2Client, "A2:C27");
  });
}

function getNewToken(OAuth2Client, callback) { //working
  //only fires if no token
  //all handled in the command line . . .
  //tokens last 6 months
  const authUrl = OAuth2Client.generateAuthUrl({
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
    OAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err);
      OAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(OAuth2Client, "A2:C27");
    });
  });
}
//first makes an api call to Google Sheets
//makes a second api call to Twitter to post the tweet
//1. at 8:30 am and 5:30 pm:
//2. calls the spread sheet
//3. gets this data and randomly chooses

  //apiCall(`1LZy3cPZAW-STv1jiUIJC1WBAU2n4Lj7VcLdEn_H1_Gc`, "A2:C27", "COLUMN")

//eventually get will have to become batchGet to accomodate multiple tabs on
  //the same sheet
function grabBosses(auth, range){
  const sheets = google.sheets({version: 'v4', auth})
  var request = {
    spreadsheetId: "1LZy3cPZAW-STv1jiUIJC1WBAU2n4Lj7VcLdEn_H1_Gc",
    range: `${range}`,
    majorDimension: "ROWS"
  };
  sheets.spreadsheets.values.get(request, (err, {data}) => {
      if (err) return console.log('The API returned an error: ' + err);
      const rows = data.values;
      if (rows.length) {
        tweet(rows)
      } else {
        console.log('No data found.');
      }
})};

function randomFromArray(bossArray){//bossArray is an array of arrays
  return bossArray[Math.floor(Math.random() * bossArray.length)];
}

preTweet()

setInterval(preTweet, 28800000);
