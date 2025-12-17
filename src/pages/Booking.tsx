import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
import { FadeIn } from "@/components/animations/FadeIn";
import { useLanguage } from "@/hooks/useLanguage";
import { clinics } from "@/data/clinics";
import { doctors } from "@/data/doctors";
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
  const lang = currentLanguage as "en" | "ar";
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(1);
  const [selectedClinic, setSelectedClinic] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });

  useEffect(() => {
    const clinicParam = searchParams.get("clinic");
    const doctorParam = searchParams.get("doctor");
    if (clinicParam) {
      setSelectedClinic(clinicParam);
      setStep(2);
    }
    if (doctorParam) {
      const doc = doctors.find((d) => d.id === doctorParam);
      if (doc) {
        setSelectedClinic(doc.clinicId);
        setSelectedDoctor(doctorParam);
        setStep(3);
      }
    }
  }, [searchParams]);

  const filteredDoctors = selectedClinic
    ? doctors.filter((d) => d.clinicId === selectedClinic)
    : doctors;

  const steps = [
    { num: 1, label: t("booking.step1"), icon: Building2 },
    { num: 2, label: t("booking.step2"), icon: User },
    { num: 3, label: t("booking.step3"), icon: Calendar },
    { num: 4, label: t("booking.step4"), icon: Clock },
    { num: 5, label: t("booking.step5"), icon: Check },
  ];

  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!selectedClinic;
      case 2:
        return !!selectedDoctor;
      case 3:
        return !!selectedDate && !!selectedTime;
      case 4:
        return (
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.phone
        );
      default:
        return true;
    }
  };

  const getDates = () => {
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
  };

  const selectedClinicData = clinics.find((c) => c.id === selectedClinic);
  const selectedDoctorData = doctors.find((d) => d.id === selectedDoctor);

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
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
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
                    {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-8 h-0.5 mx-2",
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clinics.map((clinic) => (
                    <button
                      key={clinic.id}
                      onClick={() => setSelectedClinic(clinic.id)}
                      className={cn(
                        "p-4 rounded-xl border-2 text-left transition-all",
                        selectedClinic === clinic.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <h3 className="font-semibold text-foreground mb-1">
                        {clinic.name[lang]}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {clinic.description[lang]}
                      </p>
                    </button>
                  ))}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDoctors.map((doctor) => (
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
                          {doctor.name[lang].charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {doctor.name[lang]}
                        </h3>
                        <p className="text-sm text-primary">
                          {doctor.specialty[lang]}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {doctor.experience}{" "}
                          {lang === "ar" ? "سنوات خبرة" : "years experience"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

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
                  {getDates().map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setSelectedDate(d.value)}
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
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        "py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all",
                        selectedTime === time
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      {time}
                    </button>
                  ))}
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
                    />
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
                    />
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
                    />
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
                    />
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

            {/* Step 5: Confirmation */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
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
                        {selectedClinicData?.name[lang]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("booking.step2")}:
                      </span>
                      <span className="font-medium">
                        {selectedDoctorData?.name[lang]}
                      </span>
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
                    setSelectedClinic("");
                    setSelectedDoctor("");
                    setSelectedDate("");
                    setSelectedTime("");
                    setFormData({
                      firstName: "",
                      lastName: "",
                      email: "",
                      phone: "",
                      notes: "",
                    });
                  }}
                >
                  {t("booking.bookAnother")}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {step < 5 && (
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
                disabled={!canProceed()}
              >
                {step === 4 ? t("booking.confirm") : t("booking.next")}
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
