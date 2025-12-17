import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClinicCard } from "@/components/cards/ClinicCard";
import { FadeIn } from "@/components/animations/FadeIn";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/StaggerContainer";
import { clinics } from "@/data/clinics";
import { useLanguage } from "@/hooks/useLanguage";

export const SpecialtiesPreview = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="py-20 gradient-soft">
      <div className="container mx-auto px-4">
        <FadeIn className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("home.ourSpecialties")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("home.ourSpecialtiesDesc")}
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {clinics.slice(0, 6).map((clinic) => (
            <StaggerItem key={clinic.id}>
              <ClinicCard clinic={clinic} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn className="text-center">
          <Link to="/clinics">
            <Button variant="outline" size="lg">
              {t("home.viewAll")}
              <Arrow className="w-4 h-4" />
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
};
