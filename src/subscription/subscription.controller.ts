import { Controller, Post, Body, Headers } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('subscriptions')
@ApiTags('Subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('checkout')
  async createCheckout(@Body() body: { planId: string; email: string }) {
    return this.subscriptionService.createCheckoutSession(
      body.planId,
      body.email
    );
  }

  @Post('webhook')
  handleWebhook(
    @Body() body: any,
    @Headers('Stripe-Signature') signature: string
  ) {
    // return console.log('logs', { body, signature });
    return this.subscriptionService.processWebhook(body, signature);
  }
}
