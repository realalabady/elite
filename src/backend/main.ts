import "reflect-metadata";
import * as dotenv from "dotenv";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as path from "path";

// Load environment variables from .env file
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: [
      "http://localhost:5173",
      "http://localhost:8080",
      "http://localhost:3000",
    ],
    credentials: true,
  });

  // Serve static files from public folder
  app.useStaticAssets(path.join(__dirname, "../../public"), {
    prefix: "/",
  });

  await app.listen(3002);
  console.log("🚀 Backend server running on http://localhost:3002");
  console.log("📁 Serving static files from public/");
}
bootstrap();
