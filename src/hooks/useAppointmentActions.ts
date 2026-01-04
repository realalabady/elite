import { useState } from "react";
import { bookingApi, Appointment } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export const useAppointmentActions = (
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>
) => {
  const { toast } = useToast();
  const [cancelling, setCancelling] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [archiving, setArchiving] = useState(false);

  const cancelAppointment = async (appointmentId: number, reason?: string) => {
    setCancelling(true);
    try {
      await bookingApi.updateAppointmentStatus(appointmentId, {
        status: "cancelled",
        notes: reason || undefined,
      });

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId
            ? {
                ...apt,
                status: "cancelled",
                notes: reason || apt.notes,
              }
            : apt
        )
      );

      toast({
        title: "Success",
        description: "Booking cancelled successfully",
      });

      return true;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to cancel booking",
        variant: "destructive",
      });
      return false;
    } finally {
      setCancelling(false);
    }
  };

  const rescheduleAppointment = async (
    appointmentId: number,
    date: string,
    startTime: string
  ) => {
    setRescheduling(true);
    try {
      await bookingApi.updateAppointmentStatus(appointmentId, {
        status: "confirmed",
        date,
        startTime,
      });

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, date, startTime } : apt
        )
      );

      toast({
        title: "Success",
        description: "Booking rescheduled successfully",
      });

      return true;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to reschedule booking",
        variant: "destructive",
      });
      return false;
    } finally {
      setRescheduling(false);
    }
  };

  const archiveAppointment = async (appointmentId: number) => {
    setArchiving(true);
    try {
      await bookingApi.updateAppointmentStatus(appointmentId, {
        archived: true,
      });

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, archived: true } : apt
        )
      );

      toast({
        title: "Success",
        description: "Booking archived successfully",
      });

      return true;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to archive booking",
        variant: "destructive",
      });
      return false;
    } finally {
      setArchiving(false);
    }
  };

  const unarchiveAppointment = async (appointmentId: number) => {
    setArchiving(true);
    try {
      await bookingApi.updateAppointmentStatus(appointmentId, {
        archived: false,
      });

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, archived: false } : apt
        )
      );

      toast({
        title: "Success",
        description: "Booking restored successfully",
      });

      return true;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to restore booking",
        variant: "destructive",
      });
      return false;
    } finally {
      setArchiving(false);
    }
  };

  return {
    cancelAppointment,
    rescheduleAppointment,
    archiveAppointment,
    unarchiveAppointment,
    cancelling,
    rescheduling,
    archiving,
  };
};
