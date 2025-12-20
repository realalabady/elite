import { Module } from "@nestjs/common";
import { BookingModule } from "./booking/booking.module";
import { PrismaService } from "./prisma.service";
import { AppointmentService } from "./appointment.service";
import { AppointmentsController } from "./appointments.controller";

@Module({
  imports: [BookingModule],
  controllers: [AppointmentsController],
  providers: [PrismaService, AppointmentService],
  exports: [PrismaService, AppointmentService],
})
export class AppModule {}
