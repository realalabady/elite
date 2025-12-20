import "dotenv/config";
import { PrismaClient } from "../generated/prisma/index";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://username:password@localhost:5432/elite_medical_db";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create Clinic
  const clinic = await prisma.clinic.create({
    data: {
      name: "Elite Medical Center",
    },
  });
  console.log("✅ Created clinic:", clinic.name);

  // Create Services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: "General Consultation",
        duration: 30, // 30 minutes
      },
    }),
    prisma.service.create({
      data: {
        name: "Specialist Consultation",
        duration: 45, // 45 minutes
      },
    }),
    prisma.service.create({
      data: {
        name: "Follow-up Visit",
        duration: 20, // 20 minutes
      },
    }),
    prisma.service.create({
      data: {
        name: "Health Check-up",
        duration: 60, // 1 hour
      },
    }),
  ]);
  console.log(
    "✅ Created services:",
    services.map((s) => s.name)
  );

  // Create Doctors
  const doctor1 = await prisma.doctor.create({
    data: {
      name: "Dr. Sarah Johnson",
      clinicId: clinic.id,
      services: {
        create: [
          { serviceId: services[0].id }, // General Consultation
          { serviceId: services[2].id }, // Follow-up Visit
          { serviceId: services[3].id }, // Health Check-up
        ],
      },
      workingHours: {
        create: [
          { dayOfWeek: "monday", startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: "tuesday", startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: "wednesday", startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: "thursday", startTime: "09:00", endTime: "17:00" },
          { dayOfWeek: "friday", startTime: "09:00", endTime: "17:00" },
        ],
      },
    },
    include: {
      services: {
        include: {
          service: true,
        },
      },
      workingHours: true,
    },
  });

  const doctor2 = await prisma.doctor.create({
    data: {
      name: "Dr. Michael Chen",
      clinicId: clinic.id,
      services: {
        create: [
          { serviceId: services[1].id }, // Specialist Consultation
          { serviceId: services[2].id }, // Follow-up Visit
          { serviceId: services[3].id }, // Health Check-up
        ],
      },
      workingHours: {
        create: [
          { dayOfWeek: "monday", startTime: "10:00", endTime: "18:00" },
          { dayOfWeek: "tuesday", startTime: "10:00", endTime: "18:00" },
          { dayOfWeek: "wednesday", startTime: "10:00", endTime: "18:00" },
          { dayOfWeek: "thursday", startTime: "10:00", endTime: "18:00" },
          { dayOfWeek: "friday", startTime: "10:00", endTime: "18:00" },
          { dayOfWeek: "saturday", startTime: "09:00", endTime: "13:00" },
        ],
      },
    },
    include: {
      services: {
        include: {
          service: true,
        },
      },
      workingHours: true,
    },
  });

  console.log("✅ Created doctors:");
  console.log("  -", doctor1.name, "with", doctor1.services.length, "services");
  console.log("  -", doctor2.name, "with", doctor2.services.length, "services");

  // Create sample appointments for testing
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const sampleAppointments = await Promise.all([
    prisma.appointment.create({
      data: {
        doctorId: doctor1.id,
        clinicId: clinic.id,
        serviceId: services[0].id, // General Consultation
        date: tomorrow,
        startTime: "10:00",
      },
    }),
    prisma.appointment.create({
      data: {
        doctorId: doctor2.id,
        clinicId: clinic.id,
        serviceId: services[1].id, // Specialist Consultation
        date: tomorrow,
        startTime: "14:00",
      },
    }),
  ]);

  console.log("✅ Created sample appointments for testing");

  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   Clinic: ${clinic.name}`);
  console.log(`   Doctors: ${doctor1.name}, ${doctor2.name}`);
  console.log(`   Services: ${services.length} total`);
  console.log(`   Sample Appointments: ${sampleAppointments.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
