import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClinicCard } from "@/components/cards/ClinicCard";
import { FadeIn } from "@/components/animations/FadeIn";
import { clinics } from "@/data/clinics";
import { useLanguage } from "@/hooks/useLanguage";
import { motion, AnimatePresence } from "framer-motion";

export const SpecialtiesPreview = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 1024 ? 2 : 3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(clinics.length / itemsPerPage);

  const visibleClinics = clinics.slice(
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
    <section className="py-20 relative bg-gradient-to-b from-white via-primary/5 to-white overflow-hidden">
      {/* Decorative grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e910_2px,transparent_2px),linear-gradient(to_bottom,#0ea5e910_2px,transparent_2px)] bg-[size:80px_80px]" />

      {/* Accent shapes */}
      <div className="absolute top-20 left-[5%] w-64 h-64 bg-gradient-to-br from-primary/15 to-transparent rounded-3xl blur-3xl" />
      <div className="absolute bottom-20 right-[8%] w-80 h-80 bg-gradient-to-br from-blue-500/10 to-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <FadeIn className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 via-primary to-slate-900 bg-clip-text text-transparent mb-4">
            {t("home.ourSpecialties")}
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
            {t("home.ourSpecialtiesDesc")}
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {visibleClinics.map((clinic) => (
                  <motion.div
                    key={clinic.id}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ClinicCard clinic={clinic} />
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

        <FadeIn className="text-center">
          <Link to="/clinics">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-lg hover:shadow-xl transition-all"
            >
              {t("home.viewAll")}
              <Arrow className="w-4 h-4" />
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
};
