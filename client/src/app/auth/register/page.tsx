import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import api from "@/db/api"
import { redirect } from "next/navigation"
import GithubLogin from "@/components/github-signin"



export default async function Dashboard({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {



    const handleSubmit = async (formData: FormData) => {
        'use server';
        const fullname = formData.get('fullname')
        const email = formData.get('email')
        const password = formData.get('password')

        const response = await api('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName: fullname,
                email,
                password
            })
        })

        console.log(response)

        const { errors, user } = response;
        if (errors) {
            redirect('/auth/register?error=' + errors?.[0]?.message);
        }
        if (user) {
            redirect('/auth/login?message=User+Account+Created+Successfully');
        }

    }


    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <form action={handleSubmit} >
                <div className="flex items-center justify-center py-12">
                    <div className="mx-auto grid w-[350px] gap-6">
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold">Register</h1>
                            <p className="text-red-500"> {searchParams?.['error']}</p>
                        </div>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>

                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="jhon.doe"
                                    name="fullname"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" required name="password" />
                            </div>
                            <Button type="submit" className="w-full">
                                Register
                            </Button>
                            <GithubLogin />
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link href="#" className="underline">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
            <div className="hidden bg-muted lg:block">
                <Image
                    src="/placeholder.svg"
                    alt="Image"
                    width="1920"
                    height="1080"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}
