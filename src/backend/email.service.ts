import { Resend } from 'resend';

// Create Resend client lazily to ensure env vars are loaded
function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(apiKey);
}

interface AppointmentEmailData {
  patientName: string;
  patientEmail: string;
  doctorName: string;
  clinicName: string;
  serviceName: string;
  date: string;
  time: string;
  appointmentId: number;
  amount?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  clinicAddress?: string;
}

export class EmailService {
  private static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private static generateConfirmationTemplate(data: AppointmentEmailData): string {
    const isPaid = data.paymentStatus === 'paid';
    const paymentBadge = isPaid
      ? '<span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 4px; font-size: 14px;">Paid</span>'
      : '<span style="background: #f59e0b; color: white; padding: 4px 12px; border-radius: 4px; font-size: 14px;">Payment Pending</span>';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600;">✅ Appointment Confirmed</h1>
              <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">Your booking has been successfully confirmed</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 40px 20px 40px;">
              <p style="margin: 0; font-size: 16px; color: #374151;">Dear <strong>${data.patientName}</strong>,</p>
              <p style="margin: 15px 0 0 0; font-size: 16px; color: #374151; line-height: 1.6;">
                Thank you for booking with us! Your appointment has been confirmed. Please find the details below:
              </p>
            </td>
          </tr>

          <!-- Appointment Details Card -->
          <tr>
            <td style="padding: 0 40px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                <tr>
                  <td style="padding: 25px;">
                    <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #111827; font-weight: 600;">📋 Appointment Details</h2>
                    
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280; width: 140px;">Appointment ID:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 600;">#${data.appointmentId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Date:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 600;">${this.formatDate(data.date)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Time:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 600;">${data.time}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Doctor:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 600;">Dr. ${data.doctorName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Service:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827;">${data.serviceName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Clinic:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827;">${data.clinicName}</td>
                      </tr>
                      ${data.clinicAddress ? `
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Address:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827;">${data.clinicAddress}</td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${data.amount ? `
          <!-- Payment Details -->
          <tr>
            <td style="padding: 20px 40px 0 40px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #eff6ff; border-radius: 8px; border: 1px solid #dbeafe;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #111827; font-weight: 600;">💳 Payment Information</h3>
                    
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #6b7280; width: 140px;">Amount:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #111827; font-weight: 600;">$${data.amount.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Payment Method:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #111827;">${data.paymentMethod || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Status:</td>
                        <td style="padding: 6px 0;">${paymentBadge}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}

          <!-- Important Notes -->
          <tr>
            <td style="padding: 25px 40px;">
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #92400e; font-weight: 600;">⚠️ Important Reminders:</p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px; font-size: 14px; color: #92400e; line-height: 1.6;">
                  <li>Please arrive 10-15 minutes before your appointment</li>
                  <li>Bring a valid ID and insurance card (if applicable)</li>
                  ${!isPaid ? '<li>Payment can be made at the clinic</li>' : ''}
                  <li>If you need to cancel or reschedule, please contact us at least 24 hours in advance</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Contact Information -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                If you have any questions or need to make changes to your appointment, please contact us at:<br>
                <strong style="color: #111827;">Email:</strong> <a href="mailto:support@elitemedical.com" style="color: #667eea; text-decoration: none;">support@elitemedical.com</a><br>
                <strong style="color: #111827;">Phone:</strong> <a href="tel:+1234567890" style="color: #667eea; text-decoration: none;">+1 (234) 567-890</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 25px 40px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                Thank you for choosing Elite Medical<br>
                We look forward to seeing you!
              </p>
              <p style="margin: 15px 0 0 0; font-size: 12px; color: #9ca3af;">
                This is an automated message, please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  static async sendConfirmationEmail(data: AppointmentEmailData): Promise<boolean> {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.warn('⚠️ RESEND_API_KEY not configured. Email not sent.');
        return false;
      }

      const resend = getResendClient();
      const { data: emailData, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Elite Medical <onboarding@resend.dev>',
        to: data.patientEmail,
        subject: `✅ Appointment Confirmed - ${this.formatDate(data.date)} at ${data.time}`,
        html: this.generateConfirmationTemplate(data),
      });

      if (error) {
        console.error('❌ Failed to send email:', error);
        return false;
      }

      console.log('✅ Confirmation email sent to:', data.patientEmail, emailData?.id ? `(ID: ${emailData.id})` : '');
      return true;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      return false;
    }
  }

  static async sendCancellationEmail(data: {
    patientName: string;
    patientEmail: string;
    appointmentId: number;
    reason?: string;
  }): Promise<boolean> {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.warn('⚠️ RESEND_API_KEY not configured. Email not sent.');
        return false;
      }

      const resend = getResendClient();
      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Appointment Cancelled</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; margin: 0; padding: 40px 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
      <h1 style="margin: 0; color: white; font-size: 28px;">❌ Appointment Cancelled</h1>
    </div>
    <div style="padding: 30px 40px;">
      <p style="font-size: 16px; color: #374151;">Dear <strong>${data.patientName}</strong>,</p>
      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        Your appointment <strong>#${data.appointmentId}</strong> has been cancelled.
      </p>
      ${data.reason ? `
      <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; font-size: 14px; color: #7f1d1d;"><strong>Reason:</strong> ${data.reason}</p>
      </div>
      ` : ''}
      <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
        If this cancellation was unexpected or you wish to book a new appointment, please contact us or visit our website.
      </p>
    </div>
    <div style="background-color: #f9fafb; padding: 25px 40px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; font-size: 14px; color: #6b7280;">Elite Medical Booking System</p>
    </div>
  </div>
</body>
</html>
      `;

      const { data: emailData, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Elite Medical <onboarding@resend.dev>',
        to: data.patientEmail,
        subject: `Appointment #${data.appointmentId} Cancelled`,
        html,
      });

      if (error) {
        console.error('❌ Failed to send cancellation email:', error);
        return false;
      }

      console.log('✅ Cancellation email sent to:', data.patientEmail, emailData?.id ? `(ID: ${emailData.id})` : '');
      return true;
    } catch (error) {
      console.error('❌ Error sending cancellation email:', error);
      return false;
    }
  }
}
