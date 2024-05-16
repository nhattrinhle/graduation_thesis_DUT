import Stripe from 'stripe'
import { STRIPE_SECRET_KEY } from '../constants/stripe.constant'
 
const stripe = new Stripe(STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
})

export async function createPaymentIntent(creditAmount: number, conversionRate: number) {

       const paymentIntents = await stripe.paymentIntents.create({
        currency: 'USD',
        automatic_payment_methods: { enabled: true },
        amount: creditAmount * conversionRate * 100,
      })
    return paymentIntents
}

export async function cancelPaymentIntent(intentId: string){
   const cancelPaymentIntents = await stripe.paymentIntents.cancel(intentId)
   return cancelPaymentIntents
}

