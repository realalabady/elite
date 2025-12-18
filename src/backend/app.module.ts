import { Module } from "@nestjs/common";
import { BookingModule } from "./booking/booking.module";
import { PrismaService } from "./prisma.service";
import { AppointmentService } from "./appointment.service";

@Module({
  imports: [BookingModule],
  providers: [PrismaService, AppointmentService],
  exports: [PrismaService, AppointmentService],
})
export class AppModule {}
