const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config();

// Import Resend for email notifications
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

// Log API key status
if (process.env.RESEND_API_KEY) {
  console.log("✅ Resend API key loaded");
} else {
  console.warn("⚠️ RESEND_API_KEY not found");
}

// Email sending function
async function sendConfirmationEmail(data, db) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isPaid = data.paymentStatus === "paid";
  const paymentBadge = isPaid
    ? '<span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 4px; font-size: 14px;">Paid</span>'
    : '<span style="background: #f59e0b; color: white; padding: 4px 12px; border-radius: 4px; font-size: 14px;">Pay at Clinic</span>';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600;">✅ Appointment Confirmed</h1>
              <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">Your booking with <b>${data.clinicName}</b> has been successfully confirmed</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 40px 20px 40px;">
              <p style="margin: 0; font-size: 16px; color: #374151;">Dear <strong>${
                data.patientName
              }</strong>,</p>
              <p style="margin: 15px 0 0 0; font-size: 16px; color: #374151; line-height: 1.6;">
                Thank you for booking with <b>${data.clinicName}</b>! Your appointment has been confirmed. Please find the details below:
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 40px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                <tr>
                  <td style="padding: 25px;">
                    <h2 style="margin: 0 0 20px 0; font-size: 18px; color: #111827; font-weight: 600;">📋 Appointment Details</h2>
                    
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280; width: 140px;">Appointment ID:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 600;">#${
                          data.appointmentId
                        }</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Date:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 600;">${formatDate(
                          data.date
                        )}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Time:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 600;">${
                          data.time
                        }</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Doctor:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 600;">Dr. ${
                          data.doctorName
                        }</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Service:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827;">${
                          data.serviceName
                        }</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Clinic:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827;">${
                          data.clinicName
                        }</td>
                      </tr>
                      ${
                        data.clinicAddress
                          ? `
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Address:</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #111827;">${data.clinicAddress}</td>
                      </tr>
                      `
                          : ""
                      }
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${
            data.amount
              ? `
          <tr>
            <td style="padding: 20px 40px 0 40px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #eff6ff; border-radius: 8px; border: 1px solid #dbeafe;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #111827; font-weight: 600;">💳 Payment Information</h3>
                    
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #6b7280; width: 140px;">Amount:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #111827; font-weight: 600;">$${Number(
                          data.amount
                        ).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #6b7280;">Payment Method:</td>
                        <td style="padding: 6px 0; font-size: 14px; color: #111827;">${
                          data.paymentMethod || "N/A"
                        }</td>
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
          `
              : ""
          }

          <tr>
            <td style="padding: 25px 40px;">
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px;">
                <p style="margin: 0; font-size: 14px; color: #92400e; font-weight: 600;">⚠️ Important Reminders:</p>
                <ul style="margin: 10px 0 0 0; padding-left: 20px; font-size: 14px; color: #92400e; line-height: 1.6;">
                  <li>Please arrive 10-15 minutes before your appointment</li>
                  <li>Bring a valid ID and insurance card (if applicable)</li>
                  ${
                    !isPaid
                      ? "<li>Payment will be collected at the clinic</li>"
                      : ""
                  }
                  <li>To cancel or reschedule, contact us at least 24 hours in advance</li>
                </ul>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                If you have any questions or need to make changes to your appointment, please contact <b>${data.clinicName}</b> directly.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f9fafb; padding: 25px 40px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                Thank you for choosing <b>${data.clinicName}</b><br>
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

  try {
    const { data: result, error } = await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ||
        "Appointment System <onboarding@resend.dev>",
      to: [data.patientEmail],
      subject: `✅ Appointment Confirmed - ${formatDate(data.date)} at ${
        data.time
      }`,
      html,
    });

    if (error) {
      console.error("❌ Email error:", error);
      return false;
    }

    console.log("✅ Confirmation email sent to:", data.patientEmail);
    return true;
  } catch (err) {
    console.error("❌ Email exception:", err.message);
    return false;
  }
}

