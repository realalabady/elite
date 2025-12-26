import { Controller, Get, Query, Param } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { JsonServerService } from "./json-server.service";

@Controller("doctors")
export class DoctorsController {
  private useJsonServer = process.env.USE_JSON_SERVER === "true";

  constructor(
    private prisma: PrismaService,
    private jsonServer: JsonServerService
  ) {}

  @Get()
  async getDoctors(@Query("clinicId") clinicId?: string) {
    if (this.useJsonServer) {
      const options: any = { include: { services: true } };
      if (clinicId) {
        options.where = { clinicId: parseInt(clinicId) };
      }
      return this.jsonServer.doctor.findMany(options);
    } else {
      if (clinicId) {
        return this.prisma.doctor.findMany({
          where: { clinicId: parseInt(clinicId) },
          include: { services: true },
        });
      }
      return this.prisma.doctor.findMany({
        include: { services: true },
      });
    }
  }

  @Get(":id")
  async getDoctor(@Param("id") id: string) {
    if (this.useJsonServer) {
      return this.jsonServer.doctor.findUnique({
        where: { id: parseInt(id) },
        include: { services: true },
      });
    } else {
      return this.prisma.doctor.findUnique({
        where: { id: parseInt(id) },
        include: { services: true },
      });
    }
  }

  @Get(":id/working-hours")
  async getWorkingHours(@Param("id") id: string) {
    if (this.useJsonServer) {
      const workingHours = await this.jsonServer.workingHours.findMany({
        where: { doctorId: parseInt(id) },
      });
      // Transform to the expected format
      const result: any = {};
      workingHours.forEach((wh: any) => {
        result[wh.dayOfWeek] = {
          start: wh.startTime,
          end: wh.endTime,
        };
      });
      return result;
    } else {
      // For now, return default working hours
      return {
        monday: { start: "09:00", end: "17:00" },
        tuesday: { start: "09:00", end: "17:00" },
        wednesday: { start: "09:00", end: "17:00" },
        thursday: { start: "09:00", end: "17:00" },
        friday: { start: "09:00", end: "17:00" },
        saturday: { start: "09:00", end: "17:00" },
        sunday: null,
      };
    }
  }
}
