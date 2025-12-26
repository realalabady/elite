import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { JsonServerService } from "./json-server.service";

@Controller("clinics")
export class ClinicsController {
  private useJsonServer = process.env.USE_JSON_SERVER === "true";

  constructor(
    private prisma: PrismaService,
    private jsonServer: JsonServerService
  ) {}

  @Get()
  async getClinics() {
    if (this.useJsonServer) {
      return this.jsonServer.clinic.findMany({
        include: { doctors: true },
      });
    } else {
      return this.prisma.clinic.findMany({
        include: {
          doctors: true,
        },
      });
    }
  }
}
