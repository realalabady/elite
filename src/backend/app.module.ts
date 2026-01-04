import { Module } from "@nestjs/common";
import { BookingModule } from "./booking/booking.module";
import { PrismaModule } from "./prisma.module";
import { JsonServerService } from "./json-server.service";
import { AppointmentService } from "./appointment.service";
import { AppointmentsController } from "./appointments.controller";
import { ClinicsController } from "./clinics.controller";
import { DoctorsController } from "./doctors.controller";
import { TwilioService } from "./twilio.service";
import { OtpController } from "./otp.controller";

@Module({
  imports: [PrismaModule, BookingModule], // PrismaModule must be imported first for @Global() to work
  controllers: [
    AppointmentsController,
    ClinicsController,
    DoctorsController,
    OtpController,
  ],
  providers: [AppointmentService, JsonServerService, TwilioService],
  exports: [AppointmentService, JsonServerService, TwilioService],
})
export class AppModule {}
