import api from "@/db/api";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";


export async function GET(req : NextApiRequest, res : NextApiResponse){

    const { secretKey , errors }  = await api('/payment/create-payment-intent');

    if(errors){
         
            return NextResponse.json({
                errors
            })
           
    }

    return NextResponse.json({
        secretKey
    })
}