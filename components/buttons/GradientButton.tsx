import { Button } from "../types/Button";


function GradientButton({ children, onClick, className = "" }: Button) {
    return (
        <button className={`py-3 max-w-md text-gray-100 text-lg bg-gradient-to-r from-sky-400 to-pink-400 hover:from-pink-400 hover:opacity-80 duration-300 hover:to-sky-400 w-full rounded-lg ${className}`} onClick={onClick}>
            {children}
        </button>
    )
}

export default GradientButton;
