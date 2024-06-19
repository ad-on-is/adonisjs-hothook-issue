'use client';
import { Button } from "@/components/ui/button"

const paymentLink = "https://buy.stripe.com/test_cN28zr8c72OA0p26oo"

export default function Subscribe() {
    return (
        <Button className="w-full my-3" onClick={() => window.open(paymentLink, '_self')}>SUBSCRIBE 15$/m</Button>

    )
}