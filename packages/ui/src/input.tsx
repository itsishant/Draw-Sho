"use client";

interface IInput {
    type: string;
    placeholder: string
}

export const Input = ({type, placeholder}: IInput) => {
    return (
        <input type={type} className="p-4 border rounded-xl w-[350px]" placeholder={placeholder}></input>
        
    )
}
