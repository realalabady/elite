import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  // Backend uses a global prefix `/api` (set in backend `main.ts`)
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3003",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

// API endpoints
export const bookingApi = {
  // Get all clinics
  getClinics: () => api.get("/clinics").then((res) => res.data),

  // Get doctors by clinic
  getDoctors: (clinicId?: string) =>
    api.get("/doctors", { params: { clinicId } }).then((res) => res.data),

  // Get services by doctor
  getServices: (doctorId?: string) =>
    api.get("/services", { params: { doctorId } }).then((res) => res.data),

  // Get available slots
  getAvailableSlots: (params: {
    doctorId: string;
    date: string;
    serviceId?: string;
  }) => api.get("/available-slots", { params }).then((res) => res.data),

  // Create appointment
  createAppointment: (data: {
    doctorId: number;
    clinicId: number;
    serviceId: number;
    date: string;
    startTime: string;
    patientName: string;
    patientEmail: string;
    patientPhone?: string;
  }) => api.post("/appointments", data).then((res) => res.data),

  // Get working hours for a doctor
  getWorkingHours: (doctorId: string) =>
    api.get(`/doctors/${doctorId}/working-hours`).then((res) => res.data),

  // Get all appointments
  getAppointments: () => api.get("/appointments").then((res) => res.data),

  // Update appointment status
  updateAppointmentStatus: (
    appointmentId: number,
    data: {
      status?: string;
      notes?: string;
      date?: string;
      startTime?: string;
      archived?: boolean;
      arrived?: boolean | null;
    }
  ) =>
    api.patch(`/appointments/${appointmentId}`, data).then((res) => res.data),
};

export interface Clinic {
  id: number;
  name: string;
  description?: string;
  location?: string;
  phone?: string;
  email?: string;
  image?: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  clinicId: number;
  image?: string;
  bio?: string;
  services?: Service[];
}

export interface Service {
  id: number;
  name: string;
  duration: number;
  price?: number;
  description?: string;
}

export interface WorkingHours {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface BookingResponse {
  success: boolean;
  appointment: {
    id: string;
    doctor: Doctor;
    clinic: Clinic;
    service: Service;
    date: string;
    startTime: string;
    patientName: string;
    patientEmail: string;
    patientPhone?: string;
    status: string;
    createdAt: string;
  };
  message: string;
}

export interface Appointment {
  id: number;
  clinicId: number;
  doctorId: number;
  serviceId: number;
  date: string;
  startTime: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  status: string;
  notes?: string;
  archived?: boolean;
  createdAt?: string;
  arrived?: boolean | null;
}
