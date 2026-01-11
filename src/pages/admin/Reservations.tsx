import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  AlertCircle,
  Mail,
  Phone,
  FileText,
  Building2,
  Stethoscope,
  X,
  Ban,
  CalendarClock,
  Archive,
  RotateCcw,
  Check,
  Eye,
  MoreVertical,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useAppointmentData } from "@/hooks/useAppointmentData";
import { useAppointmentFilters } from "@/hooks/useAppointmentFilters";
import { useAppointmentActions } from "@/hooks/useAppointmentActions";
import { useRescheduleState } from "@/hooks/useRescheduleState";
import { useUserRole } from "@/hooks/useUserRole";
import {
  getStatusBadgeConfig,
  formatDate,
  generateUpcomingDates,
  calculateStats,
} from "@/lib/appointmentUtils";

interface AdminReservationsProps {
  isStaffRoute?: boolean;
}

const AdminReservations = ({
  isStaffRoute = false,
}: AdminReservationsProps) => {
  const { role, permissions, updateRole, isAdmin, isStaff } = useUserRole();
  const {
    appointments,
    loading,
    error,
    setAppointments,
    getClinicName,
    getDoctorName,
    getServiceName,
  } = useAppointmentData();

  const filters = useAppointmentFilters(appointments);
  const {
    cancelAppointment,
    rescheduleAppointment,
    archiveAppointment,
    unarchiveAppointment,
    toggleArrivalStatus,
    cancelling,
    rescheduling,
    archiving,
  } = useAppointmentActions(setAppointments);

  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate paginated appointments
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAppointments = filters.filteredAppointments.slice(
    startIndex,
    endIndex
  );
  const totalPages = Math.ceil(
    filters.filteredAppointments.length / itemsPerPage
  );

  const selectedAppointment = appointments.find(
    (apt) => apt.id === selectedAppointmentId
  );

  // Allow arrival status changes only on the appointment date
  const isAppointmentToday = (() => {
    if (!selectedAppointment?.date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const aptDate = new Date(selectedAppointment.date);
    aptDate.setHours(0, 0, 0, 0);
    return aptDate.getTime() === today.getTime();
  })();

  const reschedule = useRescheduleState(selectedAppointment);
  const stats = calculateStats(appointments);

  const handleSelectAppointment = (appointmentId: number) => {
    setSelectedAppointmentId(appointmentId);
    setIsDrawerOpen(true);
  };

  const handleOpenCancelDialog = () => {
    setIsCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedAppointmentId) return;

    const success = await cancelAppointment(
      selectedAppointmentId,
      cancellationReason
    );

    if (success) {
      setIsCancelDialogOpen(false);
      setCancellationReason("");
      setIsDrawerOpen(false);
    }
  };

  const handleOpenArchiveDialog = () => {
    setIsArchiveDialogOpen(true);
  };

  const handleConfirmArchive = async () => {
    if (!selectedAppointmentId) return;

    const success = await archiveAppointment(selectedAppointmentId);

    if (success) {
      setIsArchiveDialogOpen(false);
      setIsDrawerOpen(false);
    }
  };

  const handleConfirmUnarchive = async () => {
    if (!selectedAppointmentId) return;

    const success = await unarchiveAppointment(selectedAppointmentId);

    if (success) {
      setIsDrawerOpen(false);
    }
  };

  const handleConfirmAppointment = async (appointmentId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3002/appointments/${appointmentId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "confirmed" }),
        }
      );

      if (response.ok) {
        const updatedAppointment = await response.json();
        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === appointmentId ? updatedAppointment : apt
          )
        );
      }
    } catch (error) {
      console.error("Error confirming appointment:", error);
    }
  };

  const handleUncancelAppointment = async (appointmentId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3002/appointments/${appointmentId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "confirmed" }),
        }
      );

      if (response.ok) {
        const updatedAppointment = await response.json();
        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === appointmentId ? updatedAppointment : apt
          )
        );
      }
    } catch (error) {
      console.error("Error restoring appointment:", error);
    }
  };

  const handleConfirmReschedule = async () => {
    if (!selectedAppointmentId) return;

    const success = await rescheduleAppointment(
      selectedAppointmentId,
      reschedule.selectedDate,
      reschedule.selectedTime,
      reschedule.note
    );

    if (success) {
      reschedule.cancelReschedule();
      setIsRescheduleDialogOpen(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    const config = getStatusBadgeConfig(status);
    return (
      <Badge
        variant={config.variant}
        className={`capitalize ${config.className ? config.className : ""}`}
      >
        {config.label}
      </Badge>
    );
  };

  const renderArrivalBadge = (arrived: boolean | null | undefined) => {
    if (arrived === null || arrived === undefined) {
      return (
        <Badge variant="outline" className="bg-gray-100 border-gray-300">
          Pending
        </Badge>
      );
    }
    if (arrived === true) {
      return (
        <Badge className="bg-green-600 hover:bg-green-700 text-white border-green-600">
          Arrived
        </Badge>
      );
    }
    return (
      <Badge
        variant="destructive"
        className="bg-red-600 hover:bg-red-700 border-red-600"
      >
        No-Show
      </Badge>
    );
  };

  return (
    <Layout>
      {/* Header Section */}
      <section className="pt-32 pb-10 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">
                Reservations Management
              </h1>
              <Badge
                variant="outline"
                className="text-primary-foreground border-primary-foreground/30"
              >
                {role === "admin" ? "Admin" : "Staff"}
              </Badge>
            </div>
            <p className="text-xl text-primary-foreground/80 mb-4"></p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto fill-background">
            <path d="M0,105L80,110.7C160,117,320,127,480,121C640,117,800,95,960,90C1120,85,1280,95,1360,100.7L1440,105L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Stats Summary */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">
                    Total Bookings
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.confirmed}
                  </div>
                  <p className="text-xs text-muted-foreground">Confirmed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-amber-600">
                    {stats.rescheduled}
                  </div>
                  <p className="text-xs text-muted-foreground">Rescheduled</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-red-600">
                    {stats.cancelled}
                  </div>
                  <p className="text-xs text-muted-foreground">Cancelled</p>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Tabs
                  value={filters.viewArchived ? "archived" : "active"}
                  onValueChange={(value) =>
                    filters.setViewArchived(value === "archived")
                  }
                  className="w-full max-w-xs"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="archived">Archived</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Badge variant="secondary" className="text-sm">
                  {filters.filteredAppointments.length} Total
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Error State */}
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {/* Filters Section */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by patient name, email, or phone..."
                    value={filters.searchQuery}
                    onChange={(e) => filters.setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={filters.statusFilter}
                  onValueChange={filters.setStatusFilter}
                >
                  <SelectTrigger className="w-full md:w-[200px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="rescheduled">Rescheduled</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.dateFilter}
                  onValueChange={filters.setDateFilter}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Next 7 Days</SelectItem>
                    <SelectItem value="month">Next 30 Days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Date Range */}
              {filters.dateFilter === "custom" && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1">
                    <Input
                      type="date"
                      value={filters.customDateFrom}
                      onChange={(e) =>
                        filters.setCustomDateFrom(e.target.value)
                      }
                      placeholder="From"
                      className="w-full"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="date"
                      value={filters.customDateTo}
                      onChange={(e) => filters.setCustomDateTo(e.target.value)}
                      placeholder="To"
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Active Filters Display */}
              {filters.hasActiveFilters && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">
                    Active filters:
                  </span>
                  {filters.searchQuery && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => filters.setSearchQuery("")}
                    >
                      Search: {filters.searchQuery}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}
                  {filters.statusFilter !== "all" && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => filters.setStatusFilter("all")}
                    >
                      Status: {filters.statusFilter}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}
                  {filters.dateFilter !== "all" && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => {
                        filters.setDateFilter("all");
                        filters.setCustomDateFrom("");
                        filters.setCustomDateTo("");
                      }}
                    >
                      Date: {filters.dateFilter}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={filters.clearAllFilters}
                    className="h-7 text-xs"
                  >
                    Clear All
                  </Button>
                </div>
              )}

              {/* Table Structure */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Patient
                        </div>
                      </TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Clinic</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Date
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Time
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Arrival</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      // Loading skeletons
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Skeleton className="h-4 w-12" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-28" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-20" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-16" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-6 w-20" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : filters.filteredAppointments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-64 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground py-8">
                            {appointments.length === 0 ? (
                              <>
                                <Calendar className="w-16 h-16 mb-4 opacity-10" />
                                <p className="text-lg font-medium mb-2">
                                  No bookings yet
                                </p>
                                <p className="text-sm max-w-sm">
                                  Reservations will appear here once patients
                                  start booking appointments through the system.
                                </p>
                              </>
                            ) : (
                              <>
                                <Search className="w-16 h-16 mb-4 opacity-10" />
                                <p className="text-lg font-medium mb-2">
                                  No matching reservations
                                </p>
                                <p className="text-sm max-w-sm mb-4">
                                  Try adjusting your search query or filters to
                                  find what you're looking for.
                                </p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={filters.clearAllFilters}
                                >
                                  Clear All Filters
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedAppointments.map((apt) => (
                        <TableRow
                          key={apt.id}
                          className={cn(
                            "cursor-pointer hover:bg-muted/50 transition-colors",
                            selectedAppointmentId === apt.id && "bg-muted"
                          )}
                          onClick={() => handleSelectAppointment(apt.id)}
                        >
                          <TableCell className="font-medium">
                            #{apt.id}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {apt.patientName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {apt.patientPhone || "N/A"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getDoctorName(apt.doctorId)}</TableCell>
                          <TableCell>{getClinicName(apt.clinicId)}</TableCell>
                          <TableCell>{formatDate(apt.date)}</TableCell>
                          <TableCell>{apt.startTime}</TableCell>
                          <TableCell>{renderStatusBadge(apt.status)}</TableCell>
                          <TableCell>
                            {renderArrivalBadge(apt.arrived)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filters.filteredAppointments.length)} of{" "}
                  {filters.filteredAppointments.length} reservations
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-3 text-sm">
                    Page {currentPage} of {totalPages || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Booking Details Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {!selectedAppointment ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Skeleton className="h-8 w-32 mx-auto mb-4" />
                <Skeleton className="h-4 w-48 mx-auto mb-8" />
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-40 w-full" />
                </div>
              </div>
            </div>
          ) : (
            <>
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <SheetTitle>Booking Details</SheetTitle>
                  <div className="flex items-center gap-2">
                    {isStaff && (
                      <Badge variant="outline" className="text-xs">
                        Read-only
                      </Badge>
                    )}
                    <Badge variant="secondary">#{selectedAppointment.id}</Badge>
                  </div>
                </div>
                <SheetDescription>
                  View complete reservation information
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Status */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Status
                  </h3>
                  {renderStatusBadge(selectedAppointment.status)}
                </div>

                <Separator />

                {/* Patient Information */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Patient Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Full Name
                        </p>
                        <p className="font-medium">
                          {selectedAppointment.patientName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">
                          {selectedAppointment.patientEmail}
                        </p>
                      </div>
                    </div>
                    {selectedAppointment.patientPhone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">
                            {selectedAppointment.patientPhone}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Booking Information */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Booking Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Clinic</p>
                        <p className="font-medium">
                          {getClinicName(selectedAppointment.clinicId)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Stethoscope className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Doctor</p>
                        <p className="font-medium">
                          {getDoctorName(selectedAppointment.doctorId)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">
                          {formatDate(selectedAppointment.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium">
                          {selectedAppointment.startTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedAppointment.notes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Notes
                      </h3>
                      <p className="text-sm bg-muted p-3 rounded-lg">
                        {selectedAppointment.notes}
                      </p>
                    </div>
                  </>
                )}

                {/* Created At */}
                {selectedAppointment.createdAt && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Booked On
                      </h3>
                      <p className="text-sm">
                        {new Date(
                          selectedAppointment.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Reschedule Section */}
              {reschedule.isRescheduling && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">
                      Reschedule Booking
                    </h3>

                    {/* Date Selection */}
                    <div className="mb-4">
                      <label className="text-sm font-medium mb-2 block">
                        Select New Date
                      </label>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {generateUpcomingDates().map((d) => (
                          <button
                            key={d.value}
                            onClick={() => reschedule.handleDateChange(d.value)}
                            className={cn(
                              "flex flex-col items-center p-2 rounded-lg border-2 min-w-[70px] transition-all",
                              reschedule.selectedDate === d.value
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <span className="text-xs text-muted-foreground">
                              {d.day}
                            </span>
                            <span className="text-xl font-bold">{d.date}</span>
                            <span className="text-xs text-muted-foreground">
                              {d.month}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Selection */}
                    {reschedule.selectedDate && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Select New Time
                        </label>
                        {reschedule.loadingSlots ? (
                          <div className="grid grid-cols-3 gap-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                              <Skeleton key={i} className="h-10 w-full" />
                            ))}
                          </div>
                        ) : reschedule.availableSlots.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No available slots for this date
                          </p>
                        ) : (
                          <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                            {reschedule.availableSlots.map((time) => (
                              <button
                                key={time}
                                onClick={() => reschedule.setSelectedTime(time)}
                                className={cn(
                                  "py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all",
                                  reschedule.selectedTime === time
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border hover:border-primary/50"
                                )}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Reschedule Actions */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={reschedule.cancelReschedule}
                        disabled={rescheduling}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => setIsRescheduleDialogOpen(true)}
                        disabled={
                          !reschedule.canConfirmReschedule || rescheduling
                        }
                      >
                        {rescheduling ? "Saving..." : "Confirm Reschedule"}
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Actions */}
              {!reschedule.isRescheduling && (
                <div className="mt-6 pt-6 border-t space-y-2">
                  {/* Arrival Status Toggle */}
                  {(selectedAppointment.status === "confirmed" ||
                    selectedAppointment.status === "rescheduled") && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Arrival Status</div>
                      <div className="flex gap-2">
                        <Button
                          variant={
                            selectedAppointment.arrived === null
                              ? "outline"
                              : "outline"
                          }
                          className={cn(
                            "flex-1",
                            selectedAppointment.arrived === null
                              ? "bg-gray-100 border-gray-300"
                              : ""
                          )}
                          disabled={true}
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Pending
                        </Button>
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              {/* Wrap disabled button in a span so tooltip can trigger */}
                              <span className="flex-1">
                                <Button
                                  variant={
                                    selectedAppointment.arrived === true
                                      ? "default"
                                      : "outline"
                                  }
                                  className={cn(
                                    "w-full",
                                    selectedAppointment.arrived === true
                                      ? "bg-green-600 hover:bg-green-700 border-green-600"
                                      : ""
                                  )}
                                  disabled={!isAppointmentToday}
                                  onClick={() =>
                                    toggleArrivalStatus(
                                      selectedAppointment.id,
                                      true,
                                      selectedAppointment.date
                                    )
                                  }
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  Arrived
                                </Button>
                              </span>
                            </TooltipTrigger>
                            {!isAppointmentToday && (
                              <TooltipContent side="top">
                                Arrival status can be changed only on the
                                appointment day.
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              {/* Wrap disabled button in a span so tooltip can trigger */}
                              <span className="flex-1">
                                <Button
                                  variant={
                                    selectedAppointment.arrived === false
                                      ? "destructive"
                                      : "outline"
                                  }
                                  className={cn(
                                    "w-full",
                                    selectedAppointment.arrived === false
                                      ? "bg-red-600 hover:bg-red-700 border-red-600"
                                      : ""
                                  )}
                                  disabled={!isAppointmentToday}
                                  onClick={() =>
                                    toggleArrivalStatus(
                                      selectedAppointment.id,
                                      false,
                                      selectedAppointment.date
                                    )
                                  }
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  No-Show
                                </Button>
                              </span>
                            </TooltipTrigger>
                            {!isAppointmentToday && (
                              <TooltipContent side="top">
                                Arrival status can be changed only on the
                                appointment day.
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      {!isAppointmentToday && (
                        <p className="text-xs text-muted-foreground">
                          Arrival status can be changed only on the appointment
                          day.
                        </p>
                      )}
                    </div>
                  )}

                  {selectedAppointment.status !== "cancelled" && (
                    <>
                      {permissions.canReschedule && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={reschedule.startReschedule}
                        >
                          <CalendarClock className="w-4 h-4 mr-2" />
                          Reschedule Booking
                        </Button>
                      )}
                      {permissions.canCancel && (
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={handleOpenCancelDialog}
                        >
                          <Ban className="w-4 h-4 mr-2" />
                          Cancel Booking
                        </Button>
                      )}
                      {isStaff && (
                        <div className="text-sm text-muted-foreground text-center py-2">
                          Staff members can view but not modify bookings
                        </div>
                      )}
                    </>
                  )}
                  {selectedAppointment.status === "cancelled" &&
                    !selectedAppointment.archived &&
                    permissions.canArchive && (
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={handleOpenArchiveDialog}
                      >
                        <Archive className="w-4 h-4 mr-2" />
                        Archive Booking
                      </Button>
                    )}
                  {selectedAppointment.archived && permissions.canUnarchive && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleConfirmUnarchive}
                      disabled={archiving}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      {archiving ? "Restoring..." : "Restore Booking"}
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Reschedule Confirmation Dialog */}
      <AlertDialog
        open={isRescheduleDialogOpen}
        onOpenChange={setIsRescheduleDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reschedule Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This will update the appointment date/time and mark it as
              rescheduled. Please confirm before saving.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">New Date</span>
              <span className="font-semibold">
                {formatDate(reschedule.selectedDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">New Time</span>
              <span className="font-semibold">{reschedule.selectedTime}</span>
            </div>
            {reschedule.note && (
              <div>
                <p className="text-muted-foreground mb-1">Note</p>
                <p className="text-foreground">{reschedule.note}</p>
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setIsRescheduleDialogOpen(false)}
              disabled={rescheduling}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmReschedule}
              disabled={rescheduling}
              className="bg-primary hover:bg-primary/90"
            >
              {rescheduling ? "Saving..." : "Confirm Reschedule"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancellation Confirmation Dialog */}
      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the booking as cancelled. You can reactivate it
              later if needed. The patient should be notified separately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <label className="text-sm font-medium mb-2 block">
              Cancellation Reason (Optional)
            </label>
            <Textarea
              placeholder="e.g., Patient requested cancellation, Doctor unavailable..."
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={cancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelling ? "Cancelling..." : "Confirm Cancellation"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Archive Confirmation Dialog */}
      <AlertDialog
        open={isArchiveDialogOpen}
        onOpenChange={setIsArchiveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This cancelled booking will be moved to the archived section. You
              can restore it anytime from the Archived tab.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={archiving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmArchive}
              disabled={archiving}
              className="bg-primary hover:bg-primary/90"
            >
              {archiving ? "Archiving..." : "Archive Booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default AdminReservations;
