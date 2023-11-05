import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { PostType } from "../graphql/types/enums";
import useUid from "../hooks/useUid";
import { moreModal } from "../utils/atoms/moreModal";
import { handleImageType } from "../utils/functions";
import AvatarSkeleton from "./skeletons/AvatarSkeleton";
import { ModalType } from "./types/Modal";

function Avatar({
  src,
  active = false,
  className = "",
  width = "w-10",
  height = "h-10",
  userId,
  authorName,
  onClick,
}: {
  src: string | null | undefined;
  active?: boolean;
  className?: string;
  width?: string;
  height?: string;
  userId?: string;
  authorName?: string;
  onClick?: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const uid = useUid();
  const [openMoreModal, setOpenMoreModal] = useRecoilState(moreModal);

  return (
    <div
      className={className}
      onClick={() => {
        if (!uid) {
          setOpenMoreModal((prev) => ({
            ...prev,
            type: ModalType.FORCE_LOGIN,
            open: true,
          }));
          return;
        }

        if (onClick) onClick();
        if (!userId || !authorName) return;
        if (uid == userId) {
          router.push("/me");
        } else {
          router.push("/author/@" + authorName + "?id=" + userId);
        }
      }}
    >
      <div className={`${width} ${height} rounded-full relative`}>
        {src && (
          <div>
            <Image
              onLoadingComplete={() => setLoading(false)}
              referrerPolicy="no-referrer"
              fill={true}
              src={handleImageType(src ? src : "")}
              className="rounded-full object-cover object-center w-full h-full"
              alt="user image profile"
            />
          </div>
        )}
        {active && (
          <div className="w-3 h-3 rounded-full absolute right-1 -bottom-1 bg-blue-500" />
        )}
      </div>
    </div>
  );
}
export default Avatar;
