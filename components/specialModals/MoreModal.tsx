import Modal from "../Modal";
import { IoMdAlert } from "react-icons/io";
import { BiHide } from "react-icons/bi";
import { MdBlock } from "react-icons/md";
import Text from "../Text";
import { BsDownload } from "react-icons/bs";
import { AiOutlineUserAdd, AiOutlineUserDelete } from "react-icons/ai";
import { SetterOrUpdater, useRecoilState } from "recoil";
import { moreModal } from "../../utils/atoms/moreModal";
import { ModalType } from "../types/Modal";
import { Fragment, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { BLOCK_USER } from "../../graphql/mutation/me";
import { useRouter } from "next/router";
import {
  getHiddenPosts,
  setHiddenPosts,
} from "../../inMemoryData/utils/hiddenPosts";
import { PostType } from "../../graphql/types/enums";
import useUid from "../../hooks/useUid";
import {
  GET_MY_FOLLOW_USER_ID,
  GET_MY_PROFILE_PRIMARY_STATS,
} from "../../graphql/query/me";
import { toast } from "react-toastify";
import { FiDelete } from "react-icons/fi";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { DeleteType, deleteType } from "../../utils/atoms/deleteType";
import { FIND_INSTANT_BY_ID } from "../../graphql/query/instant";
import { GET_ARTICLE_BY_ID } from "../../graphql/query/article";
import { createdArticle } from "../../utils/atoms/createdArticle";
import { createdInstant } from "../../utils/atoms/createdInstant";

function MoreModal() {
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  // const [blockUser, { data: blockedUser }] =
  //   useMutation<BLOCK_USER>(BLOCK_USER);
  const uid = useUid();
  const router = useRouter();
  const [deleteTypeState, setDeleteTypeState] = useRecoilState(deleteType);
  const [isPostStateUpdateble, setIsPostStateUpdateble] = useState(false);
  const [articleState, setArticleState] = useRecoilState(createdArticle);
  const [instantState, setInstantState] = useRecoilState(createdInstant);

  const { data: instant, loading: loadingInstant } =
    useQuery<FIND_INSTANT_BY_ID>(FIND_INSTANT_BY_ID, {
      skip: !isPostStateUpdateble || openModal.postType != PostType.INSTANT,
      variables: {
        skip: !isPostStateUpdateble || openModal.postType != PostType.INSTANT,
        type: openModal.postId,
      },
    });

  const { data: article, loading: loadingArticle } =
    useQuery<GET_ARTICLE_BY_ID>(GET_ARTICLE_BY_ID, {
      skip: !isPostStateUpdateble || openModal.postType != PostType.ARTICLE,
      variables: {
        skip: !isPostStateUpdateble || openModal.postType != PostType.ARTICLE,
        type: openModal.postId,
      },
    });

  useEffect(() => {
    setOpenModal((prev) => ({ ...prev, open: false }));
  }, []);

  useEffect(() => {
    if (loadingArticle || loadingInstant || !isPostStateUpdateble) return;
    if (openModal.postType == PostType.INSTANT) {
      instant?.findInstantById &&
        setInstantState({
          ...instant?.findInstantById,
          content: JSON.parse(instant.findInstantById.content),
        });
      router.push("/create/instant/step-1?editId=" + openModal.postId);
    } else {
      article?.findArticleById &&
        setArticleState({
          ...article?.findArticleById,
          content: JSON.parse(article.findArticleById.content),
        });
      router.push("/create/article/step-1?editId=" + openModal.postId);
    }
  }, [isPostStateUpdateble, loadingArticle, loadingInstant]);
  // useEffect(() => {
  //   if (blockedUser?.blockUser.id) {
  //     toast.success("User Blocked");
  //     setOpenModal((prev) => ({ ...prev, open: false }));
  //   }
  // }, [blockedUser]);

  return (
    <Modal
      open={openModal.open && openModal.type == ModalType.MORE}
      callBack={(value) => {
        setOpenModal((prev) => ({
          ...prev,
          open: value,
          hide: {
            offlineDownload: false,
            followAuthor: false,
          },
        }));
      }}
      className="pb-12"
    >
      <div className="space-y-6 pt-3">
        {/* {!openModal.hide?.offlineDownload && (
          <button className="flex items-center px-4 space-x-4">
            <BsDownload size="26" className="text-gray-500" />
            <Text color="text-gray-500" size="text-lg" weight="text-medium">
              Make Available Offline
            </Text>
          </button>
        )} */}

        {router.route == "/me" ? (
          <Fragment>
            <button
              className="flex items-center px-4 space-x-4"
              onClick={() => {
                setIsPostStateUpdateble(true);
              }}
            >
              <RiEdit2Line size="30" className="text-gray-500" />
              <Text color="text-gray-500" size="text-lg" weight="text-medium">
                Edit Post
              </Text>
            </button>
            <button
              className="flex items-center px-4 space-x-4"
              onClick={() => {
                setDeleteTypeState(
                  openModal.postType === PostType.ARTICLE
                    ? DeleteType.ARTICLE
                    : DeleteType.INSTANT
                );
                setOpenModal((prev) => ({
                  ...prev,
                  type: ModalType.CONFIRM,
                  open: true,
                }));
              }}
            >
              <RiDeleteBin6Line size="30" className="text-red-500" />
              <Text color="text-red-500" size="text-lg" weight="text-medium">
                Delete Post
              </Text>
            </button>
          </Fragment>
        ) : (
          uid !== openModal.authorId && (
            <Fragment>
              <button
                className="flex items-center px-4 space-x-4"
                onClick={() => {
                  setOpenModal((prev) => ({
                    ...prev,
                    type: uid ? ModalType.REPORT : ModalType.FORCE_LOGIN,
                    open: true,
                  }));
                }}
              >
                <IoMdAlert size="30" className="text-gray-500" />
                <Text color="text-gray-500" size="text-lg" weight="text-medium">
                  Report
                </Text>
              </button>
              <button
                onClick={() => {
                  hidePost(openModal.postId, openModal.postType);
                  setOpenModal((prev) => ({ ...prev, open: false }));
                }}
                className="flex items-center px-4 space-x-4"
              >
                <BiHide size="30" className="text-gray-500" />
                <Text color="text-gray-500" size="text-lg" weight="text-medium">
                  Not Interested
                </Text>
              </button>
              {/* 
            <button
              className="flex items-center px-4 space-x-4"
              onClick={() =>
                blockUser({
                  variables: {
                    type: openModal.authorId,
                  },
                })
              }
            >
              <MdBlock size="30" className="text-gray-500" />
              <Text color="text-gray-500" size="text-md" weight="text-medium">
                Block Author
              </Text>
            </button> */}
            </Fragment>
          )
        )}
      </div>
    </Modal>
  );
}

async function hidePost(postId: string | undefined, postType: PostType) {
  const hiddenPosts = await getHiddenPosts();
  console.log(postId, postType);
  let serializeHiddenPosts: { postId: string; postType: PostType }[] = [];
  if (!postId || !postType) return;

  if (hiddenPosts) serializeHiddenPosts = JSON.parse(hiddenPosts);
  serializeHiddenPosts.push({
    postId,
    postType,
  });
  setHiddenPosts(JSON.stringify(serializeHiddenPosts));
}

export default MoreModal;
