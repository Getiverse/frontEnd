import { useRecoilValue } from "recoil";
import { moreModal } from "../../utils/atoms/moreModal";
import MoreModal from "./MoreModal";
import NewLibrary from "./NewLibrary";
import QrCode from "./QrCode";
import ReportModal from "./ReportModal";
import SaveTo from "./SaveTo";
import ShareModal from "./share/ShareModal";
import ShareWeb from "./share/ShareWeb";

function PostModals() {
  const openModal = useRecoilValue(moreModal);
  return (
    <>
      <ReportModal />
      <SaveTo />
      <NewLibrary />
      <MoreModal />
      <ShareWeb />
      <ShareModal />
      <QrCode url={openModal.url} />
    </>
  );
}
export default PostModals;
