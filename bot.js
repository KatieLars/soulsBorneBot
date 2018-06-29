var twit = require(’twit’);
var config = require(’./config.js’);
var Twitter = new twit(config);

var tweet = () => {
  //api call to google sheets

}

Twitter.post('statuses/update', params, (err, data) => {
  if(!err) {

  }
})

setInterval(tweet, 3000000);
