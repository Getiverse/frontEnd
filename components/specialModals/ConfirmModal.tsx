import { useMutation, useQuery } from "@apollo/client";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { useRouter } from "next/router";
import { Fragment, useRef } from "react";
import { toast } from "react-toastify";
import { useClickAway } from "react-use";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  REMOVE_ARTICLE_FROM_LIBRARY,
  REMOVE_INSTANT_FROM_LIBRARY,
} from "../../graphql/mutation/library";
import {
  DELETE_USER,
  REMOVE_ARTICLE,
  REMOVE_INSTANT,
  REMOVE_LIBRARY,
  REMOVE_REPLY,
} from "../../graphql/mutation/me";
import { FIND_ARTICLES_BY_IDS } from "../../graphql/query/article";
import { FIND_INSTANTS_BY_IDS } from "../../graphql/query/instant";
import { FIND_LIBRARY_BY_ID } from "../../graphql/query/library";
import {
  GET_MY_ARTICLES,
  GET_MY_INSTANTS,
  GET_MY_LIBRARIES,
} from "../../graphql/query/me";
import {
  FIND_REPLIES_BY_RATING_ID,
  FIND_REPLIES_IDS_BY_RATING_ID,
} from "../../graphql/query/reply";
import { PostType } from "../../graphql/types/enums";
import { DeleteType, deleteType } from "../../utils/atoms/deleteType";
import { moreModal } from "../../utils/atoms/moreModal";
import {
  ARTICLE_PAGEABLE_PAGE_SIZE,
  INSTANTS_PAGEABLE_PAGE_SIZE,
  LIBRARY_PAGEABLE_SIZE,
  REPLIES_PAGEABLE_SIZE,
} from "../../utils/constants";
import { ModalType } from "../types/Modal";

