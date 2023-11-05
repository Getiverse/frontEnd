import React, { Fragment, useRef } from "react";
import { Plate, PlateProvider } from "@udecode/plate-common";
import { ELEMENT_PARAGRAPH } from "@udecode/plate-paragraph";
import { plugins } from "@/lib/plate/plate-plugins";
import { cn } from "@/lib/utils";
import { CursorOverlay } from "@/components/plate-ui/cursor-overlay";
import { FixedToolbar } from "@/components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "@/components/plate-ui/fixed-toolbar-buttons";
import { FloatingToolbar } from "@/components/plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "@/components/plate-ui/floating-toolbar-buttons";
import MobileFloatingToolbar from "../plate-ui/mobile-floating-toolbar";
import { useRecoilState } from "recoil";
import { createdArticle, Post } from "../../../../utils/atoms/createdArticle";
import { createdInstant } from "../../../../utils/atoms/createdInstant";

export default function Editor({
  writable = false,
  setOpenNavbar,
  readOnly = false,
  content = [],
  instant = false,
}: {
  writable?: boolean;
  setOpenNavbar?: React.Dispatch<React.SetStateAction<boolean>>;
  readOnly?: boolean;
  content?: any[];
  instant?: boolean;
}) {
  const containerRef = useRef(null);
  const [article, setArticle] = useRecoilState(createdArticle);
  const [instantData, setInstantData] = useRecoilState(createdInstant);
  const initialValue = [
    {
      type: ELEMENT_PARAGRAPH,
      children: [{ text: "Press me to write" }],
    },
  ];
  function handleValue() {
    if (content.length > 0 && content) return content;
    if (instant && instantData != undefined && instantData.content.length > 0) {
      return instantData.content;
    }
    if (article != undefined && article.content.length > 0)
      return article.content;
    else return initialValue;
  }

  return (
    <PlateProvider
      readOnly={readOnly}
      plugins={plugins}
      onChange={(val: any) => {
        if (instant) setInstantData((prev: any) => ({ ...prev, content: val }));
        else setArticle((prev: any) => ({ ...prev, content: val }));
      }}
      value={handleValue()}
      initialValue={handleValue()}
    >
      {writable && (
        <FixedToolbar>
          <FixedToolbarButtons
            instant={instant}
            setOpenNavbar={setOpenNavbar}
          />
        </FixedToolbar>
      )}
      <div
        ref={containerRef}
        className={cn(
          instant && readOnly
            ? "text-white"
            : "text-gray-600 dark:text-gray-100",
          "relative h-full flex w-full"
        )}
      >
        <Plate
          editableProps={{
            autoFocus: true,
            className: cn(
              "relative h-full w-full leading-[1.4] outline-none [&_strong]:font-bold",
              readOnly ? "" : "m-auto p-3 lg:p-12",
              writable ? "lg:w-[900px]" : ""
            ),
          }}
        >
          {writable && (
            <Fragment>
              <FloatingToolbar>
                <FloatingToolbarButtons instant={instant} />
              </FloatingToolbar>
              <MobileFloatingToolbar instant={instant} />
            </Fragment>
          )}

          {/* <MentionCombobox items={MENTIONABLES} /> */}

          <CursorOverlay containerRef={containerRef} />
        </Plate>
      </div>
    </PlateProvider>
  );
}
