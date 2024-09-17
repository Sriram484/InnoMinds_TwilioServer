const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Twilio credentials
const accountSid = "AC2192f52e0dc3d29d1bfe3d9b04bef5e3";
const authToken = "d4b6f0f6af3b277ff925ebde2e7cd836";
const serviceId = "VA0b7e3a0ed450fad20eca71794823656c";
const client = twilio(accountSid, authToken);

// Route to send OTP
app.post('/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const verification = await client.verify.v2.services(serviceId)
      .verifications.create({
        to: `+${phoneNumber}`,   // Make sure phoneNumber has the correct format with country code
        channel: 'sms'     
      });
    res.json({ success: true, status: verification.status });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send OTP', error });
  }
});

// Route to verify OTP
app.post('/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;
  try {
    const verificationCheck = await client.verify.v2.services(serviceId)
      .verificationChecks.create({
        to: `+${phoneNumber}`,
        code: otp
      });
      console.log(verificationCheck.status);
      
    res.json({ success: verificationCheck.status === 'approved' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to verify OTP', error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


