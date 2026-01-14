import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, Phone, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const navLinks = [
  { path: "/", key: "nav.home" },
  { path: "/about", key: "nav.about" },
  { path: "/doctors", key: "nav.doctors" },
  { path: "/clinics", key: "nav.clinics" },
  { path: "/insurance", key: "nav.insurance" },
  { path: "/careers", key: "nav.careers" },
  { path: "/contact", key: "nav.contact" },
];

export const Navbar = () => {
  const { t } = useTranslation();
  const { currentLanguage, toggleLanguage, isRTL } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    // Only navigate to home if we're on a protected route
    const publicPaths = [
      "/",
      "/about",
      "/doctors",
      "/clinics",
      "/insurance",
      "/booking",
      "/careers",
      "/contact",
    ];
    if (!publicPaths.includes(location.pathname)) {
      navigate("/");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-white shadow-lg border-b border-primary/10"
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-20 gap-8">
            {/* Logo */}
            {/* <Link to="/" className="flex items-center shrink-0">
              <img
                src={logo}
                alt="Elite Specialist Clinics"
                className="h-14 w-auto"
              />
            </Link> */}

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 justify-center">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-sm font-medium transition-all duration-200 py-2",
                    location.pathname === link.path
                      ? "text-primary border-b-2 border-primary"
                      : "text-foreground/70 hover:text-primary"
                  )}
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3 shrink-0 justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="hidden sm:flex items-center gap-2 text-foreground/70 hover:text-primary h-9 px-3"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm">
                  {currentLanguage === "en" ? "عربي" : "EN"}
                </span>
              </Button>

              {isAuthenticated && user && (
                <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium leading-none">
                        {user.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground capitalize">
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="h-8 px-2 text-foreground/70 hover:text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-1" />
                    <span className="text-xs">Logout</span>
                  </Button>
                </div>
              )}

              {!isAuthenticated && (
                <Link to="/booking" className="hidden lg:block">
                  <Button size="default" className="h-9">
                    <Phone className="w-4 h-4" />
                    {t("nav.booking")}
                  </Button>
                </Link>
              )}

              <Button
                variant="outline"
                size="icon"
                className="lg:hidden w-10 h-10 flex items-center justify-center border-primary/30 text-primary"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: isRTL ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? "-100%" : "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={cn(
                "fixed top-0 bottom-0 w-80 bg-background z-50 shadow-medium lg:hidden",
                isRTL ? "left-0" : "right-0"
              )}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  {/* <img src={logo} alt="Elite Clinics" className="h-10 w-auto" /> */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={cn(
                        "block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200",
                        location.pathname === link.path
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {t(link.key)}
                    </Link>
                  ))}
                </nav>

                <div className="p-4 space-y-3 border-t border-border">
                  {isAuthenticated && user && (
                    <div className="mb-3 p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4" />
                        <span className="font-medium text-sm">{user.name}</span>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </Button>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={toggleLanguage}
                  >
                    <Globe className="w-4 h-4" />
                    {currentLanguage === "en" ? "عربي" : "English"}
                  </Button>
                  <Link to="/booking" className="block">
                    <Button variant="hero" className="w-full">
                      <Phone className="w-4 h-4" />
                      {t("nav.booking")}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
