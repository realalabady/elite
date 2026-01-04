import { Controller, Post, Body } from "@nestjs/common";
import { TwilioService } from "./twilio.service";

@Controller("otp")
export class OtpController {
  constructor(private readonly twilioService: TwilioService) {}

  /**
   * Fallback guard in case DI fails unexpectedly (ensures sendOTP is available).
   */
  private get service(): TwilioService {
    if (!this.twilioService) {
      // Instantiating directly as a safety net; should not happen in normal DI flows.
      return new TwilioService();
    }
    return this.twilioService;
  }

  @Post("send")
  async sendOTP(@Body() body: { phoneNumber: string }) {
    return await this.service.sendOTP(body.phoneNumber);
  }

  @Post("verify")
  async verifyOTP(@Body() body: { phoneNumber: string; code: string }) {
    return await this.service.verifyOTP(body.phoneNumber, body.code);
  }
}
