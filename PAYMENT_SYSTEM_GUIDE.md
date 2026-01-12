# Payment System Implementation Guide

## Overview

A flexible, mock-based payment system designed for immediate use with seamless Stripe integration planned for production.

**Key Architecture Principle**: Strategy pattern with interface-based abstraction allows swapping mock processor for Stripe without changing application code.

---

## 🏗️ Architecture

### Payment Processing Flow

```
User selects clinic/doctor/date/time → Patient info → PAYMENT STEP → OTP Verification → Confirmation
                                                          ↓
                                                   PaymentForm Component
                                                          ↓
                                    paymentGateway.processPayment()
                                                          ↓
                                         Mock/Stripe Processor
                                                          ↓
                                    Saves to db.json payments table
                                                          ↓
                                        Success → OTP → Booking
```

### Files Created/Modified

#### Core Payment Files (New)

1. **`src/services/paymentApi.ts`** - Payment gateway abstraction

   - `PaymentGateway` class (main orchestrator)
   - `MockPaymentProcessor` class (current processor)
   - `StripePaymentProcessor` class (placeholder for future)
   - Implements strategy pattern with `IPaymentProcessor` interface

2. **`src/components/booking/PaymentForm.tsx`** - Payment UI component

   - Display consultation fee
   - 4 payment method selector (Apple Pay, Visa, Mastercard, Debit)
   - Card input form (mock validation)
   - Success/error handling with toast notifications
   - Real-time card number formatting and validation

3. **`src/pages/admin/Payments.tsx`** - Admin dashboard
   - Transaction table with filtering & pagination
   - Revenue analytics (total, by status, by method)
   - Date range filtering
   - CSV export functionality
   - Search by transaction ID or appointment

#### Updated Files

1. **`src/pages/Booking.tsx`**

   - Added payment step (step 5) between patient info and OTP
   - Updated step numbers: OTP → step 6, Confirmation → step 7
   - Payment success triggers OTP sending
   - Payment details displayed in confirmation page
   - Added `CreditCard` icon import from lucide-react

2. **`src/services/api.ts`**

   - Added payment fields to Appointment interface:
     - `paymentStatus?: string`
     - `paymentMethod?: string`
     - `amount?: number`
     - `paymentId?: string`

3. **`db.json`**
   - ✅ Added `consultationFee` to all 13 clinics (110-180 range)
   - ✅ Created `payments` table with transaction schema

---

## 💡 How It Works

### Payment Processing (Mock)

```typescript
// Mock processor simulates 85% success rate:
- 85% → Success (status: 'paid')
- 10% → Card Declined (status: 'failed')
- 5%  → Timeout (status: 'failed')

// Mock transaction saved to db.json:
{
  id: 1,
  appointmentId: 123,
  amount: 150,
  paymentMethod: 'visa',
  paymentStatus: 'paid',
  transactionId: 'TXN-1703001234-abc123xyz',
  createdAt: '2024-12-20T10:30:00.000Z',
  note: 'Mock payment - visa ending in 1234'
}
```

### Booking Flow Integration

1. **Step 1-4**: Select clinic, doctor, date/time, patient info (unchanged)
2. **Step 5 (NEW)**: Payment
   - Display clinic consultation fee
   - Select payment method
   - Enter card details (mock validation)
   - On success → proceed to step 6
3. **Step 6**: OTP Verification (triggered after payment)
   - Same as before but now requires successful payment
4. **Step 7**: Confirmation
   - Shows all details + consultation fee + payment method
   - Final confirmation

---

## 🔌 Stripe Migration Guide (Future)

To integrate real Stripe payments:

### Step 1: Implement StripePaymentProcessor

```typescript
// In src/services/paymentApi.ts

class StripePaymentProcessor implements IPaymentProcessor {
  private stripe: any;

  constructor() {
    this.stripe = window.Stripe("pk_test_...");
  }

  async processPayment(details: PaymentDetails): Promise<PaymentResponse> {
    // Use Stripe SDK to create payment intent
    const intent = await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (intent.status === "succeeded") {
      return {
        success: true,
        transactionId: intent.id,
        status: "paid",
        message: "Payment successful",
        // ... rest of response
      };
    }
    // Handle other statuses...
  }
}
```

### Step 2: Update PaymentGateway Initialization

```typescript
// In src/services/paymentApi.ts - PaymentGateway constructor

constructor(processorType: 'mock' | 'stripe' = 'stripe') {
  this.processor = this.initializeProcessor(processorType);
}
```

### Step 3: Update PaymentForm Component

```typescript
// Replace mock input fields with Stripe Elements
import { CardElement } from "@stripe/react-stripe-js";

// In PaymentForm.tsx:
{
  paymentMethod !== "apple_pay" && (
    <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
  );
}
```

### Step 4: Environment Variables

```env
# .env
VITE_STRIPE_PUBLIC_KEY=pk_live_...
VITE_PAYMENT_PROCESSOR=stripe  # Switch from 'mock' to 'stripe'
```

**No other application code needs to change!**

---

## 📊 Payment Methods

### Supported Methods

| Method     | Mock Behavior | Stripe Support     |
| ---------- | ------------- | ------------------ |
| Apple Pay  | 85% success   | ✅ Fully supported |
| Visa       | 85% success   | ✅ Fully supported |
| Mastercard | 85% success   | ✅ Fully supported |
| Debit Card | 85% success   | ✅ Fully supported |