function ConfirmModal({ text }: { text: string }) {
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  const deleteTypeState = useRecoilValue(deleteType);
  const router = useRouter();
  const libraryId = router.query.id as string;
  const modalRef = useRef(null);
  const [deleteUser] = useMutation(DELETE_USER, {
    update: () => {
      FirebaseAuthentication.deleteUser();
      sessionStorage.clear();
      window.location.href = "/access/login";
    },
  });
  const [removeLibrary, { data: idRemoved, loading: loadingRemoved }] =
    useMutation<REMOVE_LIBRARY>(REMOVE_LIBRARY);
  const [removeArticleFromLibrary] = useMutation(REMOVE_ARTICLE_FROM_LIBRARY);
  const [removeInstantFromLibrary] = useMutation(REMOVE_INSTANT_FROM_LIBRARY);
  const [removeReply, { data: removedReply }] =
    useMutation<REMOVE_REPLY>(REMOVE_REPLY);
  const [removeArticle] = useMutation<REMOVE_ARTICLE>(REMOVE_ARTICLE);
  const [removeInstant] = useMutation<REMOVE_INSTANT>(REMOVE_INSTANT);
  const {
    loading: loadingCurrentLibrary,
    error,
    data: currentLibrary,
    refetch: refetchLibrary,
  } = useQuery<FIND_LIBRARY_BY_ID>(FIND_LIBRARY_BY_ID, {
    variables: {
      skip: !libraryId,
      type: libraryId,
    },
  });

  const closeModal = () => {
    setOpenModal((prev) => ({ ...prev, open: false }));
  };

  useClickAway(
    modalRef,
    () => {
      if (openModal.open && openModal.type == ModalType.CONFIRM) {
        closeModal();
      }
    },
    ["mousedown", "touchstart"]
  );
  function handleDeleteType() {
    if (deleteTypeState == DeleteType.LIBRARY)
      removeLibrary({
        variables: {
          type: libraryId,
        },
        update: async (cache, { data, errors }) => {
          const myLibrariesCached = await cache.readQuery<GET_MY_LIBRARIES>({
            query: GET_MY_LIBRARIES,
            variables: {
              type: {
                page: 0,
                size: LIBRARY_PAGEABLE_SIZE,
              },
            },
          });

          if (data && myLibrariesCached) {
            const tempData = [
              ...myLibrariesCached?.getMyLibraries.data.filter(
                (val) => val.id != libraryId
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
                  count: myLibrariesCached?.getMyLibraries.count - 1,
                  data: [...tempData],
                },
              },
            });
            router.replace("/saved");
            setOpenModal((prev) => ({ ...prev, open: false }));
            toast.success(
              "The library " +
                currentLibrary?.findLibraryById.title +
                " has been removed"
            );
          }
        },
      });
    else if (deleteTypeState == DeleteType.ARTICLE_FROM_LIBRARY) {
      removeArticleFromLibrary({
        variables: {
          libraryId: libraryId,
          articleId: openModal.postId,
        },
        update: async (cache, { data, errors }) => {
          if (errors) {
            toast.error(errors.toString());
            return;
          }
          const myArticlesCached = await cache.readQuery<FIND_ARTICLES_BY_IDS>({
            query: FIND_ARTICLES_BY_IDS,
            variables: {
              type: currentLibrary?.findLibraryById
                ? currentLibrary?.findLibraryById.articles
                : [],
              page: {
                page: 0,
                size: ARTICLE_PAGEABLE_PAGE_SIZE,
              },
            },
          });

          if (data && myArticlesCached) {
            const tempData = [
              ...myArticlesCached?.findArticlesByIds.data.filter(
                (val) => val.id != openModal.postId
              ),
            ];
            await cache.writeQuery({
              query: FIND_ARTICLES_BY_IDS,
              variables: {
                type: currentLibrary?.findLibraryById
                  ? currentLibrary?.findLibraryById.articles
                  : [],
                page: {
                  page: 0,
                  size: ARTICLE_PAGEABLE_PAGE_SIZE,
                },
              },
              data: {
                findArticlesByIds: {
                  count: myArticlesCached?.findArticlesByIds.count - 1,
                  data: [...tempData],
                },
              },
            });

            const cachedMyLibraries = cache.readQuery<GET_MY_LIBRARIES>({
              query: GET_MY_LIBRARIES,
              variables: {
                type: {
                  page: 0,
                  size: LIBRARY_PAGEABLE_SIZE,
                },
              },
            });
            if (cachedMyLibraries?.getMyLibraries && data) {
              const updatedCachedLibraries = [
                ...cachedMyLibraries.getMyLibraries.data.map((value) =>
                  value.id == libraryId
                    ? {
                        ...value,
                        articles: [
                          ...value.articles.filter(
                            (val) => val != openModal.postId
                          ),
                        ],
                      }
                    : value
                ),
              ];
              cache.writeQuery({
                query: GET_MY_LIBRARIES,
                variables: {
                  type: {
                    page: 0,
                    size: LIBRARY_PAGEABLE_SIZE,
                  },
                },
                data: {
                  getMyLibraries: {
                    count: cachedMyLibraries.getMyLibraries.count,
                    data: [...updatedCachedLibraries],
                  },
                },
              });
            }

            const cachedLibrary = cache.readQuery<FIND_LIBRARY_BY_ID>({
              query: FIND_LIBRARY_BY_ID,
              variables: {
                type: { type: libraryId },
              },
            });
            if (cachedLibrary?.findLibraryById.articles) {
              cache.writeQuery({
                query: FIND_LIBRARY_BY_ID,
                variables: {
                  type: { type: libraryId },
                },
                data: {
                  findLibraryById: {
                    ...cachedLibrary?.findLibraryById,
                    articles: [
                      ...cachedLibrary.findLibraryById.articles.filter(
                        (val) => val != openModal.postId
                      ),
                    ],
                  },
                },
              });
            }
            toast.success("The Article has been removed from the library");
          }
        },
      });
    } else if (deleteTypeState == DeleteType.INSTANT_FROM_LIBRARY) {
      removeInstantFromLibrary({
        variables: {
          libraryId: libraryId,
          instantId: openModal.postId,
        },
        update: async (cache, { data, errors }) => {
          if (errors) {
            toast.error(errors.toString());
            return;
          }
          const myInstantsCached = await cache.readQuery<FIND_INSTANTS_BY_IDS>({
            query: FIND_INSTANTS_BY_IDS,
            variables: {
              type: currentLibrary?.findLibraryById
                ? currentLibrary?.findLibraryById.instants
                : [],
              page: {
                page: 0,
                size: INSTANTS_PAGEABLE_PAGE_SIZE,
              },
            },
          });

          if (data && myInstantsCached) {
            const tempData = [
              ...myInstantsCached?.findInstantsByIds.data.filter(
                (val) => val.id != openModal.postId
              ),
            ];
            await cache.writeQuery({
              query: FIND_INSTANTS_BY_IDS,
              variables: {
                type: currentLibrary?.findLibraryById
                  ? currentLibrary?.findLibraryById.instants
                  : [],
                page: {
                  page: 0,
                  size: INSTANTS_PAGEABLE_PAGE_SIZE,
                },
              },
              data: {
                findInstantsByIds: {
                  count: myInstantsCached?.findInstantsByIds.count - 1,
                  data: [...tempData],
                },
              },
            });

            const cachedMyLibraries = cache.readQuery<GET_MY_LIBRARIES>({
              query: GET_MY_LIBRARIES,
              variables: {
                type: {
                  page: 0,
                  size: LIBRARY_PAGEABLE_SIZE,
                },
              },
            });
            if (cachedMyLibraries?.getMyLibraries && data) {
              const updatedCachedLibraries = [
                ...cachedMyLibraries.getMyLibraries.data.map((value) =>
                  value.id == libraryId
                    ? {
                        ...value,
                        instants: [
                          ...value.instants.filter(
                            (val) => val != openModal.postId
                          ),
                        ],
                      }
                    : value
                ),
              ];
              cache.writeQuery({
                query: GET_MY_LIBRARIES,
                variables: {
                  type: {
                    page: 0,
                    size: LIBRARY_PAGEABLE_SIZE,
                  },
                },
                data: {
                  getMyLibraries: {
                    count: cachedMyLibraries.getMyLibraries.count,
                    data: [...updatedCachedLibraries],
                  },
                },
              });
            }

            const cachedLibrary = cache.readQuery<FIND_LIBRARY_BY_ID>({
              query: FIND_LIBRARY_BY_ID,
              variables: {
                type: { type: libraryId },
              },
            });
            if (cachedLibrary?.findLibraryById.instants) {
              console.log(cachedLibrary.findLibraryById.instants);
              cache.writeQuery({
                query: FIND_LIBRARY_BY_ID,
                variables: {
                  type: { type: libraryId },
                },
                data: {
                  findLibraryById: {
                    ...cachedLibrary?.findLibraryById,
                    instants: [
                      ...cachedLibrary.findLibraryById.instants.filter(
                        (val) => val != openModal.postId
                      ),
                    ],
                  },
                },
              });
            }
            toast.success("The Article has been removed from the library");
          }
        },
      });
    } else if (deleteTypeState == DeleteType.REPLY) {
      removeReply({
        variables: {
          type: openModal.ratingId,
        },

        update: async (cache, { data, errors }) => {
          const cachedLibraries =
            await cache.readQuery<FIND_REPLIES_BY_RATING_ID>({
              query: FIND_REPLIES_BY_RATING_ID,
              variables: {
                type: router.query.ratingId,
                page: {
                  page: 0,
                  size: REPLIES_PAGEABLE_SIZE,
                },
              },
            });
          const cachedRatings =
            await cache.readQuery<FIND_REPLIES_IDS_BY_RATING_ID>({
              query: FIND_REPLIES_IDS_BY_RATING_ID,
              variables: {
                type: router.query.ratingId,
                page: {
                  page: 0,
                  size: 1,
                },
              },
            });
          if (cachedRatings?.findRepliesByRatingId.count && data) {
            await cache.writeQuery({
              query: FIND_REPLIES_IDS_BY_RATING_ID,
              variables: {
                type: router.query.ratingId,
                page: {
                  page: 0,
                  size: 1,
                },
              },
              data: {
                findRepliesByRatingId: {
                  count: cachedRatings?.findRepliesByRatingId.count - 1,
                },
              },
            });
          }

          if (cachedLibraries?.findRepliesByRatingId.data && data) {
            await cache.writeQuery({
              query: FIND_REPLIES_BY_RATING_ID,
              variables: {
                type: router.query.ratingId,
                page: {
                  page: 0,
                  size: REPLIES_PAGEABLE_SIZE,
                },
              },
              data: {
                findRepliesByRatingId: {
                  count: cachedLibraries?.findRepliesByRatingId.count - 1,
                  data: [
                    ...cachedLibraries?.findRepliesByRatingId.data.filter(
                      (val) => val.id != openModal.ratingId
                    ),
                  ],
                },
              },
            });
            toast.success("reply deleted with success");
          }
        },
      });
    } else if (deleteTypeState == DeleteType.USER) {
      deleteUser();
    } else if (
      deleteTypeState == DeleteType.ARTICLE &&
      openModal.postType == PostType.ARTICLE
    ) {
      removeArticle({
        variables: {
          type: openModal.postId,
        },

        update: async (cache, { data, errors }) => {
          if (errors) {
            toast.error(errors.toString());
            return;
          }

          const cachedArticlesTemp = await cache.readQuery<GET_MY_ARTICLES>({
            query: GET_MY_ARTICLES,
            variables: {
              page: {
                page: 0,
                size: ARTICLE_PAGEABLE_PAGE_SIZE,
              },
            },
          });
          if (
            data &&
            cachedArticlesTemp?.getMyArticles &&
            openModal.postType == PostType.ARTICLE
          ) {
            await cache.writeQuery({
              query: GET_MY_ARTICLES,
              variables: {
                page: {
                  page: 0,
                  size: ARTICLE_PAGEABLE_PAGE_SIZE,
                },
              },
              data: {
                getMyArticles: {
                  count: cachedArticlesTemp?.getMyArticles.count - 1,
                  data: [
                    ...cachedArticlesTemp?.getMyArticles.data.filter(
                      (val) => val.id != openModal.postId
                    ),
                  ],
                },
              },
            });
            toast.success("article removed with success");
          }
        },
      });
    } else if (
      deleteTypeState == DeleteType.INSTANT &&
      openModal.postType == PostType.INSTANT
    ) {
      removeInstant({
        variables: {
          type: openModal.postId,
        },

        update: async (cache, { data, errors }) => {
          if (errors) {
            toast.error(errors.toString());
            return;
          }

          const cachedInstantsTemp = await cache.readQuery<GET_MY_INSTANTS>({
            query: GET_MY_INSTANTS,
            variables: {
              page: {
                page: 0,
                size: INSTANTS_PAGEABLE_PAGE_SIZE,
              },
            },
          });
          if (
            data &&
            cachedInstantsTemp?.getMyInstants &&
            openModal.postType == PostType.INSTANT
          ) {
            await cache.writeQuery({
              query: GET_MY_INSTANTS,
              variables: {
                page: {
                  page: 0,
                  size: INSTANTS_PAGEABLE_PAGE_SIZE,
                },
              },
              data: {
                getMyInstants: {
                  count: cachedInstantsTemp?.getMyInstants.count - 1,
                  data: [
                    ...cachedInstantsTemp?.getMyInstants.data.filter(
                      (val) => val.id != openModal.postId
                    ),
                  ],
                },
              },
            });
            toast.success("instant removed with success");
          }
        },
      });
    }
    setOpenModal((prev) => ({ ...prev, open: false }));
  }

  return openModal.open && openModal.type == ModalType.CONFIRM ? (
    <>
      <div className="h-full w-full fixed bg-gray-700 opacity-30 z-60" />
      <div
        ref={modalRef}
        className="z-[60] fixed top-32 left-0 "
        tabIndex={-1}
        aria-labelledby={text.split(" ")[0] + text.split(" ")[1]}
        aria-hidden="true"
      >
        <div className="px-2 pointer-events-none  w-auto translate-y-[-50px] transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]">
          <div className="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-xl border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600">
            <div className="flex flex-col flex-shrink-0 rounded-t-md px-4 pt-4  dark:border-opacity-50">
              <button
                onClick={() => closeModal()}
                type="button"
                className="box-content self-end rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h5
                className="text-xl text-left font-medium leading-normal text-neutral-800  dark:text-neutral-200"
                id="exampleModalLabel"
              >
                Are You Sure To Continue?
              </h5>
            </div>
            <div className="relative flex-auto px-4 pt-2">{text}</div>
            <div className="flex flex-shrink-0 flex-wrap space-x-3 items-center justify-end p-4 ">
              <button
                onClick={() =>
                  setOpenModal((prev) => ({
                    ...prev,
                    open: false,
                  }))
                }
                type="button"
                className="inline-block rounded bg-primary-100 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                data-te-ripple-color="light"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDeleteType();
                }}
                type="button"
                className="ml-1 inline-block rounded bg-red-500 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#ef4444] transition duration-150 ease-in-out hover:bg-red-600 hover:shadow-[0_8px_9px_-4px_#ef4444,0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-red-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-red-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                data-te-ripple-init
                data-te-ripple-color="light"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
}

export default ConfirmModal;
