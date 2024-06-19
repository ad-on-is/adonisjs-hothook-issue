import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as actions from '@/actions/index'


export default async function AddPost({
    searchParams,
  }: {
    searchParams?: { [key: string]: string | string[] | undefined };
  }) {

    return <div className="min-h-screen">
        <Header />
        <div className="container p-3">
            <p className="text-red-500">{searchParams?.['error']}</p>
            <form action={actions.createPost}>

                <Input name="title" placeholder="Post title" className="my-4" />
                <Input name="body" placeholder="Post description" className="mb-4" />

                <Button>Add</Button>
            </form>
        </div>
    </div>
}