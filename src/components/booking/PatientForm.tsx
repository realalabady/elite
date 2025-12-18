import { useTranslation } from "react-i18next";
import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PatientFormData } from "@/types/booking";

interface PatientFormProps {
  formData: PatientFormData;
  onFormDataChange: (data: Partial<PatientFormData>) => void;
}

export const PatientForm = ({
  formData,
  onFormDataChange,
}: PatientFormProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold mb-2">
          {t("booking.patientInfo")}
        </h2>
        <p className="text-muted-foreground">
          Please provide your contact information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            {t("booking.firstName")} *
          </label>
          <Input
            value={formData.firstName}
            onChange={(e) => onFormDataChange({ firstName: e.target.value })}
            placeholder={t("booking.firstNamePlaceholder")}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            {t("booking.lastName")} *
          </label>
          <Input
            value={formData.lastName}
            onChange={(e) => onFormDataChange({ lastName: e.target.value })}
            placeholder={t("booking.lastNamePlaceholder")}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            {t("booking.email")} *
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => onFormDataChange({ email: e.target.value })}
            placeholder={t("booking.emailPlaceholder")}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            {t("booking.phone")} *
          </label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => onFormDataChange({ phone: e.target.value })}
            placeholder={t("booking.phonePlaceholder")}
            required
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-foreground">
            {t("booking.notes")}
          </label>
          <Textarea
            value={formData.notes || ""}
            onChange={(e) => onFormDataChange({ notes: e.target.value })}
            placeholder={t("booking.notesPlaceholder")}
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};
