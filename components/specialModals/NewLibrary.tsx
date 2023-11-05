import { useEffect, useRef, useState } from "react";
import { useClickAway } from "react-use";
import { useRecoilState } from "recoil";
import { moreModal } from "../../utils/atoms/moreModal";
import Text from "../Text";
import { ModalType } from "../types/Modal";
import Button from "../buttons/Button";
import CustomInput from "../input/CustomInput";
import Switch from "../Switch";
import { MdOutlinePublic, MdOutlinePublicOff } from "react-icons/md";
import CustomTextArea from "../CustomTextArea";
import { useMutation } from "@apollo/client";
import { ADD_LIBRARY } from "../../graphql/mutation/saved";
import { GET_MY_LIBRARIES } from "../../graphql/query/me";
import useUid from "../../hooks/useUid";
import { LIBRARY_PAGEABLE_SIZE } from "../../utils/constants";
import { toast } from "react-toastify";
import Modal from "../Modal";

function NewLibrary() {
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  const [isPrivate, setIsPrivate] = useState(false);
  const [libraryName, setLibraryName] = useState("");
  const [libraryDescription, setLibraryDescription] = useState("");
  const uid = useUid();
  const [addLibrary] = useMutation<ADD_LIBRARY>(ADD_LIBRARY);

  const closeModal = () => {
    setOpenModal((prev) => ({ ...prev, open: false }));
  };

  return (
    <Modal
      title="New Library"
      open={openModal.open && openModal.type == ModalType.NEW_LIBRARY}
      callBack={(value) => {
        setOpenModal((prev) => ({
          ...prev,
          open: value,
        }));
      }}
    >
      <div className="flex flex-col h-[calc(100%-57px)]">
        <div className="pt-4 pb-8  space-y-5 flex-1">
          <CustomInput
            value={libraryName}
            onChange={(e) => setLibraryName(e.currentTarget.value)}
            label="Library Name"
            color=""
            rounded={false}
            transparent
            placeHolder="Add a Name"
            border="border-b border-gray-300 focus:border-b-blue-500"
          />
          <CustomTextArea
            value={libraryDescription}
            onChange={(e) => setLibraryDescription(e.currentTarget.value)}
            label="Description(optional)"
            color=""
            height="h-28"
            rounded={false}
            placeHolder="Add a description"
            transparent
            border="border-b"
          />
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <Text size="text-md">Private</Text>
              <Text size="text-xs">Only you can see the Library</Text>
            </div>
            <Switch
              LeftIcon={MdOutlinePublicOff}
              RightIcon={MdOutlinePublic}
              setValue={setIsPrivate}
              value={isPrivate}
              large
            />
          </div>
        </div>
        <div className="flex items-center py-2 px-8 justify-end border-t-2 border-gray-300 dark:border-gray-500">
          <Button
            onClick={() => closeModal()}
            type="thirdary"
            text="Cancel"
            className="text-gray-500"
          />
          <Button
            onClick={() =>
              addLibrary({
                variables: {
                  type: {
                    isPrivate: !isPrivate,
                    title: libraryName,
                    description: libraryDescription,
                  },
                },
                update: (cache, { data, errors }) => {
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
                          count: cachedLibraries.getMyLibraries.count + 1,
                          data: [
                            ...cachedLibraries?.getMyLibraries.data,
                            {
                              id: data?.addLibrary.id,
                              userId: uid,
                              isPrivate: isPrivate,
                              instants: [],
                              articles: [],
                              image: "",
                              createdAt: data?.addLibrary.createdAt,
                              title: libraryName,
                            },
                          ],
                        },
                      },
                    });
                    toast.success("Library Created With Success");
                  }
                  setLibraryName("");
                  setLibraryDescription("");
                  closeModal();
                },
              })
            }
            type="thirdary"
            text="Create"
            className="ml-8"
          />
        </div>
      </div>
    </Modal>
  );
}
export default NewLibrary;
