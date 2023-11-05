import Modal from "../Modal";
import { MdOutlinePublic, MdOutlinePublicOff } from "react-icons/md";
import Text from "../Text";
import { useRecoilState } from "recoil";
import { moreModal } from "../../utils/atoms/moreModal";
import { ModalType } from "../types/Modal";
import { useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Switch from "../Switch";
import { useRouter } from "next/router";
import { UPDATE_LIBRARY } from "../../graphql/mutation/me";
import { useMutation, useQuery } from "@apollo/client";
import {
  FIND_LIBRARY_BY_ID,
  FIND_MY_LIBRARY_BY_ID,
} from "../../graphql/query/library";
import { GET_MY_LIBRARIES } from "../../graphql/query/me";
import { LIBRARY_PAGEABLE_SIZE } from "../../utils/constants";
import { toast } from "react-toastify";
import { DeleteType, deleteType } from "../../utils/atoms/deleteType";

function ModifyLibraryModal() {
  const router = useRouter();
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  const [updateLibrary] = useMutation(UPDATE_LIBRARY);
  const libraryId = router.query.id;

  const closeModal = () => {
    setOpenModal((prev) => ({ ...prev, open: false }));
  };
  const [deleteTypeState, setDeleteTypeState] = useRecoilState(deleteType);
  const {
    loading: loadingCurrentLibrary,
    error,
    data: currentLibrary,
  } = useQuery<FIND_LIBRARY_BY_ID>(FIND_LIBRARY_BY_ID, {
    variables: {
      skip: !libraryId,
      type: libraryId,
    },
  });

  function updatePrivateState() {
    if (currentLibrary) {
      updateLibrary({
        variables: {
          type: {
            isPrivate: !currentLibrary.findLibraryById.isPrivate,
            title: currentLibrary?.findLibraryById.title,
            description: currentLibrary?.findLibraryById.description,
            id: libraryId,
          },
        },
        update: async (cache, { data, errors }) => {
          const cachedLibraries = await cache.readQuery<FIND_LIBRARY_BY_ID>({
            query: FIND_LIBRARY_BY_ID,
            variables: {
              type: libraryId,
            },
          });

          const myLibrariesCached = await cache.readQuery<GET_MY_LIBRARIES>({
            query: GET_MY_LIBRARIES,
            variables: {
              type: {
                page: 0,
                size: LIBRARY_PAGEABLE_SIZE,
              },
            },
          });

          if (cachedLibraries?.findLibraryById && data && myLibrariesCached) {
            await cache.writeQuery({
              query: FIND_LIBRARY_BY_ID,
              variables: {
                type: libraryId,
              },
              data: {
                findLibraryById: {
                  ...cachedLibraries.findLibraryById,
                  isPrivate: !cachedLibraries.findLibraryById.isPrivate,
                },
              },
            });
            const tempData = [
              ...myLibrariesCached?.getMyLibraries.data.map((val) =>
                val.id == libraryId
                  ? {
                      ...val,
                      isPrivate: !val.isPrivate,
                    }
                  : val
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
                  count: myLibrariesCached?.getMyLibraries.count,
                  data: [...tempData],
                },
              },
            });
            closeModal();
            toast.success(`Now the library is:  
            ${
              currentLibrary.findLibraryById &&
              currentLibrary?.findLibraryById.isPrivate
                ? "public"
                : "private"
            }`);
          }
        },
      });
    } else {
      closeModal();
      toast.error("Error");
    }
  }

  if (loadingCurrentLibrary) return <></>;
  return (
    <>
      <Modal
        open={
          openModal.open && openModal.type == ModalType.MODIFY_LIBRARY_MODAL
        }
        callBack={(value) => {
          setOpenModal((prev) => ({ ...prev, open: value }));
        }}
        title="Modify Library"
        height="h-[350px]"
      >
        <div className="space-y-6 z-30 mt-10 px-2">
          <button
            onClick={() => {
              router.push({
                pathname: router.pathname,
                query: { ...router.query, editable: true },
              });
              closeModal();
            }}
            className="flex items-center space-x-4"
          >
            <FiEdit2 size="22" className="text-gray-500" />
            <Text color="text-gray-500" size="text-lg" weight="text-medium">
              Edit Library
            </Text>
          </button>
          <button
            className="flex items-center space-x-4"
            onClick={() => {
              setDeleteTypeState(DeleteType.LIBRARY);
              setOpenModal((prev) => ({
                ...prev,
                type: ModalType.CONFIRM,
                open: true,
              }));
            }}
          >
            <RiDeleteBin6Line size="22" className="text-red-500" />
            <Text
              color="text-red-500"
              disableDark
              size="text-lg"
              weight="text-medium"
              data-te-toggle="modal"
              data-te-target="#confirmModal"
              data-te-ripple-init
              data-te-ripple-color="light"
            >
              Delete Library
            </Text>
          </button>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <Text size="text-md">Private</Text>
              <Text size="text-xs">Only you can see the Library</Text>
            </div>
            {currentLibrary?.findLibraryById && (
              <Switch
                LeftIcon={MdOutlinePublic}
                RightIcon={MdOutlinePublicOff}
                setValue={() => null}
                value={currentLibrary?.findLibraryById.isPrivate}
                onClick={() => updatePrivateState()}
                large
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ModifyLibraryModal;
