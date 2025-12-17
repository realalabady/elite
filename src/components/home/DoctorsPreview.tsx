import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DoctorCard } from "@/components/cards/DoctorCard";
import { FadeIn } from "@/components/animations/FadeIn";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/StaggerContainer";
import { doctors } from "@/data/doctors";
import { useLanguage } from "@/hooks/useLanguage";

export const DoctorsPreview = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <FadeIn className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("home.meetDoctors")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("home.meetDoctorsDesc")}
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {doctors.slice(0, 4).map((doctor) => (
            <StaggerItem key={doctor.id}>
              <DoctorCard doctor={doctor} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn className="text-center">
          <Link to="/doctors">
            <Button variant="outline" size="lg">
              {t("home.viewAllDoctors")}
              <Arrow className="w-4 h-4" />
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
};
