// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function createVerification() {
  const verification = await client.verify.v2
    .services("VA50282b2640698f77d9b9aab4a8e90263")
    .verifications.create({
      channel: "sms",
      to: "+966534955842",
    });

  console.log(verification.sid);
}

createVerification();
