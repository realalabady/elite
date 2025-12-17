import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Facebook,
  Twitter,
  Instagram,
  MapPin,
  Phone,
  Clock,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export const Footer = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const quickLinks = [
    { path: "/", label: t("nav.home") },
    { path: "/about", label: t("nav.about") },
    { path: "/doctors", label: t("nav.doctors") },
    { path: "/clinics", label: t("nav.clinics") },
    { path: "/insurance", label: t("nav.insurance") },
    { path: "/booking", label: t("nav.booking") },
    { path: "/careers", label: t("nav.careers") },
    { path: "/contact", label: t("nav.contact") },
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">
                  E
                </span>
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">
                  {isRTL ? "عيادات النخبة" : "Elite Clinics"}
                </h3>
                <p className="text-xs text-background/60">
                  {isRTL ? "التخصصية" : "Specialist"}
                </p>
              </div>
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">
              {t("footer.quickLinks")}
            </h4>
            <nav className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-background/70 hover:text-primary transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">
              {t("footer.contactInfo")}
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-background/70">
                  {t("contact.addressValue")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <p className="text-sm text-background/70" dir="ltr">
                  (013) 8940004
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div className="text-sm text-background/70 whitespace-pre-line">
                  {t("contact.hoursValue")}
                </div>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">
              {t("footer.followUs")}
            </h4>
            <div className="flex gap-3">
              <a
                href="https://facebook.com/EliteClinics"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/EliteClinics"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 text-center">
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} Elite Specialist Clinics.{" "}
            {t("footer.rights")}.
          </p>
        </div>
      </div>
    </footer>
  );
};
