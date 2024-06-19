import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";



export default async function Payment() {

    return <div className="min-h-screen flex justify-center items-center flex-col">
        <Image src="/payment.png" width={300} height={300} alt="Payment" />
        <p className="text-3xl text-teal-800 font-bold" >Payment Successfull </p>
        <Link href={'/'} >
            <Button>GO TO HOME</Button>
        </Link>
    </div>
}