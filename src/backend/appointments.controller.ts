import { Controller, Post, Body } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { EmailService } from "./email.service";

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
      amount?: number;
      paymentMethod?: string;
      paymentStatus?: string;
    }
  ) {
    const appointment = await this.prisma.appointment.create({
      data: {
        doctorId: parseInt(data.doctorId),
        clinicId: parseInt(data.clinicId),
        serviceId: parseInt(data.serviceId),
        date: new Date(data.date),
        startTime: data.startTime,
      },
      include: {
        doctor: true,
        clinic: true,
        service: true,
      },
    });

    // Send confirmation email (non-blocking, fire and forget)
    EmailService.sendConfirmationEmail({
      patientName: data.patientName,
      patientEmail: data.patientEmail,
      doctorName: appointment.doctor.name,
      clinicName: appointment.clinic.name,
      serviceName: appointment.service.name,
      date: data.date,
      time: data.startTime,
      appointmentId: appointment.id,
      clinicAddress: (appointment.clinic as any).address || undefined,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentStatus,
    }).catch((error) => {
      console.error("Failed to send confirmation email:", error);
      // Don't throw - email failure shouldn't break the booking
    });

    return {
      ...appointment,
      patientName: data.patientName,
      patientEmail: data.patientEmail,
      patientPhone: data.patientPhone,
    };
  }
}
