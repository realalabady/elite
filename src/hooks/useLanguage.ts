import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language;
  const isRTL = currentLanguage === "ar";

  const toggleLanguage = () => {
    const newLang = currentLanguage === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

  const setLanguage = (lang: "en" | "ar") => {
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = currentLanguage;
  }, [isRTL, currentLanguage]);

  return {
    currentLanguage,
    isRTL,
    toggleLanguage,
    setLanguage,
  };
};
