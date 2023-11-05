import { PostType } from "./../../graphql/types/enums";
import { atom } from "recoil";
import { ModalType } from "../../components/types/Modal";

type Modal = {
  type: ModalType;
  open: boolean;
  authorId?: string;
  ratingId?: string;
  postId?: string;
  postType: PostType;
  isMyRating?: boolean;
  update?: boolean;
  image?: string;
  url?: string;
  hide?: {
    offlineDownload?: boolean;
    followAuthor?: boolean;
  };
};

export const moreModal = atom<Modal>({
  key: "modals", // unique ID (with respect to other atoms/selectors)
  default: {
    type: ModalType.MORE,
    isMyRating: false,
    open: false,
    authorId: "-1",
    postId: "-1",
    postType: PostType.ARTICLE,
    ratingId: "-1",
    update: false,
    image: "",
    url: "",
    hide: {
      offlineDownload: false,
      followAuthor: false,
    },
  }, // default value (aka initial value)
});
