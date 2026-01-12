import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, CreditCard, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Payment {
  id: number;
  appointmentId: number;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  createdAt: string;
  note?: string;
}

interface Appointment {
  id: number;
  patientName: string;
  patientEmail: string;
  date: string;
  startTime: string;
  clinicId: number;
}

interface Clinic {
  id: number;
  name: string;
}

export const AdminPayments: React.FC = () => {
  const { t } = useTranslation();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [paymentsRes, appointmentsRes, clinicsRes] = await Promise.all([
        fetch("http://localhost:3003/payments"),
        fetch("http://localhost:3003/appointments"),
        fetch("http://localhost:3003/clinics"),
      ]);

      if (!paymentsRes.ok || !appointmentsRes.ok || !clinicsRes.ok) {
        throw new Error("Failed to load data");
      }

      const paymentsData = await paymentsRes.json();
      const appointmentsData = await appointmentsRes.json();
      const clinicsData = await clinicsRes.json();

      setPayments(paymentsData || []);
      setAppointments(appointmentsData || []);
      setClinics(clinicsData || []);
      setFilteredPayments(paymentsData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = payments;

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.paymentStatus === statusFilter);
    }

    // Method filter
    if (methodFilter !== "all") {
      filtered = filtered.filter((p) => p.paymentMethod === methodFilter);
    }

    // Search by transaction ID or appointment ID
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.appointmentId.toString().includes(searchTerm)
      );
    }

    // Date range filter
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      filtered = filtered.filter((p) => new Date(p.createdAt) >= fromDate);
    }

    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      toDate.setDate(toDate.getDate() + 1);
      filtered = filtered.filter((p) => new Date(p.createdAt) < toDate);
    }

    setFilteredPayments(filtered);
    setCurrentPage(1);
  }, [payments, statusFilter, methodFilter, searchTerm, dateRange]);

  // Calculate stats
  const stats = {
    total: payments.reduce((sum, p) => sum + p.amount, 0),
    paid: payments.filter((p) => p.paymentStatus === "paid").length,
    pending: payments.filter((p) => p.paymentStatus === "pending").length,
    failed: payments.filter((p) => p.paymentStatus === "failed").length,
  };

  // Get appointment details for a payment
  const getAppointmentDetails = (appointmentId: number) => {
    return appointments.find((a) => a.id === appointmentId);
  };

  // Get clinic name
  const getClinicName = (clinicId: number) => {
    return clinics.find((c) => c.id === clinicId)?.name || "Unknown Clinic";
  };

  // Format payment method
  const formatPaymentMethod = (method: string) => {
    const methods: Record<string, string> = {
      apple_pay: "Apple Pay",
      visa: "Visa",
      mastercard: "Mastercard",
      debit: "Debit Card",
    };
    return methods[method] || method;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statuses: Record<string, { bg: string; text: string }> = {
      paid: { bg: "bg-emerald-50", text: "text-emerald-700" },
      pending: { bg: "bg-amber-50", text: "text-amber-700" },
      failed: { bg: "bg-red-50", text: "text-red-700" },
      refunded: { bg: "bg-blue-50", text: "text-blue-700" },
    };

    const style = statuses[status] || {
      bg: "bg-gray-50",
      text: "text-gray-700",
    };
    return (
      <Badge className={cn("capitalize", style.bg, style.text)}>{status}</Badge>
    );
  };

  // Paginate results
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading payment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Payment Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage and track all payment transactions
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-foreground">
                ${stats.total.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Paid</p>
              <p className="text-2xl font-bold text-emerald-600">
                {stats.paid}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-2xl font-bold text-amber-600">
                {stats.pending}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Failed</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            placeholder="Search by Transaction ID or Appointment"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

          <Select value={methodFilter} onValueChange={setMethodFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="apple_pay">Apple Pay</SelectItem>
              <SelectItem value="visa">Visa</SelectItem>
              <SelectItem value="mastercard">Mastercard</SelectItem>
              <SelectItem value="debit">Debit Card</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={dateRange.from}
            onChange={(e) =>
              setDateRange({ ...dateRange, from: e.target.value })
            }
            placeholder="From"
          />

          <Input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            placeholder="To"
          />
        </div>

        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            setSearchTerm("");
            setStatusFilter("all");
            setMethodFilter("all");
            setDateRange({ from: "", to: "" });
          }}
        >
          Clear Filters
        </Button>
      </Card>

      {/* Transactions Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Appointment</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPayments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No payments found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPayments.map((payment) => {
                  const appointment = getAppointmentDetails(
                    payment.appointmentId
                  );
                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-sm">
                        {payment.transactionId.substring(0, 20)}...
                      </TableCell>
                      <TableCell>
                        {appointment ? (
                          <div>
                            <p className="text-sm font-medium">
                              {appointment.date}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getClinicName(appointment.clinicId)}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {appointment ? (
                          <div>
                            <p className="text-sm font-medium">
                              {appointment.patientName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {appointment.patientEmail}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${payment.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {formatPaymentMethod(payment.paymentMethod)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(payment.paymentStatus)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages} ({filteredPayments.length}{" "}
              total)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Export Button */}
      <Button
        onClick={() => {
          const csv = [
            [
              "Transaction ID",
              "Appointment ID",
              "Amount",
              "Method",
              "Status",
              "Date",
            ],
            ...filteredPayments.map((p) => [
              p.transactionId,
              p.appointmentId,
              p.amount,
              formatPaymentMethod(p.paymentMethod),
              p.paymentStatus,
              new Date(p.createdAt).toISOString(),
            ]),
          ]
            .map((row) => row.join(","))
            .join("\n");

          const blob = new Blob([csv], { type: "text/csv" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `payments-${new Date().toISOString().split("T")[0]}.csv`;
          a.click();
        }}
        variant="outline"
      >
        Export to CSV
      </Button>
    </div>
  );
};
