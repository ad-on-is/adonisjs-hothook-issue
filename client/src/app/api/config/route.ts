import api from "@/db/api";
import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET(req : NextApiRequest, res : NextApiResponse){

    const { publicKey }  = await api('/payment/config');

    return NextResponse.json({
        publicKey
    })
}