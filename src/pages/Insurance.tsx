import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout/Layout";
import { InsuranceGrid } from "@/components/cards/InsuranceGrid";
import { FadeIn } from "@/components/animations/FadeIn";

const Insurance = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              {t("insurance.title")}
            </h1>
            <p className="text-xl text-primary-foreground/80">
              {t("insurance.subtitle")}
            </p>
          </FadeIn>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto fill-background">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </div>
      </section>

      {/* Insurance Partners */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t("insurance.acceptedInsurance")}
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <InsuranceGrid />
          </FadeIn>

          <FadeIn className="text-center mt-12">
            <p className="text-muted-foreground">
              {t("insurance.contactForMore")}
            </p>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
};

export default Insurance;
