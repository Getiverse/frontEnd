import React from "react";
import {
  MARK_BOLD,
  MARK_ITALIC,
  MARK_UNDERLINE,
} from "@udecode/plate-basic-marks";
import { usePlateReadOnly } from "@udecode/plate-common";

import { Icons } from "@/components/icons";
import { LinkToolbarButton } from "@/components/plate-ui/link-toolbar-button";

import { MarkToolbarButton } from "./mark-toolbar-button";
import { MoreDropdownMenu } from "./more-dropdown-menu";
import { TurnIntoDropdownMenu } from "./turn-into-dropdown-menu";

export function FloatingToolbarButtons({
  instant = false,
}: {
  instant?: boolean;
}) {
  const readOnly = usePlateReadOnly();

  return (
    <>
      {!readOnly && (
        <>
          {!instant && <TurnIntoDropdownMenu />}
          <MarkToolbarButton nodeType={MARK_BOLD} tooltip="Bold (⌘+B)">
            <Icons.bold />
          </MarkToolbarButton>
          <MarkToolbarButton nodeType={MARK_ITALIC} tooltip="Italic (⌘+I)">
            <Icons.italic />
          </MarkToolbarButton>
          <MarkToolbarButton
            nodeType={MARK_UNDERLINE}
            tooltip="Underline (⌘+U)"
          >
            <Icons.underline />
          </MarkToolbarButton>
        </>
      )}

      {/* <CommentToolbarButton /> */}

      <MoreDropdownMenu />
    </>
  );
}
