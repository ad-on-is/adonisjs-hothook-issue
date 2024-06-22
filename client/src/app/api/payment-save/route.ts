import api from "@/db/api";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";


export async function POST(req: NextApiRequest, res: NextApiResponse) {

    const payment = await api('/payment/payment-save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...req.body
        })
    });


    return NextResponse.json({
        payment,
        ...req.body
    })
}