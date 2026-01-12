import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  paymentGateway,
  PaymentDetails,
  PaymentResponse,
} from "@/services/paymentApi";

interface PaymentFormProps {
  amount: number;
  appointmentId: number;
  patientName: string;
  patientEmail: string;
  clinicId: number;
  onSuccess: (transactionId: string, paymentMethod: string) => void;
  onError: (error: string) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  appointmentId,
  patientName,
  patientEmail,
  clinicId,
  onSuccess,
  onError,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<
    "apple_pay" | "visa" | "mastercard" | "debit"
  >("visa");
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<PaymentResponse | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, "");
    value = value.replace(/[^0-9]/g, "").slice(0, 16);
    const formatted = value.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    setExpiryDate(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCvv(value);
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (paymentMethod !== "apple_pay" && paymentMethod !== "cash") {
      if (!cardholderName.trim()) {
        errors.push("Cardholder name is required");
      }
      if (!cardNumber || cardNumber.replace(/\s/g, "").length !== 16) {
        errors.push("Valid card number is required (16 digits)");
      }
      if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
        errors.push("Valid expiry date is required (MM/YY)");
      }
      if (!cvv || cvv.length !== 3) {
        errors.push("Valid CVV is required (3 digits)");
      }
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      onError(errors.join(", "));
      return;
    }

    setIsProcessing(true);
    setResponse(null);

    try {
      // For cash payment, skip processing and proceed directly
      if (paymentMethod === 'cash') {
        setShowForm(false);
        onSuccess('CASH-PAYMENT', 'cash');
        setIsProcessing(false);
        return;
      }

      const paymentDetails: PaymentDetails = {
        amount,
        method: paymentMethod,
        appointmentId,
        patientName,
        patientEmail,
        clinicId,
      };

      const result = await paymentGateway.processPayment(paymentDetails);
      setResponse(result);

      if (result.success) {
        setShowForm(false);
        onSuccess(result.transactionId, paymentMethod);
      } else {
        onError(result.message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Payment processing failed";
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!showForm && response?.success) {
    return (
      <div className="w-full max-w-md">
        <Alert className="border-emerald-200 bg-emerald-50">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="text-emerald-800">
            <div className="font-semibold">Payment Successful!</div>
            <div className="mt-1 text-sm">
              Transaction ID:{" "}
              <span className="font-mono">{response.transactionId}</span>
            </div>
            <div className="mt-1 text-sm">
              Amount: ${response.amount.toFixed(2)}
            </div>
          </AlertDescription>
        </Alert>
        <Button
          onClick={() => {
            setShowForm(true);
            setCardNumber("");
            setCardholderName("");
            setExpiryDate("");
            setCvv("");
            setResponse(null);
          }}
          variant="outline"
          className="mt-4 w-full"
        >
          Make Another Payment
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      {/* Amount Summary */}
      <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
        <div className="text-sm text-gray-600">Consultation Fee</div>
        <div className="mt-1 text-2xl font-bold text-gray-900">
          ${amount.toFixed(2)}
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-3">
        <Label className="font-semibold">Payment Method</Label>
        <Select
          value={paymentMethod}
          onValueChange={(value: any) => setPaymentMethod(value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple_pay">
              <div className="flex items-center gap-2">🍎 Apple Pay</div>
            </SelectItem>
            <SelectItem value="visa">
              <div className="flex items-center gap-2">💳 Visa</div>
            </SelectItem>
            <SelectItem value="mastercard">
              <div className="flex items-center gap-2">💳 Mastercard</div>
            </SelectItem>
            <SelectItem value="debit">
              <div className="flex items-center gap-2">🏦 Debit Card</div>
            </SelectItem>
            <SelectItem value="cash">
              <div className="flex items-center gap-2">💵 Cash (Pay at Clinic)</div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Card Details (hidden for Apple Pay and Cash) */}
      {paymentMethod !== "apple_pay" && paymentMethod !== "cash" && (
        <>
          {/* Cardholder Name */}
          <div className="space-y-2">
            <Label htmlFor="cardholder">Cardholder Name</Label>
            <Input
              id="cardholder"
              placeholder="John Doe"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              disabled={isProcessing}
            />
          </div>

          {/* Card Number */}
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={handleCardNumberChange}
              disabled={isProcessing}
              maxLength={19}
            />
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={handleExpiryChange}
                disabled={isProcessing}
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cvv}
                onChange={handleCvvChange}
                disabled={isProcessing}
                maxLength={3}
                type="password"
              />
            </div>
          </div>
        </>
      )}

      {/* Apple Pay Notice */}
      {paymentMethod === "apple_pay" && (
        <Alert className="border-blue-200 bg-blue-50">
          <AlertDescription className="text-blue-800">
            Click Pay to complete with Apple Pay
          </AlertDescription>
        </Alert>
      )}

      {/* Cash Payment Notice */}
      {paymentMethod === "cash" && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertDescription className="text-amber-800">
            You will pay ${amount.toFixed(2)} in cash at the clinic
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {response?.status === "failed" && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {response.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-2 text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </Button>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500">
        This is a mock payment system for demonstration. No real charges will be
        made.
      </p>
    </form>
  );
};
