import { useRouter } from "next/router";
import Button from "../../../components/buttons/Button";
import Container from "../../../components/container/Container";
import CreateHeader from "../../../components/logged_in/layout/CreateHeader";
import Progressbar from "../../../components/Progressbar";
import ArticleEditor from "../../../components/editor/articles/Editor";
import RoutingGuard from "../../../components/RoutingGuard";
import PostCreationInformation from "../../../components/specialModals/PostCreationInformation";
import { toast } from "react-toastify";
import { extractTextFromContent } from "../../../utils/functions";
import { useRecoilValue } from "recoil";
import { createdArticle } from "../../../utils/atoms/createdArticle";
import { useEffect } from "react";
import { TooltipProvider } from "@/components/plate-ui/tooltip";
function Step3() {
  const router = useRouter();
  const article = useRecoilValue(createdArticle);
  const editId = router.query.editId;

  function validateStep3(text: string) {
    if (text.length < 100) {
      toast.error("Article size must be more than 100 words");
      return false;
    }
    return true;
  }
  useEffect(() => {
    if (
      article.content.length > 2000 &&
      extractTextFromContent(article.content).length > 3000
    ) {
      toast.info("Article size should be less than 3000 words");
    }
  }, [article]);

  return (
    <TooltipProvider
      disableHoverableContent
      delayDuration={10}
      skipDelayDuration={0}
    >
      <RoutingGuard>
        <PostCreationInformation text="Preview your instant is complete after you publish the instant it will be visible to all the People on Getiverse" />
        <Container
          bg="bg-white"
          className="flex flex-col px-6"
          relative={false}
        >
          <CreateHeader title="Text" />
          <Progressbar id="text" value="60" />
          <main className="mt-10 flex-1 flex flex-col items-end w-full">
            <ArticleEditor />
            <p className="mr-2 mt-2 text-blue-500">
              {extractTextFromContent(article.content).length}
            </p>
          </main>

          <div className="w-full flex justify-around h-10 mb-12">
            <Button
              onClick={() => router.back()}
              type="secondary"
              text="Back"
              className="w-32"
              padding="py-3"
            />
            <Button
              onClick={() => {
                if (!validateStep3(extractTextFromContent(article.content))) {
                  return;
                }
                if (editId)
                  router.push("/create/article/step-4?editId=" + editId);
                else router.push("/create/article/step-4");
              }}
              type="primary"
              text="Next"
              className="w-32"
              padding="py-3"
            />
          </div>
        </Container>
      </RoutingGuard>
    </TooltipProvider>
  );
}

export default Step3;
