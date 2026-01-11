import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/FadeIn";
import { useLanguage } from "@/hooks/useLanguage";
import { insurancePartners } from "@/data/insurance";
import { motion, AnimatePresence } from "framer-motion";

export const InsurancePreview = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(insurancePartners.length / itemsPerPage);

  const visiblePartners = insurancePartners.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section className="py-20 relative bg-gradient-to-b from-white via-blue-50/50 to-white overflow-hidden">
      {/* Decorative grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e908_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e908_1px,transparent_1px)] bg-[size:100px_100px]" />

      {/* Accent shapes */}
      <div className="absolute top-10 left-[10%] w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-[5%] w-80 h-80 bg-gradient-to-bl from-primary/12 to-blue-500/5 rounded-3xl blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <FadeIn className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 via-primary to-slate-900 bg-clip-text text-transparent mb-4">
            {t("home.insurancePartners")}
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
            {t("home.insurancePartnersDesc")}
          </p>
        </FadeIn>

        {/* Slider Container */}
        <div className="relative mb-12">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: isRTL ? -100 : 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRTL ? 100 : -100 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
              >
                {visiblePartners.map((partner) => (
                  <motion.div
                    key={partner.id}
                    whileHover={{ scale: 1.05 }}
                    className="bg-card rounded-xl p-4 shadow-card hover:shadow-medium transition-all duration-300 flex items-center justify-center aspect-[3/2] border border-border/50"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                        <span className="text-primary font-bold text-lg">
                          {partner.name.charAt(0)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium line-clamp-2">
                        {partner.name}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-primary/10 hover:bg-primary hover:text-white text-primary transition-all shadow-lg hover:shadow-xl"
              aria-label="Previous slide"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Slide Counter */}
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-600">
                {currentIndex + 1} / {totalPages}
              </p>
              <div className="flex gap-2 justify-center mt-2">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentIndex
                        ? "bg-primary w-8"
                        : "bg-primary/30 hover:bg-primary/50"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-primary/10 hover:bg-primary hover:text-white text-primary transition-all shadow-lg hover:shadow-xl"
              aria-label="Next slide"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <FadeIn className="text-center mt-10">
          <Link to="/insurance">
            <Button
              variant="ghost"
              size="lg"
              className="text-primary hover:bg-primary/10 hover:text-primary font-bold transition-all shadow-md hover:shadow-lg"
            >
              {t("clinics.learnMore")}
              <Arrow className="w-4 h-4" />
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
};
