import { Layout } from "@/components/layout/Layout";
import { Hero } from "@/components/home/Hero";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { SpecialtiesPreview } from "@/components/home/SpecialtiesPreview";
import { DoctorsPreview } from "@/components/home/DoctorsPreview";
import { InsurancePreview } from "@/components/home/InsurancePreview";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <WhyChooseUs />
      <SpecialtiesPreview />
      <DoctorsPreview />
      <InsurancePreview />
      <CTASection />
    </Layout>
  );
};

export default Index;
