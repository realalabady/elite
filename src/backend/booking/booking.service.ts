import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { JsonServerService } from "../json-server.service";

@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private jsonServer: JsonServerService
  ) {}

  async createBooking(data: {
    doctorId: number;
    clinicId: number;
    serviceId: number;
    date: Date;
    startTime: string;
    patientName: string;
    patientEmail: string;
    patientPhone?: string;
  }) {
    // Check if the time slot is available
    const existingAppointment = await this.prisma.appointment.findFirst({
      where: {
        doctorId: data.doctorId,
        date: data.date,
        startTime: data.startTime,
      },
    });

    if (existingAppointment) {
      throw new Error("Time slot is already booked");
    }

    return this.prisma.appointment.create({
      data: {
        doctorId: data.doctorId,
        clinicId: data.clinicId,
        serviceId: data.serviceId,
        date: data.date,
        startTime: data.startTime,
      },
      include: {
        doctor: true,
        clinic: true,
        service: true,
      },
    });
  }

  async createAppointment(dto: {
    doctorId: number;
    clinicId: number;
    serviceId: number;
    date: string;
    startTime: string;
    patientName: string;
    patientEmail: string;
    patientPhone?: string;
  }) {
    const parsedDate = new Date(dto.date);

    // Use Prisma transaction to ensure atomicity and prevent race conditions
    return this.prisma.$transaction(async (tx) => {
      // Step 1: Check if the time slot is available within the transaction
      const existingAppointment = await tx.appointment.findFirst({
        where: {
          doctorId: dto.doctorId,
          date: parsedDate,
          startTime: dto.startTime,
        },
      });

      if (existingAppointment) {
        throw new Error("Time slot is already booked");
      }

      // Step 2: Create the appointment
      const appointment = await tx.appointment.create({
        data: {
          doctorId: dto.doctorId,
          clinicId: dto.clinicId,
          serviceId: dto.serviceId,
          date: parsedDate,
          startTime: dto.startTime,
        },
        include: {
          doctor: {
            select: {
              id: true,
              name: true,
            },
          },
          clinic: {
            select: {
              id: true,
              name: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              duration: true,
            },
          },
        },
      });

      // Step 3: Return confirmation response
      return {
        success: true,
        appointment: {
          id: appointment.id,
          doctor: appointment.doctor,
          clinic: appointment.clinic,
          service: appointment.service,
          date: appointment.date.toISOString().split("T")[0],
          startTime: appointment.startTime,
          patientName: dto.patientName,
          patientEmail: dto.patientEmail,
          patientPhone: dto.patientPhone,
          status: "confirmed",
        },
        message: "Appointment booked successfully",
      };
    });
  }

  async getAvailableSlots(doctorId: number, date: Date, serviceId: number) {
    try {
      // Normalize date to start of day for proper comparison
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Get service duration
      const service = await this.prisma.service.findUnique({
        where: { id: serviceId },
        select: { duration: true },
      });

      if (!service) {
        throw new Error(`Service with id ${serviceId} not found`);
      }

      // Get doctor's working hours for the day
      const dayOfWeek = date
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();

      const workingHours = await this.prisma.workingHours.findFirst({
        where: {
          doctorId,
          dayOfWeek,
        },
      });

      if (!workingHours) {
        return [];
      }

      // Get booked appointments for the day (using date range to match any time on that day)
      const bookedAppointments = await this.prisma.appointment.findMany({
        where: {
          doctorId,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        include: {
          service: {
            select: {
              duration: true,
            },
          },
        },
      });

      // Create a set of booked time slots (accounting for service duration)
      const bookedSlots = new Set<string>();
      bookedAppointments.forEach((apt) => {
        const [startHours, startMinutes] = apt.startTime.split(":").map(Number);
        const duration = apt.service.duration;
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

  async getBookingsByDoctor(doctorId: number) {
    return this.prisma.appointment.findMany({
      where: {
        doctorId,
      },
      include: {
        clinic: true,
        service: true,
      },
      orderBy: {
        date: "asc",
      },
    });
  }

  async cancelBooking(appointmentId: number) {
    return this.prisma.appointment.delete({
      where: {
        id: appointmentId,
      },
    });
  }
}
