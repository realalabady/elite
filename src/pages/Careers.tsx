import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Briefcase, TrendingUp, Users, Check, Upload } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FadeIn } from "@/components/animations/FadeIn";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/StaggerContainer";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "@/hooks/use-toast";

const Careers = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const lang = currentLanguage as "en" | "ar";
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    coverLetter: "",
  });

  const benefits = [
    {
      icon: Briefcase,
      title: t("careers.benefit1"),
      desc: t("careers.benefit1Desc"),
    },
    {
      icon: TrendingUp,
      title: t("careers.benefit2"),
      desc: t("careers.benefit2Desc"),
    },
    {
      icon: Users,
      title: t("careers.benefit3"),
      desc: t("careers.benefit3Desc"),
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    toast({
      title: t("careers.applicationSuccess"),
      description: t("careers.applicationSuccessMsg"),
    });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              {t("careers.title")}
            </h1>
            <p className="text-xl text-primary-foreground/80">
              {t("careers.subtitle")}
            </p>
          </FadeIn>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto fill-background">
            <path d="M0,105L80,110.7C160,117,320,127,480,121C640,117,800,95,960,90C1120,85,1280,95,1360,100.7L1440,105L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <FadeIn className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("careers.whyJoin")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("careers.whyJoinDesc")}
            </p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, idx) => (
              <StaggerItem key={idx}>
                <div className="text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <benefit.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {benefit.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 gradient-soft">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <FadeIn className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                {t("careers.applyTitle")}
              </h2>
              <p className="text-muted-foreground">{t("careers.applyDesc")}</p>
            </FadeIn>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                  {t("careers.applicationSuccess")}
                </h3>
                <p className="text-muted-foreground">
                  {t("careers.applicationSuccessMsg")}
                </p>
              </motion.div>
            ) : (
              <FadeIn>
                <form
                  onSubmit={handleSubmit}
                  className="bg-card rounded-2xl p-8 shadow-card"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("careers.fullName")}
                      </label>
                      <Input
                        required
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("careers.email")}
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("careers.phone")}
                      </label>
                      <Input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("careers.position")}
                      </label>
                      <Input
                        required
                        value={formData.position}
                        onChange={(e) =>
                          setFormData({ ...formData, position: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("careers.experience")}
                      </label>
                      <Input
                        type="number"
                        min="0"
                        required
                        value={formData.experience}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            experience: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("careers.uploadCV")}
                      </label>
                      <div className="relative">
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          id="cv-upload"
                        />
                        <label
                          htmlFor="cv-upload"
                          className="flex items-center justify-center gap-2 h-10 px-4 border border-input rounded-lg cursor-pointer hover:bg-accent transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          <span className="text-sm">
                            {lang === "ar" ? "اختر ملف" : "Choose file"}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      {t("careers.coverLetter")}
                    </label>
                    <Textarea
                      rows={4}
                      value={formData.coverLetter}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coverLetter: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                  >
                    {t("careers.submit")}
                  </Button>
                </form>
              </FadeIn>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Careers;
