import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class AppointmentService {
  constructor(private prisma: PrismaService) {}

  async createAppointment(data: {
    doctorId: number;
    clinicId: number;
    serviceId: number;
    date: Date;
    startTime: string;
  }) {
    return this.prisma.appointment.create({
      data,
      include: {
        doctor: true,
        clinic: true,
        service: true,
      },
    });
  }

  async findAvailableDoctors(date: Date, startTime: string) {
    // Find doctors who don't have appointments at the specified time
    const busyDoctors = await this.prisma.appointment.findMany({
      where: {
        date,
        startTime,
      },
      select: {
        doctorId: true,
      },
    });

    const busyDoctorIds = busyDoctors.map((apt) => apt.doctorId);

    return this.prisma.doctor.findMany({
      where: {
        id: {
          notIn: busyDoctorIds,
        },
      },
      include: {
        clinic: true,
        services: {
          include: {
            service: true,
          },
        },
        workingHours: true,
      },
    });
  }

  async getDoctorAppointments(doctorId: number) {
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
}
