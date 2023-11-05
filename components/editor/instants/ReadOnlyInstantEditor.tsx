import { useRecoilValue } from "recoil";
import { createdInstant } from "../../../utils/atoms/createdInstant";
import { Descendant } from "slate";
import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("../../plate-editor/components/plate/editor"),
  {
    ssr: false,
  }
);

const ReadOnlyInstantEditor = ({
  content,
  isInsideArticle = false,
}: {
  content?: Descendant[];
  isInsideArticle?: boolean;
}) => {
  const instant = useRecoilValue(createdInstant);
  return (
    <Editor
      instant
      readOnly
      content={content !== undefined ? content : instant.content}
    />
  );
};

export default ReadOnlyInstantEditor;
