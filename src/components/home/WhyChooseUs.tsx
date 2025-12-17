import { useTranslation } from "react-i18next";
import { Award, Building2, Heart, MapPin } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/StaggerContainer";

export const WhyChooseUs = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Award,
      title: t("home.expertDoctors"),
      description: t("home.expertDoctorsDesc"),
    },
    {
      icon: Building2,
      title: t("home.modernFacilities"),
      description: t("home.modernFacilitiesDesc"),
    },
    {
      icon: Heart,
      title: t("home.patientCare"),
      description: t("home.patientCareDesc"),
    },
    {
      icon: MapPin,
      title: t("home.easyAccess"),
      description: t("home.easyAccessDesc"),
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <FadeIn className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("home.whyChooseUs")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("home.whyChooseUsDesc")}
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <StaggerItem key={idx}>
              <div className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
