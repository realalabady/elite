import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as path from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: ["http://localhost:8080", "http://localhost:3000"],
    credentials: true,
  });

  // Serve static files from public folder
  app.useStaticAssets(path.join(__dirname, "../../public"), {
    prefix: "/",
  });

  // Global prefix for all API routes
  app.setGlobalPrefix("api");

  await app.listen(3001);
  console.log("🚀 Backend server running on http://localhost:3001");
  console.log("📁 Serving static files from public/");
}
bootstrap();
