import { IsNotEmpty, IsNumber, IsString, IsDateString } from "class-validator";
import { Transform } from "class-transformer";

export class GetAvailabilityDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  doctorId: number;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  serviceId: number;
}
