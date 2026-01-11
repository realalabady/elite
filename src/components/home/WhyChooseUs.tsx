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
    <section className="py-20 relative bg-gradient-to-b from-white via-blue-50/50 to-white overflow-hidden">
      {/* Accent shapes */}
      <div className="absolute top-0 right-[5%] w-72 h-72 bg-gradient-to-br from-primary/10 to-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-[10%] w-64 h-64 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <FadeIn className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-primary bg-clip-text text-transparent mb-4">
            {t("home.whyChooseUs")}
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
            {t("home.whyChooseUsDesc")}
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <StaggerItem key={idx}>
              <div className="text-center group bg-white rounded-2xl p-8 border-2 border-primary/10 shadow-lg hover:shadow-2xl hover:border-primary/30 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-primary/30">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm font-medium">
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
