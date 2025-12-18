import { useTranslation } from "react-i18next";
import { User } from "lucide-react";
import { Doctor } from "@/types/booking";
import { cn } from "@/lib/utils";

interface DoctorSelectProps {
  doctors: Doctor[];
  selectedDoctor: string;
  onSelectDoctor: (doctorId: string) => void;
}

export const DoctorSelect = ({
  doctors,
  selectedDoctor,
  onSelectDoctor,
}: DoctorSelectProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold mb-2">
          {t("booking.selectDoctor")}
        </h2>
        <p className="text-muted-foreground">
          Choose your preferred doctor for the appointment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doctors.map((doctor) => (
          <button
            key={doctor.id}
            onClick={() => onSelectDoctor(doctor.id)}
            className={cn(
              "p-6 rounded-xl border-2 text-left transition-all hover:shadow-md",
              selectedDoctor === doctor.id
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border hover:border-primary/50"
            )}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-2xl font-display font-bold text-primary">
                  {doctor.name.en.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  {doctor.name.en}
                </h3>
                <p className="text-sm text-primary mb-2">
                  {doctor.specialty.en}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>⭐ {doctor.experience} years experience</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
