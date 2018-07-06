require('dotenv').config()
var twit = require('twit');
var config = require('./config.js');
var Twitter = new twit(config);
var TweetList = require('./TweetList')
var alreadyTweeted = new TweetList([])
const fs = require('fs'); //file system
const readline = require('readline');
const {google} = require('googleapis');
const googleAuth = require('./auth')
const sheetsApi = google.sheets('v4')
const SPREADSHEET_ID = '1LZy3cPZAW-STv1jiUIJC1WBAU2n4Lj7VcLdEn_H1_Gc'

function randomSearchTerm(){
  let searchTerms = ["#Sekiro", "#DarkSouls", "#ShadowsDieTwice", "#Bloodborne",
    "#DemonSouls", "#SoulsBorne"]
  return searchTerms[Math.floor(Math.random() * searchTerms.length)];

}

function retweet() {
  var searchTerm = randomSearchTerm()
  console.log(searchTerm)
  var params = {
    q: `${searchTerm}`,
    lang: 'en'
  }
  Twitter.get('search/tweets', params, function(err, data) {
      // if there no errors
        if (!err) {
            var retweetId = data.statuses[0].id_str;
            console.log(retweetId)
            Twitter.post('statuses/retweet/:id', {
                id: retweetId
            }, function(err, response) {
                if (response) {
                    console.log('Retweeted!!!');
                }
                if (err) {
                    console.log('Something went wrong while RETWEETING... Duplication maybe...');
                }
            });
        }
        else {
          console.log('Something went wrong while SEARCHING...');
        }
    });
  }


var preTweet = () => {
googleAuth.authorize()
    .then((auth) => {
      grabBosses(auth),
       function (err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return console.log(err);
            }
            // var rows = response.values;
            // console.log(auth.credentials)
            // selectBoss(rows)
        };
    })
    .catch((err) => {
        console.log('auth error', err);
    })
  }

var tweet = (boss) => {
  var b64content = fs.readFileSync(boss[1], { encoding: 'base64' })
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
        status: `${boss[0]}: ${boss[2]}`
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
}

// function authorize(credentials, callback) {
//   fs.readFile(TOKEN_PATH, (err, token) => {
//     //fires if no token (error)
//     if (err) return getNewToken(credentials.OAuth2Client, callback);
//     //sets token for session
//     credentials.OAuth2Client.setCredentials(JSON.parse(token));
//     //Proceeds with API call once token set
//     callback(credentials.OAuth2Client, "A2:C27");
//   });
// }
//
// function getNewToken(OAuth2Client, callback) { //working
//   //only fires if no token
//   //all handled in the command line . . .
//   //tokens last 6 months
//   const authUrl = OAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });
//   console.log('Authorize this app by visiting this url:', authUrl);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   rl.question('Enter the code from that page here: ', (code) => {
//     rl.close();
//     OAuth2Client.getToken(code, (err, token) => {
//       if (err) return callback(err);
//       OAuth2Client.setCredentials(token);
//       // Store the token to disk for later program executions
//       fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//         if (err) console.error(err);
//         console.log('Token stored to', TOKEN_PATH);
//       });
//       callback(OAuth2Client, "A2:C27");
//     });
//   });
// }

function grabBosses(auth){
  const sheets = google.sheets({version: 'v4', auth})
  var request = {
    "spreadsheetId": "1LZy3cPZAW-STv1jiUIJC1WBAU2n4Lj7VcLdEn_H1_Gc",
    "range": "'Main'!A2:C49"
  };
  sheets.spreadsheets.values.get(request, (err, {data}) => {
      if (err) return console.log('The API returned an error: ' + err);
      const rows = data.values;
      if (rows.length) {
        selectBoss(rows)
      } else {
        console.log('No data found.');
      }
})};

function selectBoss(bossArray){//bossArray is an array of arrays
  let chosenBoss = bossArray[Math.floor(Math.random() * bossArray.length)];
  duplicateBoss(chosenBoss, bossArray)
}

function duplicateBoss(boss, bossArray){
  if (alreadyTweeted.list.length < bossArray.length) {
    if (alreadyTweeted.list.includes(boss[0])) { //if boss is in the list
      selectBoss(bossArray)
    }
    else {
      alreadyTweeted.list.push(boss)
      tweet(boss)
    }
   }
  else {
    alreadyTweeted.list.clear()
    selectBoss(bossArray)
  }
}

preTweet()
setInterval(preTweet, 7200000000);
retweet()
setInterval(retweet, 3600000000)
