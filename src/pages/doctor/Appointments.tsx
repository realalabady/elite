import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Search,
  AlertCircle,
  User,
  Clock,
  Phone,
  Mail,
} from "lucide-react";
import { useAppointmentData } from "@/hooks/useAppointmentData";
import { useAuth } from "@/contexts/AuthContext";
import {
  getStatusBadgeConfig,
  formatDate,
  calculateStats,
} from "@/lib/appointmentUtils";

const DoctorAppointments = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const {
    appointments,
    loading,
    error,
    doctors,
    getClinicName,
    getServiceName,
  } = useAppointmentData();

  // Get doctor ID from URL param or from authenticated user
  const activeDoctorId = doctorId ? parseInt(doctorId) : user?.doctorId;

  // Find the doctor info
  const doctor = doctors.find((d) => d.id === activeDoctorId);

  // Filter appointments by doctor
  const doctorAppointments = useMemo(() => {
    return appointments.filter(
      (apt) => apt.doctorId === activeDoctorId && !apt.archived
    );
  }, [appointments, activeDoctorId]);

  // Apply filters
  const filteredAppointments = useMemo(() => {
    return doctorAppointments.filter((apt) => {
      const matchesSearch =
        apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patientPhone.includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || apt.status === statusFilter;

      const matchesDate = (() => {
        if (dateFilter === "all") return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const aptDate = new Date(apt.date);
        aptDate.setHours(0, 0, 0, 0);

        if (dateFilter === "today") {
          return aptDate.getTime() === today.getTime();
        } else if (dateFilter === "upcoming") {
          return aptDate.getTime() >= today.getTime();
        } else if (dateFilter === "past") {
          return aptDate.getTime() < today.getTime();
        }
        return true;
      })();

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [doctorAppointments, searchTerm, statusFilter, dateFilter]);

  // Categorize appointments
  const upcomingAppointments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return filteredAppointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      aptDate.setHours(0, 0, 0, 0);
      return aptDate.getTime() >= today.getTime() && apt.status === "confirmed";
    });
  }, [filteredAppointments]);

  const bookedAppointments = useMemo(() => {
    return filteredAppointments.filter((apt) => apt.status === "confirmed");
  }, [filteredAppointments]);

  const canceledAppointments = useMemo(() => {
    return filteredAppointments.filter((apt) => apt.status === "cancelled");
  }, [filteredAppointments]);

  const stats = calculateStats(doctorAppointments);

  const renderStatusBadge = (status: string) => {
    const config = getStatusBadgeConfig(status);
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.icon}
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

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  if (!doctor) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Doctor not found</AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header Section */}
      <section className="pt-32 pb-10 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              My Appointments
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-2">
              Dr. {doctor.name}
            </p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {doctorAppointments.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total Appointments
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">
                  {upcomingAppointments.length}
                </div>
                <p className="text-xs text-muted-foreground">Upcoming</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  {bookedAppointments.length}
                </div>
                <p className="text-xs text-muted-foreground">Booked</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-red-600">
                  {canceledAppointments.length}
                </div>
                <p className="text-xs text-muted-foreground">Canceled</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filter Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by patient name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Appointments Table */}
          <AppointmentsTable
            appointments={filteredAppointments}
            getClinicName={getClinicName}
            getServiceName={getServiceName}
            renderStatusBadge={renderStatusBadge}
            renderArrivalBadge={renderArrivalBadge}
          />
        </div>
      </section>
    </Layout>
  );
};

// Appointments Table Component
const AppointmentsTable = ({
  appointments,
  getServiceName,
  renderStatusBadge,
  renderArrivalBadge,
}: any) => {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No appointments found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((apt: any) => (
              <TableRow key={apt.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{apt.patientName}</div>
                      <div className="text-xs text-muted-foreground">
                        ID: #{apt.id}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{formatDate(apt.date)}</div>
                      <div className="text-xs text-muted-foreground">
                        {apt.startTime}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{renderStatusBadge(apt.status)}</TableCell>
                <TableCell>{renderArrivalBadge(apt.arrived)}</TableCell>
                <TableCell>
                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {apt.patientPhone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {apt.patientEmail}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DoctorAppointments;
