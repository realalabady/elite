const fs = require("fs");
const path = require("path");

module.exports = [
  // Middleware to set default status for new appointments
  (req, res, next) => {
    if (req.method === "POST" && req.path === "/appointments") {
      if (!req.body.status) {
        req.body.status = "confirmed";
      }
      req.body.createdAt = new Date().toISOString();
    }
    next();
  },
  // Available slots middleware
  (req, res, next) => {
    if (req.method === "GET" && req.path === "/available-slots") {
      try {
        // Read db.json
        const dbPath = path.join(__dirname, "db.json");
        const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));

        const { doctorId, date, serviceId } = req.query;

        if (!doctorId || !date || !serviceId) {
          res.status(400).json({
            error:
              "Missing required query parameters: doctorId, date, serviceId",
          });
          return;
        }

        const parsedDoctorId = parseInt(doctorId, 10);
        const parsedServiceId = parseInt(serviceId, 10);
        const parsedDate = new Date(date);

        if (
          isNaN(parsedDoctorId) ||
          isNaN(parsedServiceId) ||
          isNaN(parsedDate.getTime())
        ) {
          res.status(400).json({ error: "Invalid query parameters" });
          return;
        }

        // Normalize date to start of day
        const startOfDay = new Date(parsedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(parsedDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Get service
        const service = db.services.find((s) => s.id == parsedServiceId);
        if (!service) {
          res.status(404).json({ error: "Service not found" });
          return;
        }

        // Get doctor's working hours for the day
        const dayOfWeek = parsedDate
          .toLocaleDateString("en-US", { weekday: "long" })
          .toLowerCase();
        const workingHours = db.workingHours.find(
          (wh) => wh.doctorId == parsedDoctorId && wh.dayOfWeek === dayOfWeek
        );

        if (!workingHours) {
          res.json([]);
          return;
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

        res.json(allSlots);
      } catch (error) {
        console.error("Error in available-slots middleware:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      next();
    }
  },
];
