import { useState, useEffect } from "react";
import { bookingApi, Appointment, Clinic, Doctor } from "@/services/api";

export const useAppointmentData = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [appointmentsData, clinicsData, doctorsData, servicesData] =
        await Promise.all([
          bookingApi.getAppointments(),
          bookingApi.getClinics(),
          bookingApi.getDoctors(),
          bookingApi.getServices(),
        ]);
      // Auto-update past appointments: if arrived === true and date is past, mark as completed
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const updates: Promise<any>[] = [];
      const normalizedAppointments = appointmentsData.map(
        (apt: Appointment) => {
          const aptDate = new Date(apt.date);
          aptDate.setHours(0, 0, 0, 0);
          const isPast = aptDate.getTime() < today.getTime();
          // New rule: any past appointment that is still confirmed or rescheduled becomes completed
          if (
            isPast &&
            (apt.status === "confirmed" || apt.status === "rescheduled") &&
            apt.status !== "completed"
          ) {
            updates.push(
              bookingApi.updateAppointmentStatus(apt.id, {
                status: "completed",
              })
            );
            return { ...apt, status: "completed" };
          }
          return apt;
        }
      );

      // Execute updates, but don't block UI on failures
      if (updates.length > 0) {
        try {
          await Promise.all(updates);
        } catch (e) {
          // Non-blocking: log if needed; keep local state consistent
        }
      }

      setAppointments(normalizedAppointments);
      setClinics(clinicsData);
      setDoctors(doctorsData);
      setServices(servicesData);
    } catch (err: any) {
      setError(err.message || "Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getEntityName = (id: number, entities: any[], fallback: string) => {
    return (
      entities.find((e) => e.id === parseInt(id.toString()))?.name || fallback
    );
  };

  return {
    appointments,
    clinics,
    doctors,
    services,
    loading,
    error,
    setAppointments,
    getClinicName: (id: number) => getEntityName(id, clinics, "Unknown Clinic"),
    getDoctorName: (id: number) => getEntityName(id, doctors, "Unknown Doctor"),
    getServiceName: (id: number) =>
      getEntityName(id, services, "Unknown Service"),
  };
};
