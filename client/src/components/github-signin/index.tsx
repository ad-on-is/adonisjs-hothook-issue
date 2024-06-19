'use client';
import { Button } from "@/components/ui/button"



export default function GithubLogin() {


    const onClick = async () => {
        window.open('http://localhost:3333/api/v1/github/redirect', '_self')
    }

    return (
 
            <Button type="button" variant="outline" className="w-full" onClick={onClick} >
                Login with Github
            </Button>
         
  
    )
}