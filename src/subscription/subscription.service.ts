import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SubscriptionService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService
  ) {
    const stripeSecretKey =
      this.configService.get<string>('STRIPE_SECRET_KEY') || '';
    if (!stripeSecretKey) {
      throw new Error('Missing STRIPE_SECRET_KEY in .env file');
    }

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-01-27.acacia',
    });
  }

  async createCheckoutSession(planId: string, email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    let customerId = user?.stripeCustomerId;

    if (!customerId) {
      const customer = await this.stripe.customers.create({ email });
      customerId = customer.id;

      if (user) {
        await this.prisma.user.update({
          where: { email },
          data: { stripeCustomerId: customer.id },
        });
      }
    }

    if (!customerId) {
      throw new Error('Failed to create Stripe customer');
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: planId, quantity: 1 }],
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel',
    });

    return { url: session.url };
  }

  async processWebhook(body: any, signature: string) {
    const endpointSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET'
    );
    if (!endpointSecret) {
      throw new Error('Missing STRIPE_WEBHOOK_SECRET in .env file');
    }

    try {
      const event: Stripe.Event = this.stripe.webhooks.constructEvent(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        body,
        signature,
        endpointSecret
      );

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object;
          console.log('Payment successful:', session);

          const customerId =
            typeof session.customer === 'string'
              ? session.customer
              : session?.customer?.id || '';
          const stripeSubId =
            typeof session.subscription === 'string'
              ? session.subscription
              : session?.subscription?.id || '';
          await this.activateSubscription(customerId, stripeSubId);
          break;
        }
        case 'invoice.payment_failed': {
          const invoiceEvent = event.data.object as {
            customer: string | { id: string };
          };
          console.log('Payment failed:', invoiceEvent);
          const failedCustomerId =
            typeof invoiceEvent.customer === 'string'
              ? invoiceEvent.customer
              : invoiceEvent.customer.id;
          await this.handleFailedPayment(failedCustomerId);
          break;
        }
        case 'customer.subscription.deleted': {
          const deletedSub = event.data.object as {
            customer: string | { id: string };
          };
          console.log('Subscription canceled:', deletedSub);
          const canceledCustomerId =
            typeof deletedSub.customer === 'string'
              ? deletedSub.customer
              : deletedSub.customer.id;
          await this.cancelSubscription(canceledCustomerId);
          break;
        }
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error('Webhook Error:', error?.message ?? 'aa');
    }
  }

  async activateSubscription(customerId: string, stripeSubscriptionId: string) {
    const user = await this.prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    });
    if (!user) {
      throw new Error(`User not found for customerId ${customerId}`);
    }

    // Check if a subscription record exists for the user.
    const existSubscription = await this.prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    const stripeSubscription =
      await this.stripe.subscriptions.retrieve(stripeSubscriptionId);
    const priceId = stripeSubscription.items.data[0]?.price.id;

    const plan = await this.prisma.plan.findUnique({ where: { priceId } });

    if (existSubscription) {
      await this.prisma.subscription.update({
        where: { userId: user.id },
        data: {
          status: 'ACTIVE',
          stripeSubId: stripeSubscriptionId,
        },
      });
      console.log(`Subscription updated for customer ${customerId}`);
    } else {
      await this.prisma.subscription.create({
        data: {
          userId: user.id,
          status: 'ACTIVE',
          stripeSubId: stripeSubscriptionId,
          planId: plan?.id || '',
        },
      });
      console.log(
        `Subscription created and activated for customer ${customerId}`
      );
    }
  }

  async handleFailedPayment(customerId: string) {
    const user = await this.prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    });
    if (!user) {
      throw new Error(`User not found for customerId ${customerId}`);
    }

    await this.prisma.subscription.update({
      where: { userId: user.id },
      data: { status: 'PAST_DUE' },
    });

    console.log(`Subscription payment failed for customer ${customerId}`);
  }

  async cancelSubscription(customerId: string) {
    const user = await this.prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    });
    if (!user) {
      throw new Error(`User not found for customerId ${customerId}`);
    }

    await this.prisma.subscription.update({
      where: { userId: user.id },
      data: { status: 'CANCELED' },
    });

    console.log(`Subscription canceled for customer ${customerId}`);
  }
}
