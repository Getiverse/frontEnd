import React, { Fragment } from "react";
import {
  MARK_BOLD,
  MARK_ITALIC,
  MARK_UNDERLINE,
} from "@udecode/plate-basic-marks";
import { ListStyleType } from "@udecode/plate-indent-list";
import { Bold, Italic, Underline } from "lucide-react";

import { EmojiDropdownMenu } from "./emoji-dropdown-menu";
import { FixedToolbar } from "./fixed-toolbar";
import { IndentListToolbarButton } from "./indent-list-toolbar-button";
import { LinkToolbarButton } from "./link-toolbar-button";
import { MarkToolbarButton } from "./mark-toolbar-button";
import { MoreDropdownMenu } from "./more-dropdown-menu";
import { TableDropdownMenu } from "./table-dropdown-menu";
import { ToolbarGroup } from "./toolbar";

function MobileFloatingToolbar({ instant = false }: { instant?: boolean }) {
  return (
    <div className="w-full fixed bottom-0 left-0 md:hidden border-t-2">
      <FixedToolbar>
        <ToolbarGroup>
          <MarkToolbarButton tooltip="Bold (⌘+B)" nodeType={MARK_BOLD}>
            <Bold />
          </MarkToolbarButton>
          <MarkToolbarButton tooltip="Italic (⌘+I)" nodeType={MARK_ITALIC}>
            <Italic />
          </MarkToolbarButton>
          <MarkToolbarButton
            tooltip="Underline (⌘+U)"
            nodeType={MARK_UNDERLINE}
          >
            <Underline />
          </MarkToolbarButton>
          {!instant && (
            <Fragment>
              <TableDropdownMenu />
              {/* <EmojiDropdownMenu /> */}
              <IndentListToolbarButton nodeType={ListStyleType.Disc} />
              <IndentListToolbarButton nodeType={ListStyleType.Decimal} />
              <MoreDropdownMenu />
            </Fragment>
          )}
          <LinkToolbarButton />
        </ToolbarGroup>
      </FixedToolbar>
    </div>
  );
}

export default MobileFloatingToolbar;
