import { useRouter } from "next/router";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { HiCollection, HiOutlineCollection, HiPencil } from "react-icons/hi";
import { MdExplore, MdOutlineExplore } from "react-icons/md";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { TAB_BAR_ITEMS } from "../../../utils/constants";
import Text from "../../Text";
import { moreModal } from "../../../utils/atoms/moreModal";
import { useRecoilState, useRecoilValue } from "recoil";
import { ModalType } from "../../types/Modal";
import { isIos } from "../../../utils/atoms/isIos";
import { getIconBasedOnName } from "../../../utils/reactFunction";

function TabBar({ instant = false }: { instant?: boolean }) {
  const iosValue = useRecoilValue(isIos);
  return (
    <div
      className={`dark:bg-slate-900 lg:hidden border-t  dark:border-gray-700 shadow ${
        iosValue ? "pb-6" : ""
      } flex w-full max-w-3xl z-[3] justify-between px-4 fixed bottom-0 ${
        instant
          ? "bg-gray-900 opacity-80 border-gray-700"
          : "bg-gray-50 border-t-1 border-gray-400"
      }`}
    >
      {TAB_BAR_ITEMS.map(({ path, icon, name }) => (
        <Tab name={name} key={name} icon={icon} path={path} />
      ))}
    </div>
  );
}

const Tab = ({
  name,
  icon,
  path,
}: {
  name: string;
  icon: string;
  path: string;
}) => {
  const router = useRouter();
  const isActive =
    router.asPath === path || router.asPath.includes(path.slice(1));
  const [openMoreModal, setOpenMoreModal] = useRecoilState(moreModal);
  function handleClick() {
    if (path == "/write") {
      /**@ts-ignore */
      setOpenMoreModal({ type: ModalType.WRITE, open: true });
    } else {
      router.push(path);
    }
  }
  return (
    <button
      data-mdb-ripple="true"
      data-mdb-ripple-color="light"
      className="flex flex-col items-center z-30 rounded-xl p-2"
      onClick={() => handleClick()}
    >
      {getIconBasedOnName(icon, isActive)}
      <Text
        disableDark
        color={isActive ? "text-blue-500" : "text-gray-500"}
        size="text-xs"
        weight="font-light"
      >
        {name}
      </Text>
    </button>
  );
};

export default TabBar;
