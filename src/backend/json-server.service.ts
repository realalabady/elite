import { Injectable, OnModuleInit } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";

@Injectable()
export class JsonServerService implements OnModuleInit {
  private client: AxiosInstance;
  private readonly baseURL =
    process.env.JSON_SERVER_URL || "http://localhost:3002";

  constructor() {
    // Initialize client immediately
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async onModuleInit() {
    console.log(`✅ JSON Server connected at ${this.baseURL}`);
  }

  // Clinics
  get clinic() {
    return {
      findMany: async (options?: { include?: any }) => {
        const response = await this.client.get("/clinics");
        return response.data;
      },
      findUnique: async (options: { where: { id: number } }) => {
        const response = await this.client.get(`/clinics/${options.where.id}`);
        return response.data;
      },
      create: async (options: { data: any; include?: any }) => {
        const response = await this.client.post("/clinics", options.data);
        if (options.include) {
          return this.enrichWithRelations(
            response.data,
            "clinic",
            options.include
          );
        }
        return response.data;
      },
    };
  }

  // Doctors
  get doctor() {
    return {
      findMany: async (options?: { where?: any; include?: any }) => {
        let url = "/doctors";
        if (options?.where) {
          const params = new URLSearchParams();
          Object.entries(options.where).forEach(([key, value]) => {
            if (key === "id" && typeof value === "object" && "notIn" in value) {
              // Handle notIn by fetching all and filtering
              return;
            }
            params.append(key, String(value));
          });
          if (params.toString()) {
            url += `?${params.toString()}`;
          }
        }
        const response = await this.client.get(url);
        let doctors = response.data;

        // Handle notIn filter
        if (options?.where?.id?.notIn) {
          doctors = doctors.filter(
            (d: any) => !options.where.id.notIn.includes(d.id)
          );
        }

        if (options?.include) {
          doctors = await Promise.all(
            doctors.map((doctor: any) =>
              this.enrichWithRelations(doctor, "doctor", options.include)
            )
          );
        }
        return doctors;
      },
      findUnique: async (options: { where: { id: number }; include?: any }) => {
        const response = await this.client.get(`/doctors/${options.where.id}`);
        let doctor = response.data;
        if (options.include) {
          doctor = await this.enrichWithRelations(
            doctor,
            "doctor",
            options.include
          );
        }
        return doctor;
      },
      create: async (options: { data: any; include?: any }) => {
        const response = await this.client.post("/doctors", options.data);
        if (options.include) {
          return this.enrichWithRelations(
            response.data,
            "doctor",
            options.include
          );
        }
        return response.data;
      },
    };
  }

  // Services
  get service() {
    return {
      findMany: async () => {
        const response = await this.client.get("/services");
        return response.data;
      },
      findUnique: async (options: { where: { id: number }; select?: any }) => {
        const response = await this.client.get(`/services/${options.where.id}`);
        let service = response.data;
        if (options.select) {
          const selected: any = {};
          Object.keys(options.select).forEach((key) => {
            if (options.select[key] === true) {
              selected[key] = service[key];
            }
          });
          return selected;
        }
        return service;
      },
      create: async (options: { data: any }) => {
        const response = await this.client.post("/services", options.data);
        return response.data;
      },
    };
  }

  // Appointments
  get appointment() {
    return {
      findMany: async (options?: {
        where?: any;
        include?: any;
        select?: any;
        orderBy?: any;
      }) => {
        let url = "/appointments";
        const params = new URLSearchParams();

        if (options?.where) {
          Object.entries(options.where).forEach(([key, value]) => {
            if (key === "date" && typeof value === "object") {
              // Handle date range (gte, lte)
              if ("gte" in value) {
                params.append("date_gte", new Date(value.gte).toISOString());
              }
              if ("lte" in value) {
                params.append("date_lte", new Date(value.lte).toISOString());
              }
            } else if (key !== "date") {
              params.append(key, String(value));
            }
          });
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await this.client.get(url);
        let appointments = response.data;

        // Filter by date range if needed
        if (options?.where?.date) {
          const dateFilter = options.where.date;
          if (dateFilter.gte || dateFilter.lte) {
            const gte = dateFilter.gte ? new Date(dateFilter.gte) : null;
            const lte = dateFilter.lte ? new Date(dateFilter.lte) : null;
            appointments = appointments.filter((apt: any) => {
              const aptDate = new Date(apt.date);
              if (gte && aptDate < gte) return false;
              if (lte && aptDate > lte) return false;
              return true;
            });
          }
        }

        // Handle select
        if (options?.select) {
          appointments = appointments.map((apt: any) => {
            const selected: any = {};
            Object.keys(options.select).forEach((key) => {
              if (options.select[key] === true) {
                selected[key] = apt[key];
              }
            });
            return selected;
          });
        }

        // Handle include
        if (options?.include) {
          appointments = await Promise.all(
            appointments.map(async (apt: any) => {
              const enriched = await this.enrichWithRelations(
                apt,
                "appointment",
                options.include
              );
              // Handle nested select in include
              if (options.include.service?.select) {
                const selected: any = {};
                Object.keys(options.include.service.select).forEach((key) => {
                  if (options.include.service.select[key] === true) {
                    selected[key] = enriched.service[key];
                  }
                });
                enriched.service = selected;
              }
              return enriched;
            })
          );
        }

        // Handle orderBy
        if (options?.orderBy) {
          const [field, direction] = Object.entries(options.orderBy)[0];
          appointments.sort((a: any, b: any) => {
            const aVal = a[field];
            const bVal = b[field];
            if (direction === "asc") {
              return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            } else {
              return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
            }
          });
        }

        return appointments;
      },
      findFirst: async (options?: {
        where?: any;
        include?: any;
        select?: any;
      }) => {
        const results = await this.appointment.findMany(options);
        return results.length > 0 ? results[0] : null;
      },
      create: async (options: { data: any; include?: any }) => {
        const response = await this.client.post("/appointments", options.data);
        if (options.include) {
          return this.enrichWithRelations(
            response.data,
            "appointment",
            options.include
          );
        }
        return response.data;
      },
      delete: async (options: { where: { id: number } }) => {
        const response = await this.client.delete(
          `/appointments/${options.where.id}`
        );
        return response.data;
      },
    };
  }

  // Working Hours
  get workingHours() {
    return {
      findMany: async (options?: { where?: any }) => {
        let url = "/workingHours";
        if (options?.where) {
          const params = new URLSearchParams();
          Object.entries(options.where).forEach(([key, value]) => {
            params.append(key, String(value));
          });
          if (params.toString()) {
            url += `?${params.toString()}`;
          }
        }
        const response = await this.client.get(url);
        return response.data;
      },
      findFirst: async (options?: { where?: any }) => {
        const results = await this.workingHours.findMany(options);
        return results.length > 0 ? results[0] : null;
      },
      create: async (options: { data: any }) => {
        const response = await this.client.post("/workingHours", options.data);
        return response.data;
      },
    };
  }

  // Doctor Services
  get doctorService() {
    return {
      findUnique: async (options: {
        where: { doctorId_serviceId: { doctorId: number; serviceId: number } };
      }) => {
        const { doctorId, serviceId } = options.where.doctorId_serviceId;
        const response = await this.client.get(
          `/doctorServices?doctorId=${doctorId}&serviceId=${serviceId}`
        );
        return response.data.length > 0 ? response.data[0] : null;
      },
    };
  }

  // Available Slots
  async getAvailableSlots(doctorId: number, date: Date, serviceId: number) {
    try {
      // Normalize date to start of day for proper comparison
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Get service duration
      const serviceResponse = await this.client.get(`/services/${serviceId}`);
      const service = serviceResponse.data;

      if (!service) {
        throw new Error(`Service with id ${serviceId} not found`);
      }

      // Get doctor's working hours for the day
      const dayOfWeek = date
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();

      const workingHoursResponse = await this.client.get(
        `/workingHours?doctorId=${doctorId}&dayOfWeek=${dayOfWeek}`
      );
      const workingHours = workingHoursResponse.data[0];

      if (!workingHours) {
        return [];
      }

      // Get booked appointments for the day
      const appointmentsResponse = await this.client.get(
        `/appointments?doctorId=${doctorId}&date_gte=${startOfDay.toISOString()}&date_lte=${endOfDay.toISOString()}`
      );
      const bookedAppointments = appointmentsResponse.data;

      // Create a set of booked time slots (accounting for service duration)
      const bookedSlots = new Set<string>();
      bookedAppointments.forEach((apt: any) => {
        const [startHours, startMinutes] = apt.startTime.split(":").map(Number);
        const duration = service.duration;
        const totalMinutes = startHours * 60 + startMinutes;
        const endMinutes = totalMinutes + duration;

        // Mark all 30-minute slots within the appointment duration as booked
        for (let minutes = totalMinutes; minutes < endMinutes; minutes += 30) {
          const slotHours = Math.floor(minutes / 60);
          const slotMins = minutes % 60;
          bookedSlots.add(
            `${String(slotHours).padStart(2, "0")}:${String(slotMins).padStart(
              2,
              "0"
            )}`
          );
        }
      });

      // Generate available slots using service duration as interval
      const availableSlots = [];
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

        // Check if this slot overlaps with any booked appointment
        let isAvailable = true;
        for (
          let checkMinutes = currentMinutes;
          checkMinutes < currentMinutes + service.duration;
          checkMinutes += 30
        ) {
          const checkHours = Math.floor(checkMinutes / 60);
          const checkMins = checkMinutes % 60;
          const checkSlot = `${String(checkHours).padStart(2, "0")}:${String(
            checkMins
          ).padStart(2, "0")}`;
          if (bookedSlots.has(checkSlot)) {
            isAvailable = false;
            break;
          }
        }

        if (isAvailable) {
          availableSlots.push(timeSlot);
        }

        // Move to next slot (using 30-minute intervals for granularity)
        currentMinutes += 30;
      }

      return availableSlots;
    } catch (error) {
      console.error("Error in getAvailableSlots:", error);
      throw error;
    }
  }

  // Helper method to enrich data with relations
  private async enrichWithRelations(
    entity: any,
    entityType: string,
    include: any
  ): Promise<any> {
    const enriched = { ...entity };

    if (include.doctor && entity.doctorId) {
      const doctorResponse = await this.client.get(
        `/doctors/${entity.doctorId}`
      );
      enriched.doctor = doctorResponse.data;
    }

    if (include.clinic && entity.clinicId) {
      const clinicResponse = await this.client.get(
        `/clinics/${entity.clinicId}`
      );
      enriched.clinic = clinicResponse.data;
    }

    if (include.service && entity.serviceId) {
      const serviceResponse = await this.client.get(
        `/services/${entity.serviceId}`
      );
      enriched.service = serviceResponse.data;
    }

    if (include.services && entityType === "doctor") {
      const doctorServicesResponse = await this.client.get(
        `/doctorServices?doctorId=${entity.id}`
      );
      const serviceIds = doctorServicesResponse.data.map(
        (ds: any) => ds.serviceId
      );
      const services = await Promise.all(
        serviceIds.map((id: number) => this.client.get(`/services/${id}`))
      );
      enriched.services = services.map((res: any) => ({
        serviceId: res.data.id,
        service: res.data,
      }));
    }

    if (include.workingHours && entityType === "doctor") {
      const workingHoursResponse = await this.client.get(
        `/workingHours?doctorId=${entity.id}`
      );
      enriched.workingHours = workingHoursResponse.data;
    }

    if (include.doctors && entityType === "clinic") {
      const doctorsResponse = await this.client.get(
        `/doctors?clinicId=${entity.id}`
      );
      enriched.doctors = doctorsResponse.data;
    }

    return enriched;
  }

  // Transaction support (mock - JSON Server doesn't support transactions)
  get $transaction() {
    return async (callback: (tx: any) => Promise<any>) => {
      // For JSON Server, we just execute the callback directly
      // In a real scenario, you might want to implement some form of locking
      return callback(this);
    };
  }

  // Disconnect (no-op for JSON Server)
  async $disconnect() {
    // No connection to close for HTTP client
  }
}
