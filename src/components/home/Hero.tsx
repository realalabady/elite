import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Phone,
  Award,
  Users,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { BackgroundSlider } from "./BackgroundSlider";

export const Hero = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const stats = [
    {
      icon: Award,
      value: "20+",
      label: isRTL ? "سنوات خبرة" : "Years Experience",
    },
    {
      icon: Users,
      value: "50K+",
      label: isRTL ? "مريض سعيد" : "Happy Patients",
    },
    {
      icon: Clock,
      value: "24/7",
      label: isRTL ? "دعم طبي" : "Medical Support",
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <BackgroundSlider />

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-slate-900 via-primary to-slate-900 bg-clip-text text-transparent mb-6 leading-tight"
          >
            {t("hero.title")}
          </motion.h1>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="text-center bg-gradient-to-br from-white to-primary/5 backdrop-blur-sm rounded-2xl p-8 border-2 border-primary/20 shadow-xl hover:shadow-2xl hover:border-primary/40 transition-all"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 font-semibold uppercase tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
