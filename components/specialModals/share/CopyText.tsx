import React from "react";
import { MdContentCopy } from "react-icons/md";

function CopyText({
  text,
  className = "text-gray-500",
  setShowAlert,
  showAlert,
}: {
  text: string | undefined;
  className?: string;
  setShowAlert: (value: boolean) => void;
  showAlert: boolean;
}) {
  if (!text) throw new Error("no text assigned");
  return (
    <div
      className={`flex bg-gray-200 dark:bg-slate-500 p-4 w-full rounded-xl justify-between items-center ${className}`}
    >
      <p className="text-gray-400 dark:text-gray-700">{text.trim().slice(0, 31)}...</p>
      <button
        onClick={() => {
          navigator.clipboard.writeText(text);
          setShowAlert(true);
        }}
      >
        <div className="relative">
          <MdContentCopy size={25} className="dark:text-gray-700"/>
          {showAlert && (
            <div className="bg-blue-500 opacity-70 absolute bottom-6 right-1 rounded-xl text-white px-2">
              Copied
            </div>
          )}
        </div>
      </button>
    </div>
  );
}

export default CopyText;
