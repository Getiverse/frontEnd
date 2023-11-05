import React from "react";
import { AiOutlineArrowUp } from "react-icons/ai";

function BackUpButton({ show, hrefId }: { show: boolean; hrefId: string }) {
  return (
    <a
    //   href={"#" + hrefId}
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
      }}
      className={`${show ? "" : "hidden"}`}
    >
      <button className="h-12 w-12 fixed z-30 flex justify-center items-center sm:hidden bottom-20 right-4 rounded-full bg-blue-600">
        <AiOutlineArrowUp size={32} className="animate-movetop text-gray-100" />
      </button>
    </a>
  );
}

export default BackUpButton;
