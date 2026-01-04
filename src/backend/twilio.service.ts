import { Injectable } from "@nestjs/common";
import twilio from "twilio";

@Injectable()
export class TwilioService {
  private client: any;
  private verifyServiceId: string;

  constructor() {
    console.log("🔧 [TwilioService] Constructor called");
    console.log("🔧 [TwilioService] Environment check:");
    console.log(
      "  - TWILIO_ACCOUNT_SID:",
      process.env.TWILIO_ACCOUNT_SID ? "✓ Set" : "✗ Missing"
    );
    console.log(
      "  - TWILIO_AUTH_TOKEN:",
      process.env.TWILIO_AUTH_TOKEN ? "✓ Set" : "✗ Missing"
    );
    console.log(
      "  - TWILIO_VERIFY_SERVICE_ID:",
      process.env.TWILIO_VERIFY_SERVICE_ID ? "✓ Set" : "✗ Missing"
    );

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const apiKey = process.env.TWILIO_API_KEY;
    const apiSecret = process.env.TWILIO_API_SECRET;
    this.verifyServiceId = process.env.TWILIO_VERIFY_SERVICE_ID;

    if (!this.verifyServiceId) {
      console.error("❌ [TwilioService] TWILIO_VERIFY_SERVICE_ID is missing!");
      throw new Error("TWILIO_VERIFY_SERVICE_ID is required");
    }

    // Support both Account SID + Auth Token or API Key + Secret
    if (accountSid && authToken) {
      console.log(
        "✓ [TwilioService] Initializing with Account SID + Auth Token"
      );
      this.client = twilio(accountSid, authToken);
      console.log("✅ [TwilioService] Client initialized successfully");
    } else if (apiKey && apiSecret && accountSid) {
      console.log("✓ [TwilioService] Initializing with API Key authentication");
      // API Key authentication (apiKey is like SKxxx, apiSecret is the secret)
      this.client = twilio(accountSid, apiSecret, { accountSid });
      console.log("✅ [TwilioService] Client initialized successfully");
    } else {
      console.error("❌ [TwilioService] Missing credentials!");
      throw new Error(
        "Missing Twilio credentials: need (TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN) or (TWILIO_ACCOUNT_SID + TWILIO_API_KEY + TWILIO_API_SECRET)"
      );
    }
  }

  /**
   * Send OTP to phone number
   */
  async sendOTP(
    phoneNumber: string
  ): Promise<{ success: boolean; sid?: string; error?: string }> {
    try {
      // Ensure phone number has + and country code
      let formattedPhone = phoneNumber.trim();
      if (!formattedPhone.startsWith("+")) {
        if (formattedPhone.startsWith("0")) {
          // Remove leading 0 and add +966 for Saudi Arabia
          formattedPhone = "+966" + formattedPhone.substring(1);
        } else {
          formattedPhone = "+966" + formattedPhone;
        }
      }

      console.log("Twilio sendOTP: Formatted phone:", formattedPhone);

      const verification = await this.client.verify.v2
        .services(this.verifyServiceId)
        .verifications.create({
          to: formattedPhone,
          channel: "sms",
        });

      console.log("Twilio sendOTP: Verification SID:", verification.sid);
      return {
        success: true,
        sid: verification.sid,
      };
    } catch (error: any) {
      console.error("Twilio sendOTP error:", error);
      return {
        success: false,
        error: error.message || "Failed to send OTP",
      };
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(
    phoneNumber: string,
    code: string
  ): Promise<{ success: boolean; verified?: boolean; error?: string }> {
    try {
      // Ensure phone number has + and country code
      let formattedPhone = phoneNumber.trim();
      if (!formattedPhone.startsWith("+")) {
        if (formattedPhone.startsWith("0")) {
          formattedPhone = "+966" + formattedPhone.substring(1);
        } else {
          formattedPhone = "+966" + formattedPhone;
        }
      }

      console.log("Twilio verifyOTP: Formatted phone:", formattedPhone);
      console.log("Twilio verifyOTP: Code:", code);

      const verificationCheck = await this.client.verify.v2
        .services(this.verifyServiceId)
        .verificationChecks.create({
          to: formattedPhone,
          code: code.trim(),
        });

      console.log("Twilio verifyOTP: Status:", verificationCheck.status);
      return {
        success: true,
        verified: verificationCheck.status === "approved",
      };
    } catch (error: any) {
      console.error("Twilio verifyOTP error:", error);
      return {
        success: false,
        error: error.message || "Failed to verify OTP",
      };
    }
  }
}
