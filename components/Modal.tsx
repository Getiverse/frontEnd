import { useRef } from "react";
import { Modal } from "./types/Modal";
import { BottomSheet } from "react-spring-bottom-sheet";
import Title from "./Title";

function Modal({
  title = "",
  open,
  callBack,
  children,
  className = "pb-12",
  Footer,
}: Modal) {
  const modalRef = useRef(null);

  // useClickAway(
  //   modalRef,
  //   () => {
  //     if (open) {
  //       callBack(false);
  //     }
  //   },
  //   ["mousedown", "touchstart"]
  // );

  return (
    <BottomSheet
      onDismiss={() => callBack(false)}
      open={open}
      ref={modalRef}
      snapPoints={({ minHeight, maxHeight }) => [minHeight, maxHeight]}
      maxHeight={600}
      footer={Footer}
      style={{left:"50%"}}
      header={
        <Title color="text-gray-500" size="text-2xl">
          {title}
        </Title>
      }
    >
      <div
        className={`pt-5 ${(Footer = null ? "pb-2" : "")} px-5 ${className}`}
      >
        {children}
      </div>
    </BottomSheet>
  );
}

export default Modal;
