'use client';

import { Button } from "@/components/ui/button";
import { Elements, useElements, useStripe, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

export default function Checkout() {

    const [stripePromise, setStripePromise] = useState<any>(null)
    const [clientSecret, setClientSecret] = useState<string>("")


    useEffect(() => {

        fetch('/api/config')
            .then(async (response) => {
                const { publicKey } = await response.json()
                setStripePromise(loadStripe(publicKey))
            })

    }, [])
    useEffect(() => {

        fetch('/api/create-payment-intent')
            .then(async (response) => {
                const { secretKey } = await response.json()
                setClientSecret(secretKey)
            })

    }, [])


    return <div className="min-h-screen flex p-3 justify-center items-center">

        {stripePromise && clientSecret && (<Elements stripe={stripePromise} options={{
            clientSecret
        }} >
            <CheckoutForm />
        </Elements>)
        }

    </div>
}


const CheckoutForm = () => {

    const [message, setMessage] = useState<string>('')
    const [isProcessing, setProcessing] = useState<boolean>(false)

    const stripe = useStripe()
    const elements = useElements()


    const handleSubmit = async (e: any) => {
        e.preventDefault()

        if(!stripe || !elements){
            return;
        }

        setProcessing(true)
        
        const { error  , paymentIntent} = await stripe.confirmPayment({
            elements,
            confirmParams : {
                return_url : `${window.location.origin}/payment`,
                receipt_email : 'fazufaiez@gmail.com'
            },
            redirect : 'if_required'
        })
        
        if(error){
            setMessage(error.message as string)
        }else if(paymentIntent && paymentIntent.status === 'succeeded'){
           const res = await fetch('/api/payment-save' , {
                method : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                  },
                body : JSON.stringify({
                    intentId : paymentIntent.id
                })
            })
            const payment = await res.json()

            console.log(paymentIntent , payment)
            setMessage('Payment Success')
        }else{
            setMessage('UnHandled Expection')            
        }
        
        setProcessing(false)


    }


    return <div>
        <p className=" text-center text-3xl my-3 font-bold">CheckOut</p>
        <p className=" text-center my-3 italic text-red-600">{message}</p>
        <form onSubmit={handleSubmit} id="payment-form">
            <PaymentElement />
            <Button type="submit" className="my-3 w-full" disabled={isProcessing}>
                {isProcessing ? 'Proccessing' : 'PAY'}
            </Button>
        </form>
    </div>
}