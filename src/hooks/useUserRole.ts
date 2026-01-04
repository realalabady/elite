import { useState, useEffect } from "react";

export type UserRole = "admin" | "staff";

export interface UserPermissions {
  canCancel: boolean;
  canReschedule: boolean;
  canArchive: boolean;
  canUnarchive: boolean;
  canViewArchived: boolean;
}

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>(() => {
    // Get role from localStorage or session
    const stored = localStorage.getItem("userRole");
    return (stored as UserRole) || "admin";
  });

  const permissions: UserPermissions = {
    canCancel: role === "admin",
    canReschedule: role === "admin",
    canArchive: role === "admin",
    canUnarchive: role === "admin",
    canViewArchived: true, // Both can view archived
  };

  const updateRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem("userRole", newRole);
  };

  return {
    role,
    permissions,
    updateRole,
    isAdmin: role === "admin",
    isStaff: role === "staff",
  };
};
