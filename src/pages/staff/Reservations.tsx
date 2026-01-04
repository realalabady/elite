import { useEffect } from "react";
import AdminReservations from "../admin/Reservations";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Staff Reservations Page
 *
 * This is a wrapper around the AdminReservations component that automatically
 * sets the user role to "staff" when accessing via the /staff/reservations route.
 * Staff members have read-only access to view bookings but cannot modify them.
 */
const StaffReservations = () => {
  const { updateRole } = useUserRole();
  const { user } = useAuth();

  // Automatically set role to staff when this route is accessed
  // This syncs with the authenticated user's role
  useEffect(() => {
    if (user?.role === "staff") {
      updateRole("staff");
    }
  }, [updateRole, user]);

  // Render the same reservations component, but role is now locked to "staff"
  return <AdminReservations isStaffRoute />;
};

export default StaffReservations;
