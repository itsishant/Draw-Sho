"use client"
import { Input } from "@repo/ui/input";

interface IAuthPage {
    isSignin: boolean;
    headingName: string
}


export default function AuthPage({isSignin, headingName}: IAuthPage) {
    return (
        <div className="flex min-h-screen w-screen h-screen justify-center items-center">
            <div className="p-12 border rounded-xl h-[450px] ">
                <div className="text-center w-full font-sans font-semibold text-neutral-300 text-5xl">
                    {headingName}
                </div>
                <div className="mt-22">
                <div className="rounded-xl mb-4">
                    <Input type="text" placeholder="email"/>
                </div>
                <div className="mb-4 rounded-xl">
                <Input type="password" placeholder="password"/>
                </div>
                <div className="p-3 text-center border rounded-xl">
                <button className="hover:cursor-pointer " onClick={() => {

                }}>{isSignin ? "Signin" : "Signup" }</button>
            </div>
            </div>
            </div>
        </div>
    )
}
