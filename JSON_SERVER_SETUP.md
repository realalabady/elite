# JSON Server Setup for Testing

## Overview
The backend can now use JSON Server instead of Prisma for testing purposes. This allows you to test the API without needing a PostgreSQL database.

## How to Use

### 1. Start JSON Server
```bash
npm run json-server
```
This starts JSON Server on `http://localhost:3002` with the mock data from `db.json`.

### 2. Start Backend with JSON Server
```bash
npm run backend:dev:json
```
This starts the NestJS backend on `http://localhost:3001` using JSON Server for data access.

### 3. Start Backend with Prisma (Production)
```bash
npm run backend:dev
```
This uses Prisma with PostgreSQL (requires DATABASE_URL environment variable).

## Environment Variables

- `USE_JSON_SERVER=true` - Force use of JSON Server
- `JSON_SERVER_URL=http://localhost:3002` - JSON Server URL (default: http://localhost:3002)
- `DATABASE_URL` - PostgreSQL connection string (if not set, JSON Server will be used)

## Available Endpoints

All backend endpoints work the same way:
- `GET /api/booking/available-slots?doctorId=1&date=2024-12-21&serviceId=1`
- `POST /api/booking`
- `GET /api/booking/doctor/:doctorId`
- `DELETE /api/booking/:id`

## Data Structure

The `db.json` file contains:
- **clinics**: Medical clinics
- **doctors**: Doctors with clinic relationships
- **services**: Available medical services
- **doctorServices**: Many-to-many relationship between doctors and services
- **workingHours**: Doctor working hours by day of week
- **appointments**: Booked appointments

## Notes

- JSON Server automatically handles REST API operations (GET, POST, PUT, DELETE)
- Data is persisted in `db.json` file
- Changes to `db.json` are watched and reloaded automatically
- The backend automatically switches to JSON Server if `USE_JSON_SERVER=true` or if `DATABASE_URL` is not set

