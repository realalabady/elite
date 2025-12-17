import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { DoctorCard } from "@/components/cards/DoctorCard";
import { FadeIn } from "@/components/animations/FadeIn";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/StaggerContainer";
import { Input } from "@/components/ui/input";
import { doctors } from "@/data/doctors";
import { clinics } from "@/data/clinics";
import { useLanguage } from "@/hooks/useLanguage";

const Doctors = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const lang = currentLanguage as "en" | "ar";
  const [search, setSearch] = useState("");
  const [selectedClinic, setSelectedClinic] = useState<string>("all");

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name[lang].toLowerCase().includes(search.toLowerCase()) ||
      doctor.specialty[lang].toLowerCase().includes(search.toLowerCase());
    const matchesClinic =
      selectedClinic === "all" || doctor.clinicId === selectedClinic;
    return matchesSearch && matchesClinic;
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              {t("doctors.title")}
            </h1>
            <p className="text-xl text-primary-foreground/80">
              {t("doctors.subtitle")}
            </p>
          </FadeIn>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto fill-background">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={
                  lang === "ar" ? "ابحث عن طبيب..." : "Search doctors..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedClinic("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedClinic === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {lang === "ar" ? "الكل" : "All"}
              </button>
              {clinics.slice(0, 5).map((clinic) => (
                <button
                  key={clinic.id}
                  onClick={() => setSelectedClinic(clinic.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedClinic === clinic.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {clinic.name[lang]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredDoctors.length > 0 ? (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredDoctors.map((doctor) => (
                <StaggerItem key={doctor.id}>
                  <DoctorCard doctor={doctor} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {lang === "ar" ? "لم يتم العثور على أطباء" : "No doctors found"}
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Doctors;
