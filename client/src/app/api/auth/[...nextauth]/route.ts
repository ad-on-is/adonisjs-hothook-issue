import {  NextApiResponse } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, response: NextApiResponse) {
    const code = request.nextUrl.searchParams.get('code');
    const state = request.nextUrl.searchParams.get('state')
    const res = await fetch('http://localhost:3333/api/v1/github/callback/?code=' + code+'&state=' + state)
    const data = await res.json()

    const { errors, user  , value} = data;
    if (errors) {
        redirect('/auth/register?error=' + errors?.[0]?.message);
    }
    if (user) {
        cookies().set('authorization', `Bearer ${value}`);
        redirect('/');
    }
    console.log(data)
    redirect('/auth/login?message=User+Account+Created+Successfully')

}