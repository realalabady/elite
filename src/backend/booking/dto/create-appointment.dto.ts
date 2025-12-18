import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
} from "class-validator";

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsNumber()
  doctorId: number;

  @IsNotEmpty()
  @IsNumber()
  clinicId: number;

  @IsNotEmpty()
  @IsNumber()
  serviceId: number;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  patientName: string;

  @IsNotEmpty()
  @IsEmail()
  patientEmail: string;

  @IsOptional()
  @IsString()
  patientPhone?: string;
}
