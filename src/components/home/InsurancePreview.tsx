import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InsuranceGrid } from "@/components/cards/InsuranceGrid";
import { FadeIn } from "@/components/animations/FadeIn";
import { useLanguage } from "@/hooks/useLanguage";

export const InsurancePreview = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="py-20 gradient-soft">
      <div className="container mx-auto px-4">
        <FadeIn className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("home.insurancePartners")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("home.insurancePartnersDesc")}
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <InsuranceGrid />
        </FadeIn>

        <FadeIn className="text-center mt-10">
          <Link to="/insurance">
            <Button variant="ghost" size="lg">
              {t("clinics.learnMore")}
              <Arrow className="w-4 h-4" />
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
};
