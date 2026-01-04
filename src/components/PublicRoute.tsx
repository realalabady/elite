import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [shouldRenderContent, setShouldRenderContent] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if user is trying to access a public page
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
      const isPublicPath = publicPaths.includes(location.pathname);

      if (isPublicPath) {
        setShowLogoutDialog(true);
        setShouldRenderContent(false);
      } else {
        setShouldRenderContent(true);
      }
    } else {
      setShouldRenderContent(true);
    }
  }, [isAuthenticated, user, location.pathname]);

  const handleLogout = () => {
    const currentPath = location.pathname;
    logout();
    setShowLogoutDialog(false);
    setShouldRenderContent(true);
    // Stay on the current public page after logout
    setTimeout(() => {
      if (location.pathname !== currentPath) {
        navigate(currentPath, { replace: true });
      }
    }, 0);
  };

  const handleStay = () => {
    setShowLogoutDialog(false);
    // Redirect to their dashboard
    if (user?.role === "admin") {
      navigate("/admin/reservations", { replace: true });
    } else if (user?.role === "staff") {
      navigate("/staff/reservations", { replace: true });
    } else if (user?.role === "doctor") {
      navigate("/doctor/appointments", { replace: true });
    }
  };

  return (
    <>
      {shouldRenderContent ? children : null}
      <AlertDialog
        open={showLogoutDialog}
        onOpenChange={(open) => {
          if (!open) {
            handleStay();
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You are currently logged in</AlertDialogTitle>
            <AlertDialogDescription>
              You're logged in as <strong>{user?.name}</strong> ({user?.role}).
              To access public pages, you need to log out. Do you want to log
              out now?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleStay}>
              Stay Logged In
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PublicRoute;
