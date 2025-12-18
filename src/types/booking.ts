export interface Clinic {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  location: string;
  phone: string;
  email: string;
  image: string;
}

export interface Doctor {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  specialty: {
    en: string;
    ar: string;
  };
  experience: number;
  clinicId: string;
  image?: string;
  bio?: {
    en: string;
    ar: string;
  };
}

export interface Service {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  duration: number;
  price?: number;
  description?: {
    en: string;
    ar: string;
  };
}

export interface WorkingHours {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

import { LucideIcon } from "lucide-react";

export interface BookingStep {
  num: number;
  label: string;
  icon: LucideIcon;
}

export interface DateOption {
  value: string;
  day: string;
  date: number;
  month: string;
}

export interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface BookingState {
  step: number;
  selectedClinic: string;
  selectedDoctor: string;
  selectedService: string;
  selectedDate: string;
  selectedTime: string;
  formData: PatientFormData;
}

export interface BookingActions {
  setStep: (step: number) => void;
  setSelectedClinic: (clinicId: string) => void;
  setSelectedDoctor: (doctorId: string) => void;
  setSelectedService: (serviceId: string) => void;
  setSelectedDate: (date: string) => void;
  setSelectedTime: (time: string) => void;
  setFormData: (data: Partial<PatientFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}
