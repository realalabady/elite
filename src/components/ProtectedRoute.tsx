import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "staff" | "doctor";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Prevent back button access after logout
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      // Clear browser history state to prevent back button access
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", () => {
        window.history.pushState(null, "", window.location.href);
      });
    }
  }, [isAuthenticated, isLoading]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-8 w-48" />
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate page based on user's actual role
    if (user?.role === "admin") {
      return <Navigate to="/admin/reservations" replace />;
    } else if (user?.role === "staff") {
      return <Navigate to="/staff/reservations" replace />;
    } else if (user?.role === "doctor") {
      return <Navigate to="/doctor/appointments" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
