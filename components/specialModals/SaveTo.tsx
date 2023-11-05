import {
  CSSProperties,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useClickAway } from "react-use";
import { useRecoilState } from "recoil";
import { moreModal } from "../../utils/atoms/moreModal";
import Text from "../Text";
import { ModalType } from "../types/Modal";
import { useRouter } from "next/router";
import Button from "../buttons/Button";
import { BiCheck, BiPlus } from "react-icons/bi";
import { MdOutlinePublic, MdOutlinePublicOff } from "react-icons/md";
import { GET_MY_LIBRARIES } from "../../graphql/query/me";
import InfiniteLoader from "react-window-infinite-loader";
import { FixedSizeList as List } from "react-window";
import { useMutation } from "@apollo/client";
import { SAVE_TO } from "../../graphql/mutation/me";
import { PostType } from "../../graphql/types/enums";
import useUid from "../../hooks/useUid";
import AutoSizer from "react-virtualized-auto-sizer";
import { FIND_LIBRARY_BY_ID } from "../../graphql/query/library";
import useSaveToLibraryFetch from "../../hooks/modals/useSaveToLibraryFetch";
import TextSkeleton from "../skeletons/TextSkeleton";
import { LIBRARY_PAGEABLE_SIZE } from "../../utils/constants";
import { toast } from "react-toastify";
import Modal from "../Modal";

function SaveTo() {
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  const modalRef = useRef(null);
  const [librariesToSave, setLibrariesToSave] = useState<string[]>([]);
  const {
    loadMoreLibraries,
    libraries,
    loadingLibraries,
    librariesCount,
    libraryPage,
    refetchLibraries,
  } = useSaveToLibraryFetch();
  const [saveTo, { data }] = useMutation<SAVE_TO>(SAVE_TO);
  const uid = useUid();
  const closeModal = () => {
    setOpenModal((prev) => ({ ...prev, open: false }));
  };

  const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
    return libraries &&
      libraries[index] != null &&
      libraries[index] != undefined ? (
      <CheckComponent
        style={style}
        key={libraries[index].id}
        checked={librariesToSave}
        setChecked={setLibrariesToSave}
        isPrivate={libraries[index].isPrivate}
        text={libraries[index].title}
        id={libraries[index].id}
      />
    ) : (
      <div
        className="flex items-center w-full justify-between px-8"
        style={style}
      >
        <div className="flex space-x-4 items-center">
          <TextSkeleton height="h-5" width="w-5" className="rounded-sm" />
          <TextSkeleton height="h-3" width="w-26" />
        </div>
        <TextSkeleton height="h-6" width="w-6" className="rounded-full" />
      </div>
    );
  };
  useEffect(() => {
    if (data?.saveTo) {
      toast.success(
        handleLibrarySavedSuccess(
          openModal.postType,
          libraries,
          librariesToSave
        )
      );

      setLibrariesToSave([]);
      closeModal();
    }
  }, [data]);

  const isItemLoaded = (index: number) =>
    libraries ? index < libraries.length - 1 && !loadingLibraries : false;

  if (loadingLibraries) return <></>;

  return (
    <Modal
      className="h-full"
      open={openModal.open && openModal.type == ModalType.SAVE_TO}
      callBack={(value) => {
        setOpenModal((prev) => ({
          ...prev,
          open: value,
        }));
      }}
      Footer={
        <button
          onClick={() => {
            saveTo({
              variables: {
                libraryIds: librariesToSave,
                postId: openModal.postId,
                postType: openModal.postType,
              },
              update: async (cache, { data, errors }) => {
                const cachedLibraries = cache.readQuery<GET_MY_LIBRARIES>({
                  query: GET_MY_LIBRARIES,
                  variables: {
                    type: {
                      page: 0,
                      size: LIBRARY_PAGEABLE_SIZE,
                    },
                  },
                });
                if (errors) {
                  toast.error("Error During library creation");
                } else if (cachedLibraries?.getMyLibraries && data) {
                  const updatedCachedLibraries = [
                    ...cachedLibraries.getMyLibraries.data.map((value) =>
                      librariesToSave.includes(value.id)
                        ? {
                            id: value.id,
                            userId: uid,
                            isPrivate: libraries?.find(
                              (val) => val.id == value.id
                            )?.isPrivate,
                            instants:
                              openModal.postType == PostType.INSTANT &&
                              openModal.postId &&
                              !value.instants.includes(openModal.postId)
                                ? [...value.instants, openModal.postId]
                                : value.instants,
                            articles:
                              openModal.postType == PostType.ARTICLE &&
                              openModal.postId &&
                              !value.articles.includes(openModal.postId)
                                ? [...value.articles, openModal.postId]
                                : value.articles,
                            image:
                              openModal.postType == PostType.ARTICLE
                                ? openModal.image
                                : value.image,
                            createdAt: libraries?.find(
                              (val) => val.id == value.id
                            )?.createdAt,
                            title: libraries?.find((val) => val.id == value.id)
                              ?.title,
                          }
                        : value
                    ),
                  ];
                  await cache.writeQuery({
                    query: GET_MY_LIBRARIES,
                    variables: {
                      type: {
                        page: 0,
                        size: LIBRARY_PAGEABLE_SIZE,
                      },
                    },
                    data: {
                      getMyLibraries: {
                        count: cachedLibraries.getMyLibraries.count,
                        data: [...updatedCachedLibraries],
                      },
                    },
                  });
                  if (openModal.postType == PostType.ARTICLE) {
                    let cachedLibraries = null;
                    for (let i = 0; i < librariesToSave.length; i++) {
                      cachedLibraries = cache.readQuery<FIND_LIBRARY_BY_ID>({
                        query: FIND_LIBRARY_BY_ID,
                        variables: {
                          type: { type: librariesToSave[i] },
                        },
                      });
                      if (cachedLibraries?.findLibraryById) {
                        let temp = [
                          ...cachedLibraries?.findLibraryById.articles,
                        ];
                        if (
                          openModal.postId &&
                          temp?.includes(openModal.postId) == false
                        )
                          temp.push(openModal.postId);
                        if (cachedLibraries?.findLibraryById)
                          await cache.writeQuery({
                            query: FIND_LIBRARY_BY_ID,
                            variables: {
                              type: { type: librariesToSave[i] },
                            },
                            data: {
                              findLibraryById: {
                                ...cachedLibraries?.findLibraryById,
                                articles: [...temp],
                                image: openModal.image,
                              },
                            },
                          });
                      }
                    }
                  }
                }
                closeModal();
              },
            });
          }}
          className="w-full flex items-center space-x-3 pl-2 border-gray-300 dark:border-gray-500"
        >
          <BiCheck size={30} className="text-gray-500" />
          <Text size="text-lg">Done</Text>
        </button>
      }
    >
      <div className="flex items-center w-full justify-between border-b border-gray-300 dark:border-gray-500 pb-2">
        <Text color="text-gray-500" size="text-2xl">
          Save to
        </Text>
        <Button
          onClick={() =>
            setOpenModal((prev) => ({
              ...prev,
              open: true,
              type: ModalType.NEW_LIBRARY,
            }))
          }
          iconLeft
          className="flex items-center"
          type="thirdary"
          text="New Library"
          Icon={<BiPlus size={25} className="text-blue-500" />}
        />
      </div>
      <div className="w-full h-44 pt-4">
        {libraries && libraries?.length > 0 && (
          <AutoSizer>
            {({ height, width }: { height: number; width: number }) => (
              <InfiniteLoader
                isItemLoaded={isItemLoaded}
                itemCount={librariesCount ? librariesCount : 0}
                loadMoreItems={loadMoreLibraries}
              >
                {({ onItemsRendered, ref }) => (
                  <List
                    className="List scrollbar-hide"
                    height={height}
                    itemCount={librariesCount ? librariesCount : 0}
                    itemSize={46}
                    onItemsRendered={onItemsRendered}
                    ref={ref}
                    width={width}
                  >
                    {Row}
                  </List>
                )}
              </InfiniteLoader>
            )}
          </AutoSizer>
        )}
      </div>
    </Modal>
  );
}

