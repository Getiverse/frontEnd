import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { HiCollection, HiOutlineCollection, HiPencil } from "react-icons/hi";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { MdExplore, MdOutlineExplore } from "react-icons/md";

export function getIconBasedOnName(name: string, isActive: boolean) {
  switch (name) {
    case "home":
      return isActive ? (
        <AiFillHome size={26} className="text-blue-500" />
      ) : (
        <AiOutlineHome className="text-gray-500" size={26} />
      );
    case "instants":
      return isActive ? (
        <HiCollection size={27} className={`-rotate-90 text-blue-500 z-40`} />
      ) : (
        <HiOutlineCollection
          className={`-rotate-90 text-gray-500 z-40`}
          size={26}
        />
      );
    case "write":
      return (
        <div
          className={`p-2 border rounded-full scale-[91%] ${
            isActive ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <HiPencil size={26} />
        </div>
      );
    case "explore":
      return isActive ? (
        <MdExplore size={26} className="text-blue-500" />
      ) : (
        <MdOutlineExplore size={26} className={"text-gray-500"} />
      );
    case "saved":
      return isActive ? (
        <IoBookmark size={26} className="text-blue-500" />
      ) : (
        <IoBookmarkOutline className={"text-gray-500"} size={26} />
      );
  }
}
