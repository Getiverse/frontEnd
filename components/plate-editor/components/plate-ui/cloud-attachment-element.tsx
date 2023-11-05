import React, { useEffect } from "react";
import {
  TCloudAttachmentElement,
  useCloudAttachmentElementState,
} from "@udecode/plate-cloud";
import {
  findNodePath,
  isDefined,
  PlateElement,
  PlateElementProps,
  setNodes,
  usePlateEditorRef,
  Value,
} from "@udecode/plate-common";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

import { StatusBar } from "./cloud-status-bar";
import { useUploadCustom } from "./cloud-image-element";
import { useFocused, useSelected } from "slate-react";
import { toast } from "react-toastify";

export interface CloudAttachmentElementProps
  extends PlateElementProps<Value, TCloudAttachmentElement> {}

export function CloudAttachmentElement({
  className,
  ...props
}: CloudAttachmentElementProps) {
  const { children, element } = props;

  const { focused, selected, upload } = useCloudAttachmentElementStateCustom({
    element,
  });

  if (upload != undefined && upload instanceof Object) {
    return (
      <PlateElement
        className={cn(
          "relative my-4 flex h-16 max-w-xl items-center gap-2 rounded-lg border border-border bg-background p-4",
          focused && selected && "border-blue-400 shadow-[0_0_1px_3px_#60a5fa]",
          className
        )}
        draggable
        {...props}
      >
        <div className="shrink-0 text-muted-foreground" contentEditable={false}>
          <Icons.attachment width={24} height={24} />
        </div>
        <div className="grow" contentEditable={false}>
          <div className="text-base">{element.filename}</div>
          <StatusBar upload={upload}>
            <div className="text-sm text-muted-foreground">
              {element.bytes} bytes
            </div>
          </StatusBar>
        </div>
        <div
          className="ml-4 h-8 w-8 shrink-0 duration-200"
          contentEditable={false}
        >
          {upload.status === "success" && (
            <a href={element.url} target="_blank" rel="noreferrer">
              <Icons.downloadCloud
                className="cursor-pointer text-muted-foreground hover:text-foreground"
                width={24}
                height={24}
              />
            </a>
          )}
        </div>
        {children}
      </PlateElement>
    );
  }

  return (
    <PlateElement
      className={cn(
        "relative my-4 flex h-16 max-w-xl items-center gap-2 rounded-lg border border-border bg-background p-4",
        focused && selected && "border-blue-400 shadow-[0_0_1px_3px_#60a5fa]",
        className
      )}
      draggable
      {...props}
    >
      <div className="shrink-0 text-muted-foreground" contentEditable={false}>
        <Icons.attachment width={24} height={24} />
      </div>
      <div className="grow" contentEditable={false}>
        <div className="text-base">{element.filename} (element type not valid for upload)</div>
        <StatusBar
          upload={{
            status: "error",
            url: "",
            message: "element type not valid for upload",
          }}
        >
          <div className="text-sm text-muted-foreground">
            {element.bytes} bytes
          </div>
        </StatusBar>
      </div>
      {children}
    </PlateElement>
  );
}

export const useCloudAttachmentElementStateCustom = ({
  element,
}: {
  element: TCloudAttachmentElement;
}) => {
  const editor = usePlateEditorRef();
  const selected = useSelected();
  const focused = useFocused();

  const allowedFormatsAttachments = [
    "audio/mpeg",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/webp",
    "image/avif",
    "image/bmp",
    "image/gif",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];
  if (!allowedFormatsAttachments.includes(element.type)) {
    return {
      focused,
      selected,
      upload: "",
    };
  }
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
    if (isDefined(url) && !url.startsWith("blob:") && url !== element.url) {
      const path = findNodePath(editor, element);
      setNodes<TCloudAttachmentElement>(
        editor,
        { url },
        {
          at: path,
        }
      );
    }
  }, [editor, element, url]);

  return {
    focused,
    selected,
    upload,
  };
};
