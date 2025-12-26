import { Module, Global } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { JsonServerService } from "./json-server.service";

// Use JSON Server for testing, Prisma for production
// Set USE_JSON_SERVER=true to use JSON Server, or leave DATABASE_URL unset
const useJsonServer =
  process.env.USE_JSON_SERVER === "true" || !process.env.DATABASE_URL;

@Global()
@Module({
  providers: [
    {
      provide: PrismaService,
      useFactory: () => {
        if (useJsonServer) {
          console.log("📦 Using JSON Server for data access");
          return new JsonServerService() as any;
        } else {
          console.log("🗄️ Using Prisma for data access");
          return new PrismaService();
        }
      },
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule {}
