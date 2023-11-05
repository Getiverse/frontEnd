import Image from "next/image";
import { FiMoreVertical } from "react-icons/fi";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import { moreModal } from "../../utils/atoms/moreModal";
import { ModalType } from "../types/Modal";
import Text from "../Text";
import { useEffect } from "react";
import Title from "../Title";
import Avatar from "../Avatar";
import Button from "../buttons/Button";

function ArticleAds(props: any) {
  const [openMoreModal, setOpenMoreModal] = useRecoilState(moreModal);
  const router = useRouter();

  return (
    <>
      <article className="bg-gray-50 dark:bg-slate-900 w-full pt-2 pb-6 rounded-2xl max-w-xs">
        <div className="flex items-center pb-1 px-4 justify-between">
          <div className="flex items-center cursor-pointer">
            <Avatar
              src={
                "https://nordvpn.com/wp-content/uploads/2020/07/favicon-196x196-1.png"
              }
              className="scale-[77%]"
            />
            <div className="flex flex-col justify-start leading-none items-center ml-1">
              <Text size="text-md" weight="font-normal">
                Nord vpn
              </Text>
              <Text size="text-xs" weight="font-thin">
                sponsored
              </Text>
            </div>
          </div>
          <FiMoreVertical
            onClick={() =>
              setOpenMoreModal((prev) => ({
                ...prev,
                type: ModalType.MORE,
                open: true,
                hide: {
                  followAuthor: true,
                  offlineDownload: true,
                },
              }))
            }
            className={`hover:text-blue-400 cursor-pointer ${
              openMoreModal.open && openMoreModal.type == ModalType.MORE
                ? "text-blue-500"
                : "text-gray-500"
            }`}
            size={20}
          />
        </div>
        <div className="h-48 w-full relative">
          <Image
            src={"https://www.html.it/app/uploads/2022/06/nordvpn_cover.jpg"}
            fill
            alt="image alt"
            className="object-cover"
          />
        </div>
        <Title size="text-2xl" className="px-4 mt-2">
        NordVPN: The best online VPN service for speed...
        </Title>
        <Text
          className={"px-4 mt-2"}
          weight="font-normal"
          size="text-sm"
          color="text-gray-600"
        >
          Online VPN service that encrypts your internet traffic and hides your IP with physical location. Upgrade your privacy and security now
        </Text>
        <Button type="secondary" text="Find more" className="w-48 mt-4 m-auto" padding="py-2" onClick={() => console.log("cippa")}/>
      </article>
    </>
  );
}

export default ArticleAds;
