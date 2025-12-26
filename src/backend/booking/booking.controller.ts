import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
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
    @Query("doctorId") doctorId: string,
    @Query("date") date: string,
    @Query("serviceId") serviceId: string
  ) {
    if (!doctorId || !date || !serviceId) {
      throw new HttpException(
        "Missing required query parameters: doctorId, date, serviceId",
        HttpStatus.BAD_REQUEST
      );
    }

    const parsedDoctorId = parseInt(doctorId, 10);
    const parsedServiceId = parseInt(serviceId, 10);
    const parsedDate = new Date(date);

    if (
      isNaN(parsedDoctorId) ||
      isNaN(parsedServiceId) ||
      isNaN(parsedDate.getTime())
    ) {
      throw new HttpException(
        "Invalid query parameters. doctorId and serviceId must be numbers, date must be a valid date string.",
        HttpStatus.BAD_REQUEST
      );
    }

    return await this.bookingService.getAvailableSlots(
      parsedDoctorId,
      parsedDate,
      parsedServiceId
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
