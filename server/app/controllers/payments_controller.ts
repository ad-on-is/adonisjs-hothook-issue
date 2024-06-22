import Payment from '#models/payment';
import User from '#models/user';
import type { HttpContext } from '@adonisjs/core/http'
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRETE_KEY!, {
    apiVersion: "2024-04-10"
})

export default class PaymentsController {

    async create({ request, response }: HttpContext) {
        try {


            const data = request.all();

            const user = await User.findBy('email', data.email)

            if (!user) {
                return response.json({
                    errors: [
                        {
                            message: 'User Not found For This email'
                        }
                    ]
                })
            }

            const userId = user.id;

            const payment = await Payment.create({
                user_id: userId,
                ...data
            })
            return response.json({
                payment
            })

        } catch (error) {
            return response.json({
                errors: error
            })
        }
    }

    async createPaymentIntent({ request, response }: HttpContext) {
        try {

            const usdAmount = 1;
            const paymentIntent = await stripe.paymentIntents.create({
                currency: 'usd',
                amount: usdAmount * 100,
                automatic_payment_methods: {
                    enabled: true
                }
            })
            response.json({
                secretKey: paymentIntent.client_secret
            })

        } catch (error) {
            return response.json({
                errors: [
                    {
                        message: error
                    }
                ]
            })
        }
    }
    async retreivePaymentIntent({ request, response , auth }: HttpContext) {
        try {
            const body = request.body()
            const paymentIntent = await stripe.paymentIntents.retrieve(body.intentId)

            // TODO :
            // store intentId in db so that records can be verify later 
            // disallow creating another record with same intentId

            const payment = await Payment.create({
                user_id: auth?.user?.id!,
                amount : paymentIntent.amount,
                currency : paymentIntent.currency,
                date : new Date(paymentIntent.created * 1000).toISOString(),
                time : new Date(paymentIntent.created * 1000).toISOString(),
                reciept_pdf : '',
                reciept_url : '',
            })
            return response.json({
                payment
            })
        } catch (error) {
            response.json({error})
        }
    }

}