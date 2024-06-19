import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";
import api from "@/db/api";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export async function POST(req: NextRequest) {
  const payload = await req.text();
  const res = JSON.parse(payload);

  const sig = req.headers.get("Stripe-Signature");

  const dateTime = new Date(res?.created * 1000).toLocaleDateString();
  const timeString = new Date(res?.created * 1000).toLocaleTimeString();

  try {
    let event = stripe.webhooks.constructEvent(
      payload,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("Event", event?.type);
    // charge.succeeded
    // payment_intent.succeeded
    // payment_intent.created


  

    switch (event?.type) {
      case "invoice.payment_succeeded":
        const paymentIntent = event.data.object;
        const payment_info = {
          email: paymentIntent.customer_email,
          amount: paymentIntent.amount_paid / 100, // Cast to 'any' to fix the error
          type: res.type,
          time: timeString,
          date: dateTime,
          reciept_url: paymentIntent.hosted_invoice_url,
          reciept_pdf : paymentIntent.invoice_pdf,
          currency: paymentIntent.currency
        }
        console.log(payment_info);
       
        const { errors , payment } = await api('/payment' , {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payment_info)
        })

        console.log(payment)
        console.log(errors)

        break;
      default:
        console.log(event.type)

    }



    return NextResponse.json({ status: "sucess", event: event.type, response: res });
  } catch (error) {
    return NextResponse.json({ status: "Failed", error });
  }
}