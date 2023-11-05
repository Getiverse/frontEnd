import Link from "next/link";
import { IconType } from "react-icons";
import { RiArrowRightSLine } from "react-icons/ri";
import Text from "./Text";

function LinkSetting({
  label,
  Icon,
  href,
}: {
  label: string;
  Icon: IconType;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center py-3 justify-between border-b border-gray-300 dark:border-gray-700"
    >
      <div className="flex items-center space-x-5">
        <Icon size={26} className="text-gray-500" />
        <Text color="text-gray-500">{label}</Text>
      </div>
      <RiArrowRightSLine size={26} className="text-gray-500" />
    </Link>
  );
}

export default LinkSetting;
