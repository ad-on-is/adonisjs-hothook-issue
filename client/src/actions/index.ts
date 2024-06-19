'use server';
import api from "@/db/api";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


const login = async (formData: FormData) => {
    const email = formData.get('email')
    const password = formData.get('password')

    const response = await api('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    console.log(response)

    const { errors, user, value } = response;
    if (errors) {
      redirect('/auth/login?error=' + errors?.[0]?.message);
    }
    if (user) {
      cookies().set('authorization', `Bearer ${value}`);
      redirect('/');
    }


}


const register = async (formData: FormData) => {

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

const createPost = async (formData: FormData) => {
 

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

const createComment = async (id : string | number ,formData: FormData) => {


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


const getPost = async (id : number | string ) =>{
    const { post } = await api('/posts/' + id);
    const { comments } = await api(`/posts/${id}/comments`)

    return {
        post,
        comments
    }
}


const getAllPosts = async (currentPage : number | string) =>{
    const res = await api('/posts/?page='+currentPage)

    const { posts } = res;

    return posts
}


export {
    login,
    register,
    createPost,
    createComment,
    getPost,
    getAllPosts
}