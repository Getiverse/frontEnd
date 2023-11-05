import { AiOutlineClose } from "react-icons/ai";
import { BsClockHistory } from "react-icons/bs";

function HistorySearch({ text, onClick }: { text: string, onClick: () => void }) {
    return (
        <div className="w-full flex items-center justify-between px-6">
            <div className="flex items-center space-x-8">
                <BsClockHistory size="22" className="text-gray-500" />
                <p className="text-gray-500 text-md">{text}</p>
            </div>
            <AiOutlineClose size="23" className="text-gray-500"  />
        </div>
    )
}

export default HistorySearch;