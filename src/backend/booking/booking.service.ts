import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

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
              specialty: true,
            },
          },
          clinic: {
            select: {
              id: true,
              name: true,
              address: true,
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
          createdAt: appointment.createdAt,
        },
        message: "Appointment booked successfully",
      };
    });
  }

  async getAvailableSlots(doctorId: number, date: Date) {
    // Get doctor's working hours for the day
    const dayOfWeek = date.toLocaleLowerCase("en-US", { weekday: "long" });

    const workingHours = await this.prisma.workingHours.findFirst({
      where: {
        doctorId,
        dayOfWeek,
      },
    });

    if (!workingHours) {
      return [];
    }

    // Get booked appointments for the day
    const bookedAppointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        date,
      },
      select: {
        startTime: true,
      },
    });

    const bookedTimes = bookedAppointments.map((apt) => apt.startTime);

    // Generate available slots (assuming 30-minute intervals)
    const availableSlots = [];
    let currentTime = workingHours.startTime;

    while (currentTime < workingHours.endTime) {
      if (!bookedTimes.includes(currentTime)) {
        availableSlots.push(currentTime);
      }

      // Add 30 minutes
      const [hours, minutes] = currentTime.split(":").map(Number);
      const newMinutes = minutes + 30;
      const newHours = hours + Math.floor(newMinutes / 60);
      currentTime = `${String(newHours).padStart(2, "0")}:${String(
        newMinutes % 60
      ).padStart(2, "0")}`;
    }

    return availableSlots;
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
