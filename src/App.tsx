import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Doctors from "./pages/Doctors";
import Clinics from "./pages/Clinics";
import Insurance from "./pages/Insurance";
import Booking from "./pages/Booking";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AdminReservations from "./pages/admin/Reservations";
import StaffReservations from "./pages/staff/Reservations";
import DoctorAppointments from "./pages/doctor/Appointments";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Index />
                </PublicRoute>
              }
            />
            <Route
              path="/about"
              element={
                <PublicRoute>
                  <About />
                </PublicRoute>
              }
            />
            <Route
              path="/doctors"
              element={
                <PublicRoute>
                  <Doctors />
                </PublicRoute>
              }
            />
            <Route
              path="/clinics"
              element={
                <PublicRoute>
                  <Clinics />
                </PublicRoute>
              }
            />
            <Route
              path="/insurance"
              element={
                <PublicRoute>
                  <Insurance />
                </PublicRoute>
              }
            />
            <Route
              path="/booking"
              element={
                <PublicRoute>
                  <Booking />
                </PublicRoute>
              }
            />
            <Route
              path="/careers"
              element={
                <PublicRoute>
                  <Careers />
                </PublicRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <PublicRoute>
                  <Contact />
                </PublicRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin/reservations"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminReservations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/reservations"
              element={
                <ProtectedRoute requiredRole="staff">
                  <StaffReservations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/appointments"
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DoctorAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/:doctorId/appointments"
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DoctorAppointments />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
