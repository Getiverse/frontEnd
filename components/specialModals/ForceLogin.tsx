import React from "react";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useClickAway } from "react-use";
import { useRecoilState } from "recoil";
import { moreModal } from "../../utils/atoms/moreModal";
import { ModalType } from "../types/Modal";
import GradientButton from "../buttons/GradientButton";

function ForceLogin() {
  const [openModal, setOpenModal] = useRecoilState(moreModal);
  const modalRef = useRef(null);
  const router = useRouter();
  const closeModal = () => {
    setOpenModal((prev) => ({ ...prev, open: false }));
  };

  useClickAway(
    modalRef,
    () => {
      if (openModal.open && openModal.type == ModalType.FORCE_LOGIN) {
        closeModal();
      }
    },
    ["mousedown", "touchstart"]
  );
  return openModal.open && openModal.type == ModalType.FORCE_LOGIN ? (
    <>
      <div className="h-full w-full fixed bg-gray-700 opacity-30 z-60" />
      <div
        ref={modalRef}
        className="z-[60] fixed top-32 left-0 "
        tabIndex={-1}
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
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h5
                className="text-xl text-left font-medium leading-normal text-neutral-800  dark:text-neutral-200"
                id="exampleModalLabel"
              >
                Log in to Continue
              </h5>
            </div>
            <div className="relative flex-auto px-4 pt-2">
              This content is exclusive to our members. Please log in to access
              it. If you don't have an account yet, you can create one in just a
              few moments.
            </div>
            <div className="flex flex-shrink-0 flex-wrap space-x-3 items-center justify-center p-4 ">
              <GradientButton
                className="w-32"
                onClick={() => router.push("/access/login")}
                // className="inline-block rounded bg-primary-100 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                data-te-ripple-color="light"
              >
                Login
              </GradientButton>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
}

export default ForceLogin;
