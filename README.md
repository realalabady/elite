# Elite Medical Booking System

A full-stack medical appointment booking system built with React, NestJS, and PostgreSQL. Features a modern UI with multi-language support (English/Arabic) and a comprehensive booking flow.

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Shadcn/ui
- **Backend**: NestJS + TypeScript + Prisma ORM
- **Database**: PostgreSQL
- **UI Components**: Radix UI primitives with custom styling
- **Internationalization**: React i18next (English/Arabic)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Git

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd elite-medical-booking

# Install frontend dependencies
npm install
```

### 2. Database Setup

```bash
# Install PostgreSQL and create a database
# Update the DATABASE_URL in your .env file
DATABASE_URL="postgresql://username:password@localhost:5432/elite_medical_db"

# Generate Prisma client and run migrations
npx prisma generate
npx prisma db push

# Seed the database with sample data
npx prisma db seed
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/elite_medical_db"

# Frontend API URL (for production)
VITE_API_URL=http://localhost:3000

# JWT Secret (if using authentication)
JWT_SECRET=your-secret-key
```

### 4. Run the Application

#### Development Mode (Frontend + Backend)

```bash
# Terminal 1: Start the backend server
npm run backend:dev

# Terminal 2: Start the frontend development server
npm run dev
```

#### Production Build

```bash
# Build the frontend
npm run build

# Start the backend in production
npm run backend:start:prod
```

## 📁 Project Structure

```
elite-medical-booking/
├── src/
│   ├── backend/              # NestJS backend code
│   │   ├── booking/         # Booking module
│   │   ├── prisma.service.ts # Database service
│   │   └── appointment.service.ts
│   ├── components/          # React components
│   │   ├── ui/             # Shadcn/ui components
│   │   ├── layout/         # Layout components
│   │   └── booking/        # Booking flow components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── types/              # TypeScript type definitions
│   ├── i18n/               # Internationalization
│   └── lib/                # Utilities
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts            # Database seeding
├── public/                 # Static assets
└── dist/                   # Built frontend (after build)
```

## 🔧 Available Scripts

### Frontend Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend Scripts

- `npm run backend:dev` - Start backend in development mode
- `npm run backend:start` - Start backend in production mode
- `npm run backend:start:prod` - Start backend with production optimizations

### Database Scripts

- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database
- `npx prisma db seed` - Seed database with sample data
- `npx prisma migrate dev` - Create and apply migrations

## 🌐 API Endpoints

### Clinics

- `GET /clinics` - Get all clinics
- `GET /clinics/:id` - Get clinic by ID

### Doctors

- `GET /doctors` - Get all doctors (filter by clinic)
- `GET /doctors/:id` - Get doctor by ID
- `GET /doctors/:id/working-hours` - Get doctor working hours

### Services

- `GET /services` - Get all services (filter by doctor)
- `GET /services/:id` - Get service by ID

### Bookings

- `GET /booking/available-slots` - Get available time slots
- `POST /appointments` - Create new appointment
- `GET /appointments/:id` - Get appointment by ID

## 🎨 Features

### Frontend

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Multi-language Support**: English and Arabic (RTL support)
- **Booking Flow**: Step-by-step appointment booking
- **Real-time Validation**: Form validation with error handling
- **Loading States**: Skeleton loaders and progress indicators
- **Toast Notifications**: User feedback for actions

### Backend

- **RESTful API**: Well-structured endpoints with proper HTTP methods
- **Database Relations**: Complex relationships between clinics, doctors, and services
- **Data Validation**: Input validation with DTOs
- **Error Handling**: Comprehensive error responses
- **Prisma ORM**: Type-safe database operations

## 🔒 Security

- Input validation and sanitization
- SQL injection prevention via Prisma ORM
- CORS configuration
- Environment variable management
- JWT authentication (if implemented)

## 🧪 Testing

```bash
# Run frontend tests (if configured)
npm run test

# Run backend tests (if configured)
npm run backend:test
```

## 🚀 Deployment

### Frontend Deployment

```bash
npm run build
# Deploy the 'dist' folder to your hosting service (Netlify, Vercel, etc.)
```

### Backend Deployment

```bash
npm run backend:build
npm run backend:start:prod
# Deploy to services like Railway, Render, or AWS
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@elitemedical.com or create an issue in this repository.

## 🔄 Updates

Keep your dependencies updated:

```bash
npm update
npx prisma generate
```

---

**Note**: Make sure your PostgreSQL database is running and accessible before starting the backend server.
