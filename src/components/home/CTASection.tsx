import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Phone, Calendar, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/FadeIn";

export const CTASection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Gradient background with medical theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-blue-600/90 to-primary/95" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_2px,transparent_2px),linear-gradient(to_bottom,#ffffff08_2px,transparent_2px)] bg-[size:64px_64px]" />

      {/* Animated accent shapes */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-[10%] w-72 h-72 bg-white/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.15, 1, 1.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-[5%] w-64 h-64 bg-white/5 rounded-3xl blur-2xl"
      />

      {/* Geometric accents */}
      <div className="absolute top-1/4 left-[8%] w-32 h-32 border-2 border-white/20 rounded-3xl rotate-12" />
      <div className="absolute bottom-1/4 right-[8%] w-24 h-24 bg-white/10 rounded-2xl -rotate-6" />

      <div className="container mx-auto px-4 relative z-10">
        <FadeIn className="text-center max-w-3xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            {t("home.readyToBook")}
          </h2>
          <p className="text-white/90 text-xl mb-4 font-medium drop-shadow">
            {t("home.readyToBookDesc")}
          </p>

          {/* Quick benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
            {["Easy Booking", "Fast Appointments", "Expert Doctors"].map(
              (benefit, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20"
                >
                  <Check className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold">{benefit}</span>
                </div>
              )
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+966138940004">
              <Button
                size="xl"
                className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl font-bold transition-all transform hover:scale-105"
              >
                <Phone className="w-5 h-5" />
                {t("home.callNow")}
              </Button>
            </a>
            <Link to="/booking">
              <Button
                size="xl"
                className="w-full sm:w-auto bg-white/20 text-white border-2 border-white hover:bg-white/30 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 font-bold backdrop-blur-sm"
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
