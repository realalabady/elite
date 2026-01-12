import { useState, useMemo } from "react";
import { Appointment } from "@/services/api";

export const useAppointmentFilters = (appointments: Appointment[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [customDateFrom, setCustomDateFrom] = useState("");
  const [customDateTo, setCustomDateTo] = useState("");
  const [viewArchived, setViewArchived] = useState(false);

  const matchesDateFilter = (aptDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (dateFilter) {
      case "today":
        return aptDate.toDateString() === today.toDateString();
      case "week": {
        const weekFromNow = new Date(today);
        weekFromNow.setDate(today.getDate() + 7);
        return aptDate >= today && aptDate <= weekFromNow;
      }
      case "month": {
        const monthFromNow = new Date(today);
        monthFromNow.setMonth(today.getMonth() + 1);
        return aptDate >= today && aptDate <= monthFromNow;
      }
      case "custom":
        if (customDateFrom && customDateTo) {
          const fromDate = new Date(customDateFrom);
          const toDate = new Date(customDateTo);
          toDate.setHours(23, 59, 59, 999);
          return aptDate >= fromDate && aptDate <= toDate;
        }
        return true;
      default:
        return true;
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((apt) => {
        const matchesArchived = viewArchived
          ? apt.archived === true
          : apt.archived !== true;

        const matchesSearch =
          searchQuery === "" ||
          apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.patientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.patientPhone?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || apt.status === statusFilter;

        const matchesDate = matchesDateFilter(new Date(apt.date));

        return matchesArchived && matchesSearch && matchesStatus && matchesDate;
      })
      .sort((a, b) => {
        // Sort by ID in descending order (newest first)
        return (b.id || 0) - (a.id || 0);
      });
  }, [
    appointments,
    searchQuery,
    statusFilter,
    dateFilter,
    customDateFrom,
    customDateTo,
    viewArchived,
  ]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFilter("all");
    setCustomDateFrom("");
    setCustomDateTo("");
  };

  const hasActiveFilters =
    searchQuery !== "" || statusFilter !== "all" || dateFilter !== "all";

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    dateFilter,
    viewArchived,
    setViewArchived,
    setDateFilter,
    customDateFrom,
    setCustomDateFrom,
    customDateTo,
    setCustomDateTo,
    filteredAppointments,
    clearAllFilters,
    hasActiveFilters,
  };
};
