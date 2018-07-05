const gal = require('google-auth-library');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// const oAuth2Client = new gal.OAuth2Client();

function authorize() {
     return new Promise(resolve => {
       const auth = new gal.GoogleAuth();
       const jwtClient = new gal.JWT(process.env.GOOGLE_CLIENT_EMAIL,
         null,
         process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
         SCOPES
         );
        jwtClient.authorize(() => resolve(jwtClient));
    });
  }

module.exports = {
    authorize,
}
