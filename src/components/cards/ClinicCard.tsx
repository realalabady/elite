import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import type { Clinic } from "@/data/clinics";

interface ClinicCardProps {
  clinic: Clinic;
}

export const ClinicCard = ({ clinic }: ClinicCardProps) => {
  const { t } = useTranslation();
  const { currentLanguage, isRTL } = useLanguage();
  const lang = currentLanguage as "en" | "ar";

  const IconComponent =
    (LucideIcons as any)[clinic.icon] || LucideIcons.Stethoscope;
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-card rounded-2xl p-6 shadow-card hover:shadow-medium transition-all duration-300 group border border-border/50"
    >
      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
        <IconComponent className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
      </div>

      <h3 className="font-display text-xl font-semibold text-card-foreground mb-2">
        {clinic.name[lang]}
      </h3>

      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
        {clinic.description[lang]}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {clinic.services[lang].slice(0, 3).map((service, idx) => (
          <span
            key={idx}
            className="px-2 py-1 text-xs bg-accent text-accent-foreground rounded-full"
          >
            {service}
          </span>
        ))}
      </div>

      <Link to={`/booking?clinic=${clinic.id}`}>
        <Button variant="ghost" className="w-full group/btn">
          {t("clinics.bookNow")}
          <Arrow className="w-4 h-4 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
        </Button>
      </Link>
    </motion.div>
  );
};
