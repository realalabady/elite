import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Controller("clinics")
export class ClinicsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getClinics() {
    return this.prisma.clinic.findMany({
      include: {
        doctors: true,
      },
    });
  }
}
