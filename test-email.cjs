// Quick test script for Resend email
require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendTestEmail() {
  console.log('API Key loaded:', process.env.RESEND_API_KEY ? 'Yes (' + process.env.RESEND_API_KEY.substring(0, 10) + '...)' : 'No');
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Elite Medical <onboarding@resend.dev>',
      to: ['fakealabady@gmail.com'],
      subject: '✅ Test Email from Elite Medical',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f3f4f6;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">✅ Email Test Successful!</h1>
            </div>
            <div style="padding: 30px;">
              <p style="font-size: 16px; color: #333;">Hello!</p>
              <p style="font-size: 16px; color: #333;">This is a test email from Elite Medical Booking System.</p>
              <p style="font-size: 16px; color: #333;">If you received this, your email configuration is working correctly! 🎉</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="font-size: 14px; color: #666;">Sent at: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log('✅ Email sent successfully!');
    console.log('Response:', data);
  } catch (err) {
    console.error('❌ Exception:', err);
  }
}

sendTestEmail();
