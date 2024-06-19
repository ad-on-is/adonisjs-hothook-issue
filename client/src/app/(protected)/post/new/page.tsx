import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/db/api";
import { redirect } from "next/navigation";



export default async function AddPost({
    searchParams,
  }: {
    searchParams?: { [key: string]: string | string[] | undefined };
  }) {


    const handleSubmit = async (formData: FormData) => {
        'use server';

        const title = formData.get('title') as string
        const body = formData.get('body') as string

        const { post, errors } = await api('/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                body
            })
        })

        if (errors) {
            return redirect(`/post/new?error=${errors[0].message}`)
        }

        redirect('/')
    }

    return <div className="min-h-screen">
        <Header />
        <div className="container p-3">
            <p className="text-red-500">{searchParams?.['error']}</p>
            <form action={handleSubmit}>

                <Input name="title" placeholder="Post title" className="my-4" />
                <Input name="body" placeholder="Post description" className="mb-4" />

                <Button>Add</Button>
            </form>
        </div>
    </div>
}