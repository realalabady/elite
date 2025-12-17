import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Home, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <section className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 gradient-soft" />
        <div className="absolute inset-0 pattern-dots opacity-30" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative z-10 px-4"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8"
          >
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Stethoscope className="w-16 h-16 text-primary" />
            </div>
          </motion.div>

          <h1 className="font-display text-8xl md:text-9xl font-bold text-primary mb-4">
            {t("notFound.title")}
          </h1>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
            {t("notFound.subtitle")}
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            {t("notFound.description")}
          </p>

          <Link to="/">
            <Button variant="hero" size="xl">
              <Home className="w-5 h-5" />
              {t("notFound.goHome")}
            </Button>
          </Link>
        </motion.div>
      </section>
    </Layout>
  );
};

export default NotFound;
