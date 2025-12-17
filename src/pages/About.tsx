import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Target, Eye, Award, Heart, Shield, Lightbulb } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { FadeIn } from "@/components/animations/FadeIn";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/StaggerContainer";

const certifications = [
  "Canadian Board in Orthopedic Surgery",
  "American Board in Surgery",
  "Royal College of Surgeon Ireland",
  "Royal College of Surgeons Glasgow",
  "Royal College of Surgeons Edinburgh",
  "Harvard Medical School",
];

const About = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: Award,
      title: t("about.excellence"),
      desc: t("about.excellenceDesc"),
    },
    {
      icon: Heart,
      title: t("about.compassion"),
      desc: t("about.compassionDesc"),
    },
    {
      icon: Shield,
      title: t("about.integrity"),
      desc: t("about.integrityDesc"),
    },
    {
      icon: Lightbulb,
      title: t("about.innovation"),
      desc: t("about.innovationDesc"),
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              {t("about.title")}
            </h1>
            <p className="text-xl text-primary-foreground/80">
              {t("about.subtitle")}
            </p>
          </FadeIn>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto fill-background">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <FadeIn direction="left">
              <div className="bg-card rounded-2xl p-8 shadow-card border border-border/50 h-full">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  {t("about.ourMission")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("about.missionText")}
                </p>
              </div>
            </FadeIn>

            <FadeIn direction="right">
              <div className="bg-card rounded-2xl p-8 shadow-card border border-border/50 h-full">
                <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-secondary" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  {t("about.ourVision")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t("about.visionText")}
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 gradient-soft">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("about.ourValues")}
            </h2>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <StaggerItem key={idx}>
                <div className="text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <value.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{value.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("about.certifications")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("about.certificationsDesc")}
            </p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {certifications.map((cert, idx) => (
              <StaggerItem key={idx}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-card rounded-xl p-4 shadow-card border border-border/50 text-center"
                >
                  <Award className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">{cert}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </Layout>
  );
};

export default About;
