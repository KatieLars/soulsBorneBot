var twit = require(’twit’);
var config = require(’./config.js’);
var Twitter = new twit(config);
const {google} = require('googleapis');
var sheets = google.sheets('v4');

var tweet = () => {
  //api call to google sheets
  apiCall(`1LZy3cPZAW-STv1jiUIJC1WBAU2n4Lj7VcLdEn_H1_Gc`, "A2:C27", "COLUMN")
  `https://sheets.googleapis.com/v4/spreadsheets/1LZy3cPZAW-STv1jiUIJC1WBAU2n4Lj7VcLdEn_H1_Gc/values/{range}`

}

var apiCall = (id, range, majorDimension) => {
  `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${range}`
}


Twitter.post('statuses/update', params, (err, data) => {
  if(!err) {

  }
})

setInterval(tweet, 3000000);
