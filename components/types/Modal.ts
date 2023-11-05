import { ReactNode } from "react";

export type Modal = {
  open: boolean;
  callBack: (value: boolean) => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  height?: string;
  Footer?: ReactNode;
};

export enum ModalType {
  MORE = "more",
  REPORT = "report",
  WRITE = "write",
  SHARE = "share",
  WEB_SHARE_LINK = "web_share_link",
  HUMAN_VERIFICATION = "human_verification",
  ARTICLE = "article",
  FONT_SETTINGS = "font_settings",
  INDEX = "index",
  PUBLISH = "publish",
  DESCRIPTION = "description",
  SEARCH_FILTER = "search_filter",
  MY_PROFILE = "my_profile",
  SAVE_TO = "save_to",
  NEW_LIBRARY = "new_library",
  SHOW_LINKS_AVAILABLE = "show_links_available",
  ADD_LINKS = "add_links",
  MODIFY_LIBRARY_MODAL = "modify_library_modal",
  QRCODE = "qr_code",
  SHARE_WEB = "share_web",
  REPLY = "reply",
  REPLY_INPUT = "reply_input",
  CONFIRM = "confirm",
  RATING = "rating",
  FORCE_LOGIN = "force_login",
}
