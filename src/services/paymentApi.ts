/**
 * Payment API Abstraction Layer
 * Designed to be flexible: mock processor now, Stripe adapter later
 * Implementation uses strategy pattern for easy processor swapping
 */

export interface PaymentDetails {
  amount: number;
  method: 'apple_pay' | 'visa' | 'mastercard' | 'debit' | 'cash';
  appointmentId: number;
  patientName: string;
  patientEmail: string;
  clinicId: number;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  status: "paid" | "pending" | "failed";
  message: string;
  amount: number;
  method: string;
  timestamp: string;
}

export interface Transaction {
  id: number;
  appointmentId: number;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  createdAt: string;
  note?: string;
}

/**
 * Payment Processor Interface
 * Implementations (Mock, Stripe, etc.) follow this contract
 */
interface IPaymentProcessor {
  processPayment(details: PaymentDetails): Promise<PaymentResponse>;
  refund(transactionId: string): Promise<{ success: boolean; message: string }>;
  getTransaction(transactionId: string): Promise<Transaction | null>;
}

/**
 * Mock Payment Processor
 * Simulates payment processing for development/testing
 * Success rate: ~85% success, ~10% declined, ~5% timeout
 */
class MockPaymentProcessor implements IPaymentProcessor {
  private transactions: Map<string, Transaction> = new Map();
  private lastId = 0;

  async processPayment(details: PaymentDetails): Promise<PaymentResponse> {
    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 1000 + 500)
    );

    const random = Math.random();
    let status: "paid" | "pending" | "failed" = "paid";
    let message = "Payment processed successfully";

    if (random < 0.85) {
      status = "paid";
      message = "Payment processed successfully";
    } else if (random < 0.95) {
      status = "failed";
      message = "Card declined. Please try another payment method.";
    } else {
      status = "failed";
      message = "Payment timeout. Please try again.";
    }

    const transactionId = `TXN-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const transaction: Transaction = {
      id: ++this.lastId,
      appointmentId: details.appointmentId,
      amount: details.amount,
      paymentMethod: details.method,
      paymentStatus: status,
      transactionId,
      createdAt: new Date().toISOString(),
      note: `Mock payment - ${details.method} ending in 1234`,
    };

    this.transactions.set(transactionId, transaction);

    // Also save to db.json (without id, let json-server auto-generate)
    try {
      const { id, ...transactionData } = transaction;
      const response = await fetch("http://localhost:3003/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...transactionData,
          patientName: details.patientName,
          patientEmail: details.patientEmail,
        }),
      });
      if (!response.ok) console.error("Failed to save transaction to db.json");
    } catch (error) {
      console.error("Error saving transaction:", error);
    }

    return {
      success: status === "paid",
      transactionId,
      status,
      message,
      amount: details.amount,
      method: details.method,
      timestamp: new Date().toISOString(),
    };
  }

  async refund(
    transactionId: string
  ): Promise<{ success: boolean; message: string }> {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) {
      return { success: false, message: "Transaction not found" };
    }

    transaction.paymentStatus = "refunded";

    // Update in db.json
    try {
      await fetch(`http://localhost:3003/payments/${transaction.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "refunded" }),
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
    }

    return { success: true, message: "Refund processed successfully" };
  }

  async getTransaction(transactionId: string): Promise<Transaction | null> {
    return this.transactions.get(transactionId) || null;
  }
}

/**
 * Stripe Payment Processor (placeholder for future implementation)
 * Will implement when switching to real payments
 */
class StripePaymentProcessor implements IPaymentProcessor {
  async processPayment(details: PaymentDetails): Promise<PaymentResponse> {
    // TODO: Implement Stripe payment processing
    // This will use Stripe SDK and actual card processing
    throw new Error("Stripe processor not yet implemented");
  }

  async refund(
    transactionId: string
  ): Promise<{ success: boolean; message: string }> {
    // TODO: Implement Stripe refund
    throw new Error("Stripe refund not yet implemented");
  }

  async getTransaction(transactionId: string): Promise<Transaction | null> {
    // TODO: Implement transaction lookup
    throw new Error("Stripe getTransaction not yet implemented");
  }
}

/**
 * Payment Gateway
 * Main interface for the application
 * Handles processor selection and payment orchestration
 */
class PaymentGateway {
  private processor: IPaymentProcessor;

  constructor(processorType: "mock" | "stripe" = "mock") {
    this.processor = this.initializeProcessor(processorType);
  }

  private initializeProcessor(type: "mock" | "stripe"): IPaymentProcessor {
    switch (type) {
      case "mock":
        return new MockPaymentProcessor();
      case "stripe":
        return new StripePaymentProcessor();
      default:
        return new MockPaymentProcessor();
    }
  }

  /**
   * Validate payment details before processing
   */
  private validatePaymentDetails(details: PaymentDetails): string[] {
    const errors: string[] = [];

    if (!details.amount || details.amount <= 0) {
      errors.push("Invalid amount");
    }
    if (
      !["apple_pay", "visa", "mastercard", "debit", "cash"].includes(details.method)
    ) {
      errors.push("Invalid payment method");
    }
    // appointmentId is optional at payment time (appointment created after payment)
    if (!details.patientName?.trim()) {
      errors.push("Patient name is required");
    }
    if (!details.patientEmail?.trim()) {
      errors.push("Patient email is required");
    }

    return errors;
  }

  /**
   * Process payment with validation and error handling
   */
  async processPayment(details: PaymentDetails): Promise<PaymentResponse> {
    const errors = this.validatePaymentDetails(details);
    if (errors.length > 0) {
      return {
        success: false,
        transactionId: "",
        status: "failed",
        message: `Validation failed: ${errors.join(", ")}`,
        amount: details.amount,
        method: details.method,
        timestamp: new Date().toISOString(),
      };
    }

    try {
      return await this.processor.processPayment(details);
    } catch (error) {
      return {
        success: false,
        transactionId: "",
        status: "failed",
        message: `Payment processing error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        amount: details.amount,
        method: details.method,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Refund a transaction
   */
  async refund(
    transactionId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      return await this.processor.refund(transactionId);
    } catch (error) {
      return {
        success: false,
        message: `Refund error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  /**
   * Get transaction details
   */
  async getTransaction(transactionId: string): Promise<Transaction | null> {
    try {
      return await this.processor.getTransaction(transactionId);
    } catch (error) {
      console.error("Error retrieving transaction:", error);
      return null;
    }
  }

  /**
   * Switch processor at runtime
   * Useful for testing or A/B testing payment processors
   */
  switchProcessor(processorType: "mock" | "stripe"): void {
    this.processor = this.initializeProcessor(processorType);
  }
}

// Export singleton instance
export const paymentGateway = new PaymentGateway(
  (import.meta.env.VITE_PAYMENT_PROCESSOR as "mock" | "stripe") || "mock"
);

// Export classes for testing/extension
export { MockPaymentProcessor, StripePaymentProcessor, PaymentGateway };
