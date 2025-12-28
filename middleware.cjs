const fs = require("fs");
const path = require("path");

// Simple working middleware for json-server
module.exports = (req, res, next) => {
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

      return res.json(allSlots);
    } catch (error) {
      console.error("Error in available-slots middleware:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  next();
};
