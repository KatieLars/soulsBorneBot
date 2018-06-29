var twit = require(’twit’);
var config = require(’./config.js’);
var Twitter = new twit(config);
const {google} = require('googleapis');
var sheets = google.sheets('v4');

var tweet = () => {
  //api call to google sheets
  apiCall(`1LZy3cPZAW-STv1jiUIJC1WBAU2n4Lj7VcLdEn_H1_Gc`, "A2:C27", "COLUMN")


}

var apiCall = (id, range, majorDimension) => authorize(function(authClient) {
  var request = {
    spreadsheetId: `${id}`,
    range: `${range}`,
    majorDimension: `${majorDimension}`

    auth: authClient,
  };

  sheets.spreadsheets.values.get(request, function(err, response) {
    if (err) {
      console.error(err);
      return;
    }

    // TODO: Change code below to process the `response` object:
    console.log(JSON.stringify(response, null, 2));
  });
});


Twitter.post('statuses/update', params, (err, data) => {
  if(!err) {

  }
})

setInterval(tweet, 3000000);
