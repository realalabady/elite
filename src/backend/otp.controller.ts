import { Controller, Post, Body } from "@nestjs/common";
import { TwilioService } from "./twilio.service";

@Controller("otp")
export class OtpController {
  constructor(private twilioService: TwilioService) {}

  @Post("send")
  async sendOTP(@Body() body: { phoneNumber: string }) {
    const result = await this.twilioService.sendOTP(body.phoneNumber);
    return result;
  }

  @Post("verify")
  async verifyOTP(@Body() body: { phoneNumber: string; code: string }) {
    const result = await this.twilioService.verifyOTP(
      body.phoneNumber,
      body.code
    );
    return result;
  }
}
