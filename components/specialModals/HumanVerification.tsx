// const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), { ssr: false })
import { useRecoilState } from "recoil";
import { captchaToken } from "../../utils/atoms/captchaToken";
import { moreModal } from "../../utils/atoms/moreModal";
import Modal from "../Modal";
import { ModalType } from "../types/Modal";

function HumanVerification() {
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  // const [capToken, setCaptchaToken] = useRecoilState(captchaToken);
  return (
    <Modal
      height="h-1/3"
      open={openModal.open && openModal.type == ModalType.HUMAN_VERIFICATION}
      callBack={(value) =>
        setOpenModal((prev) => ({
          ...prev,
          type: ModalType.HUMAN_VERIFICATION,
          open: value,
        }))
      }
      title="Human Verification"
      className="flex items-center justify-center"
    >
      {/* <ReCAPTCHA className="pt-[2px] pl-[1.2px] bg-gradient-to-r from-sky-400 to-pink-400 rounded-xl" sitekey="6Ld4ZnQjAAAAANHoM0M-g7o2NtF8sMjeFvV_JroQ" onChange={(value: string | null) => setCaptchaToken(value ? value : "")} /> */}
    </Modal>
  );
}

export default HumanVerification;
