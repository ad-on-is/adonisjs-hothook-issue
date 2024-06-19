import  * as actions from "@/actions";
import Header from "@/components/header/";
import Link from "next/link";

interface HomeProps {
  searchParams?: {
      query?: string;
      page?: string;
  }
}

export default async function Home(props : HomeProps) {


  const currentPage = Number(props.searchParams?.page) || 1;

  const posts = await actions.getAllPosts(currentPage)

  if (!posts) {
    return <div>No Posts Found...</div>
  }

  const { data, meta } = posts

  return (
    <main className="flex min-h-screen flex-col">
      <Header />

      <div className="flex p-3 flex-wrap justify-center" >
        {data.map((post: any) => (
          <div className="flex flex-col shadow-md rounded-lg m-5 p-4 w-1/3">
            <Link key={post.id} href={`/post/${post.id}`}>
            <p className="text-gray-400 font-sans italic mb-2 text-sm" >{post?.full_name}</p>
            <p className="text-black-400 font-sans  mb-2 text-sm" >{post?.title}</p>
            <p className="text-black-400 font-sans italic mb-2 text-sm" >{post?.comment_count} comments</p>
          </Link>
          </div>
        ))}
      </div>


      <footer  className="p-3 w-full flex gap-3 italic text-xs justify-end">
       <p>Current Page  <span className="font-bold" >{meta.currentPage} </span> </p>
        <p>Post  Shown <span  className="font-bold">{meta.total}</span></p>
      </footer>
    </main>
  );
}
