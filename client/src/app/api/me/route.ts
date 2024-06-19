import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET(req : NextApiRequest, res : NextApiResponse){

    const token = cookies().get('authorization')

    return NextResponse.json({
        token
    })
}