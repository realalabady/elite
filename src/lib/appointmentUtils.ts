import { Appointment } from "@/services/api";

export const getStatusBadgeConfig = (status: string) => {
  const statusConfig = {
    confirmed: { variant: "default" as const, label: "Confirmed" },
    pending: { variant: "secondary" as const, label: "Pending" },
    cancelled: { variant: "destructive" as const, label: "Cancelled" },
    completed: { variant: "outline" as const, label: "Completed" },
  };

  return (
    statusConfig[status as keyof typeof statusConfig] || {
      variant: "secondary" as const,
      label: status,
    }
  );
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const generateUpcomingDates = (days: number = 14) => {
  const dates = [];
  for (let i = 1; i <= days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push({
      value: date.toISOString().split("T")[0],
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
    });
  }
  return dates;
};

export const calculateStats = (appointments: Appointment[]) => {
  return {
    total: appointments.length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    pending: appointments.filter((a) => a.status === "pending").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };
};
