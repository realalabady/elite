import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Phone, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/FadeIn";

export const CTASection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 pattern-dots opacity-20" />

      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        <FadeIn className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            {t("home.readyToBook")}
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            {t("home.readyToBookDesc")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+966138940004">
              <Button variant="warm" size="xl" className="w-full sm:w-auto">
                <Phone className="w-5 h-5" />
                {t("home.callNow")}
              </Button>
            </a>
            <Link to="/booking">
              <Button
                variant="hero-outline"
                size="xl"
                className="w-full sm:w-auto"
              >
                <Calendar className="w-5 h-5" />
                {t("home.bookOnline")}
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
