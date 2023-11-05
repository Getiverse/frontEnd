import Image from "next/image";
import { Button } from "../types/Button";

function GoogleButton({ children, onClick, className = "" }: Button) {
    return (
        <button className={`px-4 sm:px-8 py-3 w-full max-w-md bg-neutral-800 hover:bg-neutral-700 text-gray-100 text-lg rounded-lg flex items-center ${className}`} onClick={onClick}>
            <Image src="/icons/google.svg" width="32" height="32" alt="google logo, the G letter composed by red, blue and yellow colors" />
            <div className="text-center w-full">
                {children}
            </div>
        </button>
    )
}

export default GoogleButton;
