import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar,
  User,
  Clock,
  Building2,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FadeIn } from "@/components/animations/FadeIn";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { bookingApi, Clinic, Doctor, Service } from "@/services/api";
import { BookingStep } from "@/types/booking";
import { cn } from "@/lib/utils";

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
];

const Booking = () => {
  const { t } = useTranslation();
  const { currentLanguage, isRTL } = useLanguage();
  const { toast } = useToast();
  const lang = currentLanguage as "en" | "ar";
  const [searchParams, setSearchParams] = useSearchParams();

  // State management
  const [step, setStep] = useState<number>(1);
  const [selectedClinic, setSelectedClinic] = useState<number | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Data state
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  // Normalize slots to an array of time strings (e.g. "10:30").
  // The backend may return either an array of strings or objects; normalize
  // here so the rest of the UI can rely on a consistent `string[]` shape.
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  // Loading and error states
  const [loading, setLoading] = useState({
    clinics: false,
    doctors: false,
    services: false,
    slots: false,
    booking: false,
  });
  const [errors, setErrors] = useState({
    clinics: null,
    doctors: null,
    services: null,
    slots: null,
    booking: null,
  });

  // Load initial data
  useEffect(() => {
    loadClinics();
  }, []);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Load booking state from cookies on mount
  useEffect(() => {
    const clinicCookie = Cookies.get("booking_clinic");
    const doctorCookie = Cookies.get("booking_doctor");
    const serviceCookie = Cookies.get("booking_service");
    const dateCookie = Cookies.get("booking_date");
    const timeCookie = Cookies.get("booking_time");
    const stepCookie = Cookies.get("booking_step");

    if (clinicCookie) setSelectedClinic(parseInt(clinicCookie));
    if (doctorCookie) setSelectedDoctor(parseInt(doctorCookie));
    if (serviceCookie) setSelectedService(parseInt(serviceCookie));
    if (dateCookie) setSelectedDate(dateCookie);
    if (timeCookie) setSelectedTime(timeCookie);
    if (stepCookie) setStep(parseInt(stepCookie));
  }, []);

  // Save booking state to cookies whenever it changes
  useEffect(() => {
    if (selectedClinic)
      Cookies.set("booking_clinic", selectedClinic.toString());
    if (selectedDoctor)
      Cookies.set("booking_doctor", selectedDoctor.toString());
    if (selectedService)
      Cookies.set("booking_service", selectedService.toString());
    if (selectedDate) Cookies.set("booking_date", selectedDate);
    if (selectedTime) Cookies.set("booking_time", selectedTime);
    Cookies.set("booking_step", step.toString());
  }, [
    selectedClinic,
    selectedDoctor,
    selectedService,
    selectedDate,
    selectedTime,
    step,
  ]);

  // Handle URL parameters - only run after clinics are loaded
  useEffect(() => {
    if (clinics.length === 0) return; // Wait for clinics to load

    const clinicParam = searchParams.get("clinic");
    const doctorParam = searchParams.get("doctor");
    const serviceParam = searchParams.get("service");

    // Only populate initial state from URL when local state is empty
    if (clinicParam && !selectedClinic) {
      const clinicExists = clinics.some((c) => c.id.toString() === clinicParam);
      if (clinicExists) {
        setSelectedClinic(parseInt(clinicParam));
        setStep(2);
        loadDoctors(clinicParam);
      }
    }
    if (doctorParam && !selectedDoctor) {
      const doc = doctors.find((d) => d.id.toString() === doctorParam);
      if (doc) {
        setSelectedClinic(doc.clinicId);
        setSelectedDoctor(parseInt(doctorParam));
        setStep(3);
        loadServices(doctorParam);
      }
    }
    if (serviceParam && !selectedService) {
      setSelectedService(parseInt(serviceParam));
      setStep(3);
    }
  }, [
    searchParams,
    doctors,
    clinics,
    selectedClinic,
    selectedDoctor,
    selectedService,
  ]);

  // Load doctors when clinic changes
  useEffect(() => {
    if (selectedClinic && step >= 2) {
      loadDoctors(selectedClinic.toString());
    }
  }, [selectedClinic, step]);

  // Load services when doctor changes
  useEffect(() => {
    if (selectedDoctor && step >= 2) {
      loadServices(selectedDoctor.toString());
    }
  }, [selectedDoctor]);

  // Update URL params immediately when a service is selected
  useEffect(() => {
    if (selectedService != null) {
      setSearchParams({
        clinic: selectedClinic?.toString() || "",
        doctor: selectedDoctor?.toString() || "",
        service: selectedService.toString(),
      });
    }
  }, [selectedService]);

  // Debounced load available slots when date/service/doctor change to reduce requests
  useEffect(() => {
    console.log("[Booking] Slot useEffect triggered:", {
      selectedDoctor,
      selectedDate,
      selectedService,
    });
    let t: ReturnType<typeof setTimeout> | null = null;
    if (selectedDoctor && selectedDate && selectedService) {
      console.log("[Booking] All conditions met, will call loadAvailableSlots");
      // debounce by 300ms
      t = setTimeout(() => {
        loadAvailableSlots(
          selectedDoctor.toString(),
          selectedDate,
          selectedService.toString()
        );
      }, 300);
    }

    return () => {
      if (t) clearTimeout(t);
    };
  }, [selectedDoctor, selectedDate, selectedService]);

  const filteredDoctors = useMemo(
    () =>
      selectedClinic
        ? doctors.filter(
            (d) => d.clinicId === parseInt(selectedClinic.toString())
          )
        : doctors,
    [doctors, selectedClinic]
  );

  const steps: BookingStep[] = useMemo(
    () => [
      { num: 1, label: t("booking.step1"), icon: Building2 },
      { num: 2, label: t("booking.step2"), icon: User },
      { num: 3, label: t("booking.step3"), icon: Calendar },
      { num: 4, label: t("booking.step4"), icon: Clock },
      {
        num: 5,
        label: lang === "ar" ? "التحقق من OTP" : "OTP Verification",
        icon: Check,
      },
      { num: 6, label: t("booking.step5"), icon: Check },
    ],
    [t, lang]
  );

  const nextStep = async () => {
    console.log("[Booking] nextStep called", {
      step,
      selectedClinic,
      selectedDoctor,
      selectedService,
      selectedDate,
      selectedTime,
      canProceed: canProceed(),
    });
    if (step === 1 && selectedClinic) {
      setSearchParams({ clinic: selectedClinic.toString() });
      setStep(2);
    } else if (step === 2 && selectedDoctor) {
      // Ensure services are loaded and auto-select the first service if none selected,
      // then proceed to date selection (step 3)
      let svcId = selectedService;
      if (!services || services.length === 0) {
        const data = await loadServices(selectedDoctor.toString());
        if (Array.isArray(data) && data.length > 0) svcId = data[0].id;
      } else if (!svcId && services.length > 0) {
        svcId = services[0].id;
      }

      if (svcId) setSelectedService(svcId);
      setSearchParams({
        clinic: selectedClinic?.toString(),
        doctor: selectedDoctor.toString(),
        service: svcId ? svcId.toString() : "",
      });
      setStep(3);
    } else if (step === 4) {
      // Validate form and send OTP before booking
      if (validateFormAndSetErrors()) {
        const sent = await sendOTP();
        if (sent) {
          setStep(5); // Move to OTP verification step
        }
      }
    } else if (step === 5) {
      // Verify OTP before booking
      const verified = await verifyOTP();
      if (verified) {
        handleBooking();
      }
    } else if (step === 3) {
      // Before advancing from date/time selection, ensure selected time is actually available.
      const proceed = async () => {
        console.log("[Booking] proceed() start", {
          selectedDate,
          selectedTime,
          selectedDoctor,
          selectedService,
          availableSlots,
        });
        if (
          !selectedDate ||
          !selectedTime ||
          !selectedDoctor ||
          !selectedService
        ) {
          setStep((s) => Math.min(s + 1, 5));
          return;
        }

        // If slots are empty or don't contain the selected time, re-fetch and use returned data
        if (!availableSlots || !availableSlots.includes(selectedTime)) {
          try {
            const slots = await loadAvailableSlots(
              selectedDoctor.toString(),
              selectedDate,
              selectedService.toString()
            );
            console.log("[Booking] fetched slots", { slots });
            const has = Array.isArray(slots) && slots.includes(selectedTime);
            console.log(
              "[Booking] selectedTime included in fetched slots?",
              has
            );
            if (has) {
              setStep(4);
              return;
            }
          } catch (err) {
            // loadAvailableSlots will show toast on error
            return;
          }
        }

        // availableSlots already contains selected time
        setStep(4);
      };

      // run the check
      proceed();
    } else {
      setStep((s) => Math.min(s + 1, 5));
    }
  };
  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  // Validation functions
  const validateEmail = (email: string): boolean => {
    return email.includes("@") && email.includes(".");
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^05\d{8}$/; // Starts with 05 and has 10 digits total
    return phoneRegex.test(phone);
  };

  const checkFormValid = (): boolean => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      validateEmail(formData.email) &&
      formData.phone.trim() // Just check if phone is not empty
    );
  };

  const validateFormAndSetErrors = (): boolean => {
    const errors = {
      firstName: !formData.firstName.trim(),
      lastName: !formData.lastName.trim(),
      email: !validateEmail(formData.email),
      phone: !formData.phone.trim(), // Just check if phone is not empty
    };
    setFormErrors(errors);
    return !Object.values(errors).some((error) => error === true);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!selectedClinic;
      case 2:
        return !!selectedDoctor;
      case 3:
        return !!selectedDate && !!selectedTime;
      case 4:
        return true; // Always allow, validation happens on click
      case 5:
        return otp.length === 5; // OTP must be 5 digits
      default:
        return true;
    }
  };

  // Send OTP via Twilio backend
  const sendOTP = async () => {
    try {
      const apiBaseUrl =
        import.meta.env.VITE_API_URL?.toString() || "http://localhost:3002";

      const response = await fetch(`${apiBaseUrl}/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: formData.phone }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "Failed to send OTP");
      }

      setOtpSent(true);
      setResendCooldown(60); // 60s cooldown before resend

      toast({
        title: lang === "ar" ? "تم إرسال رمز التحقق" : "OTP Sent",
        description:
          lang === "ar"
            ? `تم إرسال رمز التحقق إلى ${formData.phone}`
            : `Verification code sent to ${formData.phone}`,
      });

      return true;
    } catch (error: any) {
      console.error("Error sending OTP:", error);

      let errorMessage =
        lang === "ar"
          ? "فشل إرسال رمز التحقق"
          : "Failed to send verification code";

      if (error?.message) {
        errorMessage = error.message;
      }

      toast({
        title: lang === "ar" ? "خطأ" : "Error",
        description: errorMessage,
        variant: "destructive",
      });

      return false;
    }
  };

  // Verify OTP via Twilio backend
  const verifyOTP = async (): Promise<boolean> => {
    try {
      const apiBaseUrl =
        import.meta.env.VITE_API_URL?.toString() || "http://localhost:3002";

      const response = await fetch(`${apiBaseUrl}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: formData.phone, code: otp }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "Failed to verify OTP");
      }

      if (!data?.verified) {
        setOtpError(lang === "ar" ? "رمز التحقق غير صحيح" : "Invalid OTP");
        return false;
      }

      setOtpError("");
      toast({
        title: lang === "ar" ? "تم التحقق" : "Verified",
        description:
          lang === "ar"
            ? "تم التحقق من رقم هاتفك بنجاح"
            : "Phone number verified successfully",
      });
      return true;
    } catch (error: any) {
      console.error("Error verifying OTP:", error);

      let errorMessage =
        lang === "ar" ? "رمز التحقق غير صحيح" : "Invalid verification code";

      if (error?.message) {
        errorMessage = error.message;
      }

      setOtpError(errorMessage);
      return false;
    }
  };

  const getDates = useMemo(() => {
    const dates = [];
    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        value: date.toISOString().split("T")[0],
        day: date.toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
          weekday: "short",
        }),
        date: date.getDate(),
        month: date.toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
          month: "short",
        }),
      });
    }
    return dates;
  }, [lang]);

  const selectedClinicData = useMemo(() => {
    const id = selectedClinic?.toString();
    return clinics.find((c) => c.id.toString() === id);
  }, [clinics, selectedClinic]);

  const selectedDoctorData = useMemo(() => {
    const id = selectedDoctor?.toString();
    return doctors.find((d) => d.id.toString() === id);
  }, [doctors, selectedDoctor]);

  // Handle clinic selection
  const handleClinicSelect = (clinicId: number) => {
    // If changing clinic, clear downstream selections so user re-selects doctor/service
    setSelectedClinic(clinicId);
    setSelectedDoctor(null);
    setSelectedService(null);
    setSelectedDate("");
    setSelectedTime("");
  };

  // API functions
  const loadClinics = async () => {
    setLoading((prev) => ({ ...prev, clinics: true }));
    setErrors((prev) => ({ ...prev, clinics: null }));
    try {
      const data = await bookingApi.getClinics();
      setClinics(data);
    } catch (error) {
      setErrors((prev) => ({ ...prev, clinics: error.message }));
      toast({
        title: "Error",
        description: "Failed to load clinics",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, clinics: false }));
    }
  };

  const loadDoctors = async (clinicId: string) => {
    setLoading((prev) => ({ ...prev, doctors: true }));
    setErrors((prev) => ({ ...prev, doctors: null }));
    try {
      const data = await bookingApi.getDoctors(clinicId);
      setDoctors(data);
    } catch (error) {
      setErrors((prev) => ({ ...prev, doctors: error.message }));
      toast({
        title: "Error",
        description: "Failed to load doctors",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, doctors: false }));
    }
  };

  const loadServices = async (doctorId: string) => {
    setLoading((prev) => ({ ...prev, services: true }));
    setErrors((prev) => ({ ...prev, services: null }));
    try {
      const data = await bookingApi.getServices(doctorId);
      setServices(data);
    } catch (error) {
      setErrors((prev) => ({ ...prev, services: error.message }));
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, services: false }));
    }
  };

  const loadAvailableSlots = async (
    doctorId: string,
    date: string,
    serviceId: string
  ) => {
    console.log("[Booking] loadAvailableSlots called with:", {
      doctorId,
      date,
      serviceId,
    });
    setLoading((prev) => ({ ...prev, slots: true }));
    setErrors((prev) => ({ ...prev, slots: null }));
    try {
      const data = await bookingApi.getAvailableSlots({
        doctorId,
        date,
        serviceId,
      });
      console.log("[Booking] getAvailableSlots returned:", data);

      // Normalize to string[]: support either [{ time: '10:30', available: true }, '10:30']
      let slots: string[] = [];
      if (Array.isArray(data)) {
        if (data.length > 0 && typeof data[0] === "string") {
          slots = data as string[];
        } else {
          // assume objects with a `time` property
          slots = (data as any[])
            .map((s) => (s && s.time ? String(s.time) : null))
            .filter(Boolean) as string[];
        }
      }

      setAvailableSlots(slots);
      return slots;
    } catch (error) {
      setErrors((prev) => ({ ...prev, slots: error.message }));
      toast({
        title: "Error",
        description: "Failed to load available slots",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading((prev) => ({ ...prev, slots: false }));
    }
  };

  const handleBooking = async () => {
    setLoading((prev) => ({ ...prev, booking: true }));
    setErrors((prev) => ({ ...prev, booking: null }));
    // Final availability check to avoid double-booking: fetch latest slots
    // and ensure the selectedTime is still available before creating the
    // appointment. This reduces race windows where the UI was stale.
    if (!selectedDoctor || !selectedDate || !selectedService || !selectedTime) {
      toast({
        title: "Error",
        description: "Missing booking details",
        variant: "destructive",
      });
      setLoading((prev) => ({ ...prev, booking: false }));
      return;
    }

    try {
      const latest = await bookingApi.getAvailableSlots({
        doctorId: selectedDoctor.toString(),
        date: selectedDate,
        serviceId: selectedService.toString(),
      });
      // Normalize like loadAvailableSlots would
      let latestSlots: string[] = [];
      if (Array.isArray(latest)) {
        if (latest.length > 0 && typeof latest[0] === "string") {
          latestSlots = latest as string[];
        } else {
          latestSlots = (latest as any[])
            .map((s) => (s && s.time ? String(s.time) : null))
            .filter(Boolean) as string[];
        }
      }

      if (!latestSlots.includes(selectedTime)) {
        // Slot is no longer available — handle similarly to server conflict
        toast({
          title: lang === "ar" ? "الوقت محجوز" : "Time slot unavailable",
          description:
            lang === "ar"
              ? "تم حجز هذه الفترة الزمنية للتو. سنقوم بتحديث الأوقات المتاحة."
              : "The selected time was just booked by someone else. Refreshing available slots.",
          variant: "destructive",
        });
        // Refresh authoritative slots into UI
        try {
          await loadAvailableSlots(
            selectedDoctor.toString(),
            selectedDate,
            selectedService.toString()
          );
        } catch (err) {
          console.warn("Failed to refresh slots after pre-submit check:", err);
        }
        // Only clear date/time selection per requirements
        setSelectedDate("");
        setSelectedTime("");
        setStep(3);
        setLoading((prev) => ({ ...prev, booking: false }));
        return;
      }
    } catch (err) {
      // If availability check fails, proceed to try booking but warn in console.
      console.warn("Availability check failed, proceeding to booking:", err);
    }
    try {
      await bookingApi.createAppointment({
        clinicId: parseInt(selectedClinic?.toString() || "0"),
        doctorId: parseInt(selectedDoctor?.toString() || "0"),
        serviceId: parseInt(selectedService?.toString() || "0"),
        date: selectedDate,
        startTime: selectedTime,
        patientName: `${formData.firstName} ${formData.lastName}`,
        patientEmail: formData.email,
        patientPhone: formData.phone,
      });
      // On success, optimistically remove the booked time from local slots
      // then refresh authoritative availability from the server so the slot
      // cannot be immediately re-booked.
      if (selectedTime) {
        setAvailableSlots((prev) =>
          Array.isArray(prev) ? prev.filter((t) => t !== selectedTime) : prev
        );
      }

      // Try to refresh slots for the same doctor/date/service to reflect the
      // new booking on the UI (non-blocking). This prevents the same slot
      // showing as available if the user navigates back to booking.
      try {
        if (selectedDoctor && selectedDate && selectedService) {
          await loadAvailableSlots(
            selectedDoctor.toString(),
            selectedDate,
            selectedService.toString()
          );
        }
      } catch (err) {
        // If refresh fails, we still proceed to confirmation but log it.
        console.warn("Failed to refresh slots after booking:", err);
      }

      setStep(6);
      toast({
        title: "Success",
        description: "Appointment booked successfully",
      });
    } catch (error) {
      // Check for a specific server-side slot conflict and handle it gracefully
      const apiError = (error as any)?.response?.data;
      if (apiError && apiError.error === "SLOT_ALREADY_BOOKED") {
        // Inform the user, refresh the available slots for the attempted date,
        // then reset only the date/time selection and return the user to date/time step.
        toast({
          title: lang === "ar" ? "الوقت محجوز" : "Time slot unavailable",
          description:
            lang === "ar"
              ? "تم حجز هذه الفترة الزمنية للتو. سنقوم بتحديث الأوقات المتاحة."
              : "The selected time was just booked by someone else. Refreshing available slots.",
          variant: "destructive",
        });

        try {
          // Refresh slots for the date that was attempted (do not change API call)
          if (selectedDoctor && selectedDate && selectedService) {
            await loadAvailableSlots(
              selectedDoctor.toString(),
              selectedDate,
              selectedService.toString()
            );
          }
        } catch (err) {
          // If refreshing fails, still continue to reset selection and inform the user.
          console.warn("Failed to refresh slots after conflict:", err);
        }

        // Only clear date/time selection per requirements (do not reset flow)
        setSelectedDate("");
        setSelectedTime("");
        setStep(3);
        // store an error state for booking so UI can show details if needed
        setErrors((prev) => ({
          ...prev,
          booking: apiError.message || apiError.error,
        }));
        return;
      }

      setErrors((prev) => ({ ...prev, booking: (error as any).message }));
      toast({
        title: "Error",
        description: "Failed to book appointment",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, booking: false }));
    }
  };

  const clearBookingCookies = () => {
    Cookies.remove("booking_clinic");
    Cookies.remove("booking_doctor");
    Cookies.remove("booking_service");
    Cookies.remove("booking_date");
    Cookies.remove("booking_time");
    Cookies.remove("booking_step");
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-10 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              {t("booking.title")}
            </h1>
            <p className="text-xl text-primary-foreground/80">
              {t("booking.subtitle")}
            </p>
          </FadeIn>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto fill-background">
            <path d="M0,105L80,110.7C160,117,320,127,480,121C640,117,800,95,960,90C1120,85,1280,95,1360,100.7L1440,105L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </div>
      </section>

      {/* Steps */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 md:gap-4 overflow-x-auto pb-2">
            {steps.map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                    step >= s.num
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      step > s.num
                        ? "bg-primary text-primary-foreground"
                        : step === s.num
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {step > s.num ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      (() => {
                        const Icon = s.icon as any;
                        return <Icon className="w-4 h-4" />;
                      })()
                    )}
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={cn(
                      "hidden md:block w-8 h-0.5 mx-2",
                      step > s.num ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <AnimatePresence mode="wait">
            {/* Step 1: Select Clinic */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="font-display text-2xl font-bold mb-6">
                  {t("booking.selectClinic")}
                </h2>
                {errors.clinics && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{errors.clinics}</AlertDescription>
                  </Alert>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {loading.clinics ? (
                    // Loading skeletons
                    Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl border-2 border-border"
                      >
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    ))
                  ) : clinics.length === 0 ? (
                    // Empty state
                    <div className="col-span-full text-center py-12">
                      <p className="text-muted-foreground">
                        {lang === "ar"
                          ? "لا توجد عيادات متاحة حالياً"
                          : "No clinics available at the moment"}
                      </p>
                    </div>
                  ) : (
                    clinics.map((clinic) => (
                      <button
                        key={clinic.id}
                        onClick={() => handleClinicSelect(clinic.id)}
                        className={cn(
                          "p-4 rounded-xl border-2 text-left transition-all",
                          selectedClinic === clinic.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <h3 className="font-semibold text-foreground mb-1">
                          {clinic.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {clinic.description || "Medical clinic services"}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 2: Select Doctor */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="font-display text-2xl font-bold mb-6">
                  {t("booking.selectDoctor")}
                </h2>
                {errors.doctors && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{errors.doctors}</AlertDescription>
                  </Alert>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {loading.doctors ? (
                    // Loading skeletons
                    Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl border-2 border-border flex items-center gap-4"
                      >
                        <Skeleton className="w-16 h-16 rounded-full shrink-0" />
                        <div className="flex-1">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2 mb-1" />
                          <Skeleton className="h-3 w-1/3" />
                        </div>
                      </div>
                    ))
                  ) : filteredDoctors.length === 0 ? (
                    // Empty state
                    <div className="col-span-full text-center py-12">
                      <p className="text-muted-foreground">
                        {lang === "ar"
                          ? "لا يوجد أطباء متاحون في هذه العيادة"
                          : "No doctors available in this clinic"}
                      </p>
                    </div>
                  ) : (
                    filteredDoctors.map((doctor) => (
                      <button
                        key={doctor.id}
                        onClick={() => setSelectedDoctor(doctor.id)}
                        className={cn(
                          "p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4",
                          selectedDoctor === doctor.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-2xl font-display font-bold text-primary">
                            {doctor.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {doctor.name}
                          </h3>
                          <p className="text-sm text-primary">
                            {doctor.specialty || "Medical Specialist"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {doctor.experience}{" "}
                            {lang === "ar" ? "سنوات خبرة" : "years experience"}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* Services are now selected automatically when advancing from Doctor step; explicit service step removed */}

            {/* Step 3: Select Date & Time */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="font-display text-2xl font-bold mb-6">
                  {t("booking.selectDate")}
                </h2>
                <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
                  {getDates.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => {
                        console.log("[Booking] date selected", d.value);
                        setSelectedDate(d.value);
                      }}
                      className={cn(
                        "flex flex-col items-center p-3 rounded-xl border-2 min-w-[80px] transition-all",
                        selectedDate === d.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <span className="text-xs text-muted-foreground">
                        {d.day}
                      </span>
                      <span className="text-2xl font-bold text-foreground">
                        {d.date}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {d.month}
                      </span>
                    </button>
                  ))}
                </div>

                <h3 className="font-display text-xl font-bold mb-4">
                  {t("booking.selectTime")}
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {timeSlots.map((time) => {
                    const isAvailable =
                      Array.isArray(availableSlots) &&
                      availableSlots.includes(time);
                    return (
                      <button
                        key={time}
                        onClick={() => {
                          if (!isAvailable) return;
                          console.log("[Booking] time selected", time);
                          setSelectedTime(time);
                        }}
                        disabled={!isAvailable || loading.slots}
                        className={cn(
                          "py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all",
                          !isAvailable
                            ? "opacity-50 cursor-not-allowed border-border"
                            : selectedTime === time
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 4: Patient Info */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="font-display text-2xl font-bold mb-6">
                  {lang === "ar" ? "معلوماتك" : "Your Information"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("booking.firstName")}
                    </label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className={
                        formErrors.firstName ? "border-red-500 border-2" : ""
                      }
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {lang === "ar"
                          ? "الاسم الأول مطلوب"
                          : "First name is required"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("booking.lastName")}
                    </label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className={
                        formErrors.lastName ? "border-red-500 border-2" : ""
                      }
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {lang === "ar"
                          ? "اسم العائلة مطلوب"
                          : "Last name is required"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("booking.email")}
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={
                        formErrors.email ? "border-red-500 border-2" : ""
                      }
                      placeholder="example@mail.com"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {lang === "ar"
                          ? "البريد الإلكتروني يجب أن يحتوي على @ و ."
                          : "Email must contain @ and ."}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t("booking.phone")}
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className={
                        formErrors.phone ? "border-red-500 border-2" : ""
                      }
                      placeholder="05xxxxxxxx"
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {lang === "ar"
                          ? "رقم الهاتف يجب أن يبدأ بـ 05 ويحتوي على 10 أرقام"
                          : "Phone must start with 05 and have 10 digits"}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      {t("booking.notes")}
                    </label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: OTP Verification */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-md mx-auto"
              >
                <h2 className="font-display text-2xl font-bold mb-4 text-center">
                  {lang === "ar" ? "التحقق من الهاتف" : "Phone Verification"}
                </h2>
                <p className="text-muted-foreground text-center mb-6">
                  {lang === "ar"
                    ? `تم إرسال رمز التحقق المكون من 5 أرقام إلى ${formData.phone}`
                    : `A 5-digit verification code has been sent to ${formData.phone}`}
                </p>

                <div className="bg-card rounded-xl p-6 shadow-card">
                  <label className="block text-sm font-medium mb-2">
                    {lang === "ar"
                      ? "أدخل رمز التحقق"
                      : "Enter Verification Code"}
                  </label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setOtp(value);
                      setOtpError("");
                    }}
                    placeholder="00000"
                    className={`text-center text-2xl tracking-widest ${
                      otpError ? "border-red-500 border-2" : ""
                    }`}
                  />
                  {otpError && (
                    <p className="text-red-500 text-sm mt-2 text-center">
                      {otpError}
                    </p>
                  )}

                  <button
                    onClick={sendOTP}
                    disabled={resendCooldown > 0}
                    className="w-full mt-4 text-sm text-primary hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {resendCooldown > 0
                      ? lang === "ar"
                        ? `إعادة الإرسال خلال ${resendCooldown}ث`
                        : `Resend in ${resendCooldown}s`
                      : lang === "ar"
                      ? "إعادة إرسال الرمز"
                      : "Resend Code"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 6: Confirmation */}
            {step === 6 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                {/* {console.log("[Booking] Step 5 rendering with:", {
                  selectedClinicData,
                  selectedDoctorData,
                  selectedClinic,
                  selectedDoctor,
                  clinics,
                  doctors,
                }) || null} */}
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-primary" />
                </div>
                <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                  {t("booking.confirmationTitle")}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {t("booking.confirmationMessage")}
                </p>

                <div className="bg-card rounded-xl p-6 shadow-card max-w-md mx-auto text-left">
                  <h3 className="font-semibold mb-4">
                    {t("booking.bookingDetails")}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("booking.step1")}:
                      </span>
                      <span className="font-medium">
                        {selectedClinicData?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("booking.step2")}:
                      </span>
                      <span className="font-medium">
                        {selectedDoctorData?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      {/* Service row removed per UX change */}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("booking.selectDate")}:
                      </span>
                      <span className="font-medium">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("booking.selectTime")}:
                      </span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {lang === "ar" ? "المريض" : "Patient"}:
                      </span>
                      <span className="font-medium">
                        {formData.firstName} {formData.lastName}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="mt-8"
                  onClick={() => {
                    setStep(1);
                    setSelectedClinic(null);
                    setSelectedDoctor(null);
                    setSelectedService(null);
                    setSelectedDate("");
                    setSelectedTime("");
                    setOtp("");
                    setOtpSent(false);
                    setOtpError("");
                    setResendCooldown(0);
                    setFormData({
                      firstName: "",
                      lastName: "",
                      email: "",
                      phone: "",
                      notes: "",
                    });
                    // Clear URL params and cookies
                    setSearchParams({});
                    clearBookingCookies();
                  }}
                >
                  {t("booking.bookAnother")}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {step < 6 && (
            <div className="flex justify-between mt-8 pt-8 border-t border-border">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
              >
                {isRTL ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
                {t("booking.back")}
              </Button>
              <Button
                variant="hero"
                onClick={nextStep}
                disabled={
                  (step < 4 && !canProceed()) ||
                  (step === 5 && otp.length !== 5)
                }
              >
                {step === 4
                  ? lang === "ar"
                    ? "إرسال رمز التحقق"
                    : "Send Verification Code"
                  : step === 5
                  ? lang === "ar"
                    ? "تأكيد الحجز"
                    : "Confirm Booking"
                  : t("booking.next")}
                {isRTL ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Booking;
