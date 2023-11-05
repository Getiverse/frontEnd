import { AiOutlineClose } from "react-icons/ai";
import { BsClockHistory, BsSearch } from "react-icons/bs";
import { FiArrowUpLeft } from "react-icons/fi";

function SuggestedSearch({ text, onClick }: { text: string, onClick: () => void }) {
    return (
        <div className="w-full flex items-center justify-between px-6">
            <div className="flex items-center space-x-8">
                <BsSearch size="22" className="text-gray-500" />
                <p className="text-gray-500 text-md">{text}</p>
            </div>
            <FiArrowUpLeft size="25" className="text-gray-500" />
        </div>
    )
}

export default SuggestedSearch;