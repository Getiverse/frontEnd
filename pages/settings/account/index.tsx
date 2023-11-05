import { NextPage } from "next";
import Container from "../../../components/container/Container";
import Header from "../../../components/logged_in/layout/Header";
import { FiUser } from "react-icons/fi";
import { MdOutlineSecurity } from "react-icons/md";
import RoutingGuard from "../../../components/RoutingGuard";
import LinkSetting from "../../../components/LinkSetting";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { AiOutlineDelete } from "react-icons/ai";
import Text from "../../../components/Text";
import ConfirmModal from "../../../components/specialModals/ConfirmModal";
import { useRecoilState } from "recoil";
import { moreModal } from "../../../utils/atoms/moreModal";
import { ModalType } from "../../../components/types/Modal";
import { useMutation } from "@apollo/client";
import { DELETE_USER } from "../../../graphql/mutation/me";
import { DeleteType, deleteType } from "../../../utils/atoms/deleteType";

const Account: NextPage = () => {
  const [modal, setModal] = useRecoilState(moreModal);
  const [deleteTypeState, setDeleteTypeState] = useRecoilState(deleteType);

  return (
    <RoutingGuard>
      <ConfirmModal text="Once deleted your account will not be available anymore" />
      <Container bg="bg-white">
        <div className="flex flex-col w-full h-screen">
          <Header label="Account" hideIcons />
          <main className="flex-1 overflow-y-scroll px-8 py-5 scrollbar-hide">
            <LinkSetting
              href="account/blocked"
              label="Blocked Users"
              Icon={FiUser}
            />
            <LinkSetting
              href="settings/privacy"
              label="Change Password"
              Icon={MdOutlineSecurity}
            />
            <button
              onClick={() => {
                setDeleteTypeState(DeleteType.USER);
                setModal((prev) => ({
                  ...prev,
                  type: ModalType.CONFIRM,
                  open: true,
                }));
              }}
              className="flex items-center space-x-5 border-b border-gray-300 dark:border-gray-700 py-3 w-full"
            >
              <AiOutlineDelete className="text-red-500" size={26} />
              <Text color="text-red-500" disableDark>
                Delete
              </Text>
            </button>
          </main>
        </div>
      </Container>
    </RoutingGuard>
  );
};

export default Account;
