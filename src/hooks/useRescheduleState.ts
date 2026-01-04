import { useState } from "react";
import { bookingApi, Appointment } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export const useRescheduleState = (selectedAppointment?: Appointment) => {
  const { toast } = useToast();
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const startReschedule = () => {
    if (selectedAppointment) {
      setIsRescheduling(true);
      setSelectedDate(selectedAppointment.date);
      setSelectedTime(selectedAppointment.startTime);
    }
  };

  const cancelReschedule = () => {
    setIsRescheduling(false);
    setSelectedDate("");
    setSelectedTime("");
    setAvailableSlots([]);
  };

  const loadAvailableSlots = async (date: string) => {
    if (!selectedAppointment) return;

    setLoadingSlots(true);
    try {
      const slots = await bookingApi.getAvailableSlots({
        doctorId: selectedAppointment.doctorId.toString(),
        date,
        serviceId: selectedAppointment.serviceId.toString(),
      });
      setAvailableSlots(slots);
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to load available slots",
        variant: "destructive",
      });
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
    loadAvailableSlots(date);
  };

  const canConfirmReschedule =
    selectedDate &&
    selectedTime &&
    selectedAppointment &&
    !(
      selectedDate === selectedAppointment.date &&
      selectedTime === selectedAppointment.startTime
    );

  return {
    isRescheduling,
    selectedDate,
    selectedTime,
    availableSlots,
    loadingSlots,
    startReschedule,
    cancelReschedule,
    handleDateChange,
    setSelectedTime,
    canConfirmReschedule,
  };
};
