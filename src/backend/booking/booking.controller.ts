import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from "@nestjs/common";
import { BookingService } from "./booking.service";

@Controller("booking")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async createBooking(
    @Body()
    data: {
      doctorId: number;
      clinicId: number;
      serviceId: number;
      date: Date;
      startTime: string;
      patientName: string;
      patientEmail: string;
      patientPhone?: string;
    }
  ) {
    return this.bookingService.createBooking(data);
  }

  @Get("available-slots")
  async getAvailableSlots(
    @Query("doctorId") doctorId: number,
    @Query("date") date: string,
    @Query("serviceId") serviceId: number
  ) {
    const parsedDate = new Date(date);
    return this.bookingService.getAvailableSlots(
      doctorId,
      parsedDate,
      serviceId
    );
  }

  @Get("doctor/:doctorId")
  async getBookingsByDoctor(@Param("doctorId") doctorId: number) {
    return this.bookingService.getBookingsByDoctor(doctorId);
  }

  @Delete(":id")
  async cancelBooking(@Param("id") id: number) {
    return this.bookingService.cancelBooking(id);
  }
}
