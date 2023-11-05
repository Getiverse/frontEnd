import React, { useEffect, useState } from "react";
import {
  generateSrcAndSrcSet,
  PlateCloudEditor,
  TCloudImageElement,
  Upload,
} from "@udecode/plate-cloud";
import {
  findNodePath,
  PlateElement,
  PlateElementProps,
  usePlateEditorRef,
  Value,
} from "@udecode/plate-common";

import { cn } from "@/lib/utils";

import { ResizeControls } from "./cloud-resize-controls";
import { StatusBar } from "./cloud-status-bar";
import { useFocused, useSelected } from "slate-react";
import { setNodes } from "slate";
import { zoomImageState } from "../../../../utils/atoms/zoomImage";
import { useRecoilState } from "recoil";

export interface CloudImageElementProps
  extends PlateElementProps<Value, TCloudImageElement> {}

export function CloudImageElement({
  className,
  ...props
}: CloudImageElementProps) {
  const { children, element } = props;
  const { focused, selected, src, srcSet, size, upload, setSize } =
    useCloudImageElementStateCustom({ element });
  const [zoomImage, setZoomImage] = useRecoilState(zoomImageState);
  return (
    <PlateElement
      className={cn("relative my-4 flex items-center justify-center", className)}
      // draggable
      {...props}
    >
      <span
        contentEditable={false}
        style={{
          /**
           * NOTE:
           * This code pretty much needs to be this way or things stop working
           * so this cannot be overrided in the `.styles.ts` file.
           */
          position: "relative",
          display: "inline-block",
          /**
           * This is required so that we don't get an extra gap at the bottom.
           * When display is 'inline-block' we get some extra space at the bottom
           * for the descenders because the content is expected to co-exist with text.
           *
           * Setting vertical-align to top, bottom or middle fixes this because it is
           * no longer baseline which causes the issue.
           *
           * This is usually an issue with 'img' but also affects this scenario.
           *
           * https://stackoverflow.com/questions/5804256/image-inside-div-has-extra-space-below-the-image
           *
           * Also, make sure that <img> on the inside is display: 'block'.
           */
          verticalAlign: "top",
          /**
           * Disable user select. We use our own selection display.
           */
          userSelect: "none",
        }}
      >
        {src === "" ? (
          <div
            className={cn(
              "block rounded-lg",
              focused && selected && "shadow-[0_0_1px_3px_#60a5fa]"
            )}
            style={{
              width: size.width,
              height: size.height,
              background: "#e0e0e0",
            }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            onClick={() => setZoomImage(src)}
            className={cn(
              "block rounded-lg",
              focused && selected && "shadow-[0_0_1px_3px_#60a5fa]"
            )}
            src={src}
            srcSet={srcSet}
            width={size.width}
            height={size.height}
            alt=""
          />
        )}
        <div className="absolute inset-x-2 top-[50%] -mt-2">
          <StatusBar upload={upload} />
        </div>
        {selected && focused && (
          <ResizeControls element={element} size={size} setSize={setSize} />
        )}
      </span>
      {children}
    </PlateElement>
  );
}

export const useCloudImageElementStateCustom = ({
  element,
}: {
  element: TCloudImageElement;
}) => {
  const editor = usePlateEditorRef();
  const upload = useUploadCustom(element.url);

  const url = upload.status === "not-found" ? undefined : upload.url;

  useEffect(() => {
    /**
     * We only want to update the actual URL of the element if the URL is not
     * a blob URL and if it's different from the current URL.
     *
     * NOTE:
     *
     * If the user does an undo, this may cause some issues. The ideal solution
     * is to change the URL once the upload is complete to the final URL and
     * change the edit history so that the initial insertion of the cloud image
     * appears to have the final URL.
     */
    if (
      typeof url === "string" &&
      !url.startsWith("blob:") &&
      url !== element.url
    ) {
      const path = findNodePath(editor, element);
      setNodes<TCloudImageElement>(
        /**@ts-ignore */
        editor,
        { url },
        {
          at: path,
        }
      );
    }
  }, [editor, element, url]);

  const [size, setSize] = useState<{ width: number; height: number }>({
    width: element.width,
    height: element.height,
  });

  useEffect(() => {
    setSize({ width: element.width, height: element.height });
  }, [element.width, element.height]);

  const selected = useSelected();
  const focused = useFocused();

  const { src, srcSet } = generateSrcAndSrcSet({
    url: upload.status === "not-found" ? undefined : upload.url,
    size: [element.width, element.height],
    maxSize: [element.maxWidth, element.maxHeight],
  });

  return {
    focused,
    selected,
    src,
    srcSet,
    size,
    upload,
    setSize,
  };
};

/**
 * Takes an `element` (which it only needs for its `id`) and returns the
 * Upload object from it.
 */
export const useUploadCustom = (id: string): Upload => {
  const editor = usePlateEditorRef() as PlateCloudEditor;

  /**
   * We call this even if it's not always required because it calls `useStore`
   * which is a React hook which means it needs to be called consistently.
   */
  // const upload: Upload = editor.cloud.useUploadStore(
  //   (state) => state.uploads[id] || { status: 'not-found' }
  // );

  const upload: Upload = editor.cloud.uploadStore.use.upload(id) || {
    status: "not-found",
  };
  console.info(upload.status);

  // (
  //   (state) => state.uploads[id] || { status: 'not-found' }
  // );
  if (id.includes("/")) {
    return {
      status: "success",
      url: id,
    };
  }
  return upload;
};
