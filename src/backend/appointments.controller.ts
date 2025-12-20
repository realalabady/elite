import { Controller, Post, Body } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Controller("appointments")
export class AppointmentsController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async createAppointment(
    @Body()
    data: {
      doctorId: string;
      clinicId: string;
      serviceId: string;
      date: string;
      startTime: string;
      patientName: string;
      patientEmail: string;
      patientPhone?: string;
    }
  ) {
    return this.prisma.appointment.create({
      data: {
        doctorId: parseInt(data.doctorId),
        clinicId: parseInt(data.clinicId),
        serviceId: parseInt(data.serviceId),
        date: new Date(data.date),
        startTime: data.startTime,
        patientName: data.patientName,
        patientEmail: data.patientEmail,
        patientPhone: data.patientPhone,
      },
      include: {
        doctor: true,
        clinic: true,
        service: true,
      },
    });
  }
}
