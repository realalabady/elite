import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import type { Doctor } from "@/data/doctors";

interface DoctorCardProps {
  doctor: Doctor;
}

export const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const lang = currentLanguage as "en" | "ar";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-medium transition-all duration-300 group"
    >
      <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-accent relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-4xl font-display font-bold text-primary">
              {doctor.name[lang].charAt(0)}
            </span>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-card-foreground mb-1">
          {doctor.name[lang]}
        </h3>
        <p className="text-primary font-medium text-sm mb-3">
          {doctor.specialty[lang]}
        </p>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {doctor.bio[lang]}
        </p>

        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4 text-secondary" />
            <span>
              {doctor.experience} {lang === "ar" ? "سنوات" : "years"}
            </span>
          </div>
        </div>

        <Link to={`/booking?doctor=${doctor.id}`}>
          <Button variant="default" className="w-full">
            <Calendar className="w-4 h-4" />
            {t("doctors.bookWith")} {doctor.name[lang].split(" ")[1]}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};
