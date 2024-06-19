import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/db/api";
import { revalidatePath } from "next/cache";

interface ViewPostProps {
    params: {
        id: string
    }
}

export const revalidate = 3600

export default async function ViewPost(props: ViewPostProps) {

    const { id } = props.params;



    const { post } = await api('/posts/' + id);


    const { comments } = await api(`/posts/${id}/comments`)


    const createComment = async (formData: FormData) => {
        'use server';

        const comment = formData.get('comment') as string;
       const res = await api(`/posts/${id}/comments`, {
            method: 'POST',
            headers : {
                   'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                comment,
            })
        })
        revalidatePath('/posts/' + id)
    }



    return <div className="h-min-screen" >
        <Header />
        <div className="container my-4 shadow-md" >
            <div className="flex gap-5 items-center mb-3" >
                <img src={post.avatarUrl ? post.avatarUrl : 'https://placehold.co/80x80?text=No+Profile'} width={'40px'} alt="Author" className="rounded-full" />
                <p className="italic text-gray-500" >{post.full_name}</p>
            </div>
            <p className="font-bold text-2xl " >{post.title}</p>
            <p>{post.body}</p>
            <p className="italic text-gray-500 my-4" >{post.comment_count} Comments</p>
        </div>
        <div className="container">
            <div className="my-4" >
                <p className="italic font-bold">Add Comment</p>
            </div>
            <form action={createComment}>
                <div className="flex gap-3">
                    <Input name="comment" placeholder="enter your comment" />
                    <Button type="submit" >Add</Button>
                </div>
            </form>
        </div>
        <div className="container" >
            <p className="text-gray-500 my-4 font-bold text-xl">{post.comment_count} Comments</p>
            {comments.data.map((comment: any) => <div className="border p-3 rounded-md my-3" key={comment.id}>
                <div className="flex justify-between">
                    <p className="italic text-orange-500 font-semibold">{comment.full_name}</p>
                    <p className="text-muted-foreground text-xs italic" >{comment.created_at ? new Date(comment.created_at).toLocaleString() : ''}</p>
                </div>
                <div>
                    <p>{comment.comment}</p>
                </div>
            </div>)}

        </div>
    </div>
}