// Simple working middleware for json-server
module.exports = (req, res, next) => {
  // Handle POST requests to /appointments - set default status and send email
  if (req.method === "POST" && req.url === "/appointments") {
    console.log("📧 New appointment POST received:", req.body?.patientEmail);

    if (!req.body.status) {
      req.body.status = "confirmed";
    }
    req.body.createdAt = new Date().toISOString();

    // Store original email data before passing to next
    const emailData = {
      patientName: req.body.patientName,
      patientEmail: req.body.patientEmail,
      clinicId: req.body.clinicId,
      doctorId: req.body.doctorId,
      serviceId: req.body.serviceId,
      date: req.body.date,
      startTime: req.body.startTime,
      amount: req.body.amount,
      paymentMethod: req.body.paymentMethod,
      paymentStatus: req.body.paymentStatus,
    };

    // Hook into response finish event
    res.on("finish", async () => {
      console.log("📧 Response finished, status:", res.statusCode);

      if (
        res.statusCode === 201 &&
        process.env.RESEND_API_KEY &&
        emailData.patientEmail
      ) {
        console.log(
          "📧 Sending confirmation email to:",
          emailData.patientEmail
        );
        try {
          const dbPath = path.join(__dirname, "db.json");
          const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));

          const clinic = db.clinics.find((c) => c.id == emailData.clinicId);
          const doctor = db.doctors.find((d) => d.id == emailData.doctorId);
          const service = db.services.find((s) => s.id == emailData.serviceId);

          // Get the latest appointment (the one just created)
          const latestAppointment = db.appointments[db.appointments.length - 1];

          if (clinic && doctor && service && latestAppointment) {
            console.log("📧 Found all data, sending email...");
            await sendConfirmationEmail(
              {
                patientName: emailData.patientName,
                patientEmail: emailData.patientEmail,
                doctorName: doctor.name,
                clinicName: clinic.name,
                serviceName: service.name,
                date: emailData.date,
                time: emailData.startTime,
                appointmentId: latestAppointment.id,
                amount: emailData.amount || clinic.consultationFee,
                paymentMethod: emailData.paymentMethod,
                paymentStatus: emailData.paymentStatus,
                clinicAddress: clinic.location,
              },
              db
            );
          } else {
            console.log(
              "❌ Missing data - clinic:",
              !!clinic,
              "doctor:",
              !!doctor,
              "service:",
              !!service
            );
          }
        } catch (err) {
          console.error("❌ Failed to send email:", err.message);
        }
      }
    });

    return next();
  }

  // Only handle GET requests to /available-slots
  if (req.method === "GET" && req.url.includes("/available-slots")) {
    try {
      const dbPath = path.join(__dirname, "db.json");
      const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));

      const { doctorId, date, serviceId } = req.query;

      if (!doctorId || !date || !serviceId) {
        return res.status(400).json({
          error: "Missing required query parameters: doctorId, date, serviceId",
        });
      }

      const parsedDoctorId = parseInt(doctorId, 10);
      const parsedServiceId = parseInt(serviceId, 10);
      const parsedDate = new Date(date);

      if (
        isNaN(parsedDoctorId) ||
        isNaN(parsedServiceId) ||
        isNaN(parsedDate.getTime())
      ) {
        return res.status(400).json({ error: "Invalid query parameters" });
      }

      // Get service duration
      const service = db.services.find((s) => s.id == parsedServiceId);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }

      // Get doctor's working hours for the day
      const dayOfWeek = parsedDate
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();
      const workingHours = db.workingHours.find(
        (wh) => wh.doctorId == parsedDoctorId && wh.dayOfWeek === dayOfWeek
      );

      if (!workingHours) {
        return res.json([]);
      }

      // Generate all possible slots within working hours
      const allSlots = [];
      const [startHours, startMinutes] = workingHours.startTime
        .split(":")
        .map(Number);
      const [endHours, endMinutes] = workingHours.endTime
        .split(":")
        .map(Number);

      let currentMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;

      while (currentMinutes + service.duration <= endTotalMinutes) {
        const slotHours = Math.floor(currentMinutes / 60);
        const slotMins = currentMinutes % 60;
        const timeSlot = `${String(slotHours).padStart(2, "0")}:${String(
          slotMins
        ).padStart(2, "0")}`;

        allSlots.push(timeSlot);
        currentMinutes += 30;
      }

      // Filter out booked slots - check existing appointments for this doctor on this date
      const bookedSlots = db.appointments
        .filter(
          (apt) =>
            apt.doctorId == parsedDoctorId &&
            apt.date === date &&
            apt.status !== "cancelled"
        )
        .map((apt) => apt.startTime);

      const availableSlots = allSlots.filter(
        (slot) => !bookedSlots.includes(slot)
      );

      return res.json(availableSlots);
    } catch (error) {
      console.error("Error in available-slots middleware:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  next();
};
