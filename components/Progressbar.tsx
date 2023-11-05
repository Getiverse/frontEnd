function Progressbar({ id, value, darkBg = false}: { id: string, value: string, darkBg?: boolean }) {
    return (
        <div className="relative pt-4 w-full">
            <div className="flex mb-2 items-center justify-between">
                <div>
                    <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 ${darkBg ? "bg-white opacity-80" : "bg-blue-100"}`}>
                        Complete:
                    </span>
                </div>
                <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-600">
                        {value} %
                    </span>
                </div>
            </div>
            <div className={`overflow-hidden h-2 mb-4 text-xs flex rounded ${darkBg ? "bg-white opacity-90" : "bg-gray-100"}`}>
                <div className={`bg-blue-500`} style={{ width: value + "%" }} />
            </div>
        </div>
    )
}

export default Progressbar;