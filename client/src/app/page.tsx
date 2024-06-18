import Header from "@/components/header/";
import api from "@/db/api";
import { getAuthorization } from "@/db/getMe";
import { headers } from "next/headers";



export default async function Home() {

  const authorization = await getAuthorization();

  if(!authorization) {
    return <div>Not logged in...</div>
  }

  const res = await api('/posts', {
    headers: {
      authorization
    }
  })

  const { posts } = res;

  console.log(res)

  if (!posts) {
    return <div>No Post Found...</div>
  }

  const { data, meta } = posts


  return (
    <main className="flex min-h-screen flex-col ">
      <Header />

      <div className="flex p-3" >
        {data.map((post: any) => (
          <div className="flex flex-col shadow-md rounded-lg m-5 w-full p-4">
            <p className="text-gray-400 font-sans italic mb-2 text-sm" >{post?.full_name}</p>
            <p className="text-black-400 font-sans  mb-2 text-sm" >{post?.title}</p>
            <p className="text-black-400 font-sans italic mb-2 text-sm" >{post?.comment_count} comments</p>
          </div>
        ))}
      </div>
    </main>
  );
}