export default SaveTo;

function CheckComponent({
  text,
  checked,
  isPrivate,
  setChecked,
  style,
  id,
}: {
  text: string;
  style: CSSProperties;
  id: string;
  checked: string[];
  isPrivate?: boolean;
  setChecked: Dispatch<SetStateAction<string[]>>;
}) {
  return (
    <div className="flex items-center justify-between pr-2" style={style}>
      <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem] ml-2">
        <input
          className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary"
          type="checkbox"
          checked={checked.includes(id)}
          value={id}
          onChange={(e) => {
            const value = e.currentTarget.value;
            if (checked.includes(value)) {
              setChecked((prev) => prev.filter((val) => val !== value));
            } else {
              setChecked((prev) => [...prev, value]);
            }
          }}
          id={text.split(" ")[0]}
        />
        <label
          className="inline-block pl-[0.15rem] hover:cursor-pointer"
          htmlFor={text.split(" ")[0]}
        >
          <Text size="text-md">{text}</Text>
        </label>
      </div>
      {isPrivate ? (
        <MdOutlinePublicOff size={20} className="text-gray-500" />
      ) : (
        <MdOutlinePublic size={20} className="text-gray-500" />
      )}
    </div>
  );
}

function handleLibrarySavedSuccess(
  postType: PostType,
  libraries:
    | {
        id: string;
        userId: string;
        isPrivate: boolean;
        instants: string[];
        articles: string[];
        image: string;
        createdAt: string;
        title: string;
      }[]
    | undefined,
  savedIds: string[]
) {
  let librariesSavedName = "";
  if (libraries == undefined) return "";
  for (let i = 0; i < libraries.length; i++) {
    for (let j = 0; j < savedIds.length; j++) {
      if (libraries[i].id == savedIds[j]) {
        librariesSavedName += libraries[i].title + ",";
      }
    }
  }
  if (postType == PostType.ARTICLE) {
    return "Article saved with success to: " + librariesSavedName;
  } else {
    return "Instant saved with success to: " + librariesSavedName;
  }
}