### Payment Method IDs

```typescript
type PaymentMethod = "apple_pay" | "visa" | "mastercard" | "debit";
```

---

## 💰 Clinic Pricing

All clinics have `consultationFee` field (automatically added to booking):

```
Orthopedic Surgery Clinic: $150
Spine Clinic: $160
Pediatrics: $110
Cardiology: $170
Dermatology: $180
General Surgery: $130
Internal Medicine: $120
ENT Clinic: $125
Neurology: $135
Ophthalmology: $110
Oncology: $140
Rheumatology: $145
Urology: $155
```

---

## 🎯 Admin Dashboard Features

Located at `/admin/payments` (to be added to admin routing)

### Stats Cards

- Total Revenue (sum of all payments)
- Paid Count
- Pending Count
- Failed Count

### Filters

- Search by Transaction ID or Appointment ID
- Payment Status (Paid, Pending, Failed, Refunded)
- Payment Method (Apple Pay, Visa, Mastercard, Debit)
- Date Range (From/To)

### Transaction Table

- Transaction ID (first 20 chars shown)
- Appointment Date & Clinic
- Patient Name & Email
- Amount (formatted as $X.XX)
- Payment Method
- Status (color-coded badges)
- Transaction Date

### Actions

- **Pagination**: 10 items per page
- **Export**: Download transactions as CSV with headers

---

## 🧪 Testing the Payment System

### Test Scenarios

1. **Successful Payment**

   - Fill in all booking details
   - On payment step, submit valid card (should succeed ~85% of time)
   - Verify transaction saved to db.json
   - Proceed to OTP

2. **Failed Payment**

   - Same as above
   - Mock randomly returns failure
   - Toast shows error message
   - User can retry

3. **Mock Success Rate**
   - Run booking 20 times
   - ~17 should succeed, ~3 should fail
   - Check db.json payments table for all transactions

### How to Force Success/Failure (for dev)

Edit `src/services/paymentApi.ts` MockPaymentProcessor:

```typescript
// Force 100% success:
if (random < 1) {
  status = "paid";
}

// Force 100% failure:
if (random < 0) {
  status = "paid";
}
```

---

## 📝 Database Schema

### Payments Table (db.json)

```typescript
interface Transaction {
  id: number;
  appointmentId: number;
  amount: number;
  paymentMethod: string; // 'apple_pay' | 'visa' | 'mastercard' | 'debit'
  paymentStatus: string; // 'paid' | 'pending' | 'failed' | 'refunded'
  transactionId: string; // Unique ID: 'TXN-{timestamp}-{random}'
  createdAt: string; // ISO timestamp
  note?: string; // Optional note (e.g., "Mock payment - visa...")
}
```

### Appointments Table (Updated)

Added fields:

```typescript
paymentStatus?: string;   // 'paid' | 'pending' | 'failed'
paymentMethod?: string;   // 'apple_pay' | 'visa' | 'mastercard' | 'debit'
amount?: number;          // Consultation fee paid
paymentId?: string;       // Reference to transaction ID
```

---

## 🔐 Security Notes

### Current (Mock) Implementation

- No real credit card processing
- Card validation is visual only
- For demo/testing purposes
- All transactions are simulated

### Production (Stripe) Implementation

- PCI DSS Level 1 compliance
- No sensitive card data stored
- Use Stripe.js for tokenization
- Follow Stripe security best practices
- Enable 3D Secure for fraud prevention

---

## 🚀 Deployment Checklist

### Before Going Live with Mock

- [ ] Test all 20+ booking scenarios
- [ ] Verify payments save to db.json correctly
- [ ] Check admin dashboard displays all transactions
- [ ] Test filtering and search functionality
- [ ] Verify CSV export works

### Before Switching to Stripe

- [ ] Set up Stripe account
- [ ] Implement StripePaymentProcessor
- [ ] Update PaymentForm with Stripe Elements
- [ ] Set environment variables
- [ ] Test with Stripe test keys
- [ ] Get PCI compliance certification
- [ ] Set up webhook handlers for Stripe events

---

## 🐛 Troubleshooting

### Payment Always Fails

- Check mock processor success rate configuration
- Verify db.json is writable
- Check browser console for errors

### Admin Dashboard Shows No Payments

- Ensure payments table exists in db.json
- Check json-server is running
- Verify fetch requests in browser DevTools

### OTP Not Sent After Payment

- Payment success callback must await sendOTP()
- Check OTP backend (port 3002) is running
- Verify phone number format (05xxxxxxxx)

---

## 📚 Related Files

- **Frontend Config**: `vite.config.ts` (VITE_API_URL for backend)
- **Backend Entry**: `src/backend/main.ts` (OTP endpoint on port 3002)
- **API Services**: `src/services/api.ts` (appointment creation)
- **Booking Page**: `src/pages/Booking.tsx` (main flow)
- **Admin Hub**: `src/pages/admin/Reservations.tsx` (existing admin dashboard)

---

## 📞 Support

For questions about:

- **Payment Processing**: See `paymentApi.ts` mock processor
- **UI/UX**: See `PaymentForm.tsx` component
- **Admin Features**: See `admin/Payments.tsx` dashboard
- **Integration**: See `Booking.tsx` step handling

---

**Status**: ✅ Complete - Ready for testing and production migration to Stripe
