import React, { Fragment } from "react";
import {
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_UNDERLINE,
} from "@udecode/plate-basic-marks";
import { usePlateEditorState, usePlateReadOnly } from "@udecode/plate-common";
import { ListStyleType } from "@udecode/plate-indent-list";
import { ELEMENT_IMAGE } from "@udecode/plate-media";

import { Icons } from "@/components/icons";
import { EmojiDropdownMenu } from "@/components/plate-ui/emoji-dropdown-menu";
import { LinkToolbarButton } from "@/components/plate-ui/link-toolbar-button";
import { MediaToolbarButton } from "@/components/plate-ui/media-toolbar-button";
import { MoreDropdownMenu } from "@/components/plate-ui/more-dropdown-menu";
import { TableDropdownMenu } from "@/components/plate-ui/table-dropdown-menu";

import { IndentListToolbarButton } from "./indent-list-toolbar-button";
import { InsertDropdownMenu } from "./insert-dropdown-menu";
import { MarkToolbarButton } from "./mark-toolbar-button";
import { ToolbarButton, ToolbarGroup } from "./toolbar";
import { AiOutlineCheck } from "react-icons/ai";

export function FixedToolbarButtons({
  setOpenNavbar,
  instant = false,
}: {
  setOpenNavbar: React.Dispatch<React.SetStateAction<boolean>> | undefined;
  instant: boolean;
}) {
  const readOnly = usePlateReadOnly();
  const editor = usePlateEditorState();
  return (
    <div className="w-full overflow-hidden">
      <div
        className="flex flex-wrap"
        style={{
          transform: "translateX(calc(-1px))",
        }}
      >
        {!readOnly && (
          <>
            {!instant && (
              <ToolbarGroup noSeparator>
                <InsertDropdownMenu />
              </ToolbarGroup>
            )}
            <ToolbarGroup>
              <ToolbarButton
                className={editor.history.undos.length > 0 ? "" : "opacity-40"}
                onClick={(e) => {
                  e.preventDefault();
                  editor.undo();
                }}
                tooltip="Undo (⌘+Z)"
              >
                <Icons.backward />
              </ToolbarButton>
              <ToolbarButton
                className={editor.history.redos.length > 0 ? "" : "opacity-40"}
                onClick={(e) => {
                  e.preventDefault();
                  editor.redo();
                }}
                tooltip="Redo (⌘+SHIFT Z)"
              >
                <Icons.forward />
              </ToolbarButton>
            </ToolbarGroup>
            <div className="hidden lg:flex items-center">
              <ToolbarGroup>
                <MarkToolbarButton tooltip="Bold (⌘+B)" nodeType={MARK_BOLD}>
                  <Icons.bold />
                </MarkToolbarButton>
                <MarkToolbarButton
                  tooltip="Italic (⌘+I)"
                  nodeType={MARK_ITALIC}
                >
                  <Icons.italic />
                </MarkToolbarButton>
                <MarkToolbarButton
                  tooltip="Underline (⌘+U)"
                  nodeType={MARK_UNDERLINE}
                >
                  <Icons.underline />
                </MarkToolbarButton>
                {!instant && (
                  <Fragment>
                    <IndentListToolbarButton nodeType={ListStyleType.Disc} />
                    <IndentListToolbarButton nodeType={ListStyleType.Decimal} />
                  </Fragment>
                )}
              </ToolbarGroup>
            </div>
            <div className="hidden lg:flex items-center">
              <ToolbarGroup>
                <LinkToolbarButton />
                {!instant && (
                  <Fragment>
                    <TableDropdownMenu />

                    <EmojiDropdownMenu />

                    <MoreDropdownMenu />
                  </Fragment>
                )}
              </ToolbarGroup>
            </div>
            <div className="w-full flex-1 justify-end flex pr-2 items-center">
              <ToolbarButton
                onClick={(e) => {
                  setOpenNavbar && setOpenNavbar(false);
                }}
              >
                <AiOutlineCheck size={20} className="text-blue-500" />
              </ToolbarButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
