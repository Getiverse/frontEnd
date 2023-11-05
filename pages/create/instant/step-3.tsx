import { useRouter } from "next/router";
import React from "react";
import Container from "../../../components/container/Container";
import CreateHeader from "../../../components/logged_in/layout/CreateHeader";
import Progressbar from "../../../components/Progressbar";
import InstantEditor from "../../../components/editor/instants/Editor";
import Button from "../../../components/buttons/Button";
import PostCreationInformation from "../../../components/specialModals/PostCreationInformation";
import RoutingGuard from "../../../components/RoutingGuard";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import { createdInstant } from "../../../utils/atoms/createdInstant";
import { extractTextFromContent } from "../../../utils/functions";
import { TooltipProvider } from "@/components/plate-ui/tooltip";

function Step3() {
  const router = useRouter();
  const instant = useRecoilValue(createdInstant);
  const editId = router.query.editId;

  function validateStep3(text: string) {
    if (text.length < 10) {
      toast.error("the Instant size must be more than 10 words");
      return false;
    } else if (text.length > 500) {
      toast.error("Instant size must be less than 500 words");
      return false;
    }
    return true;
  }
  return (
    <TooltipProvider
      disableHoverableContent
      delayDuration={10}
      skipDelayDuration={0}
    >
      <RoutingGuard>
        <PostCreationInformation text="Instant Text are short description about a fact, idea, feeling ... MUST BE SHORT" />
        <Container bg="bg-white" className="flex flex-col px-6 relative">
          <CreateHeader title="Text" />
          <Progressbar id="text" value="60" />
          <main className="flex-1 mt-12 relative flex flex-col items-end ">
            <InstantEditor />
            <p className="mr-2 mt-2 text-blue-500">
              {extractTextFromContent(instant.content).length}
            </p>
          </main>
          <div className="w-full flex justify-around h-10 mb-12 mt-12">
            <Button
              onClick={() => router.back()}
              type="secondary"
              text="Back"
              className="w-32"
              padding="py-3"
            />
            <Button
              onClick={() => {
                if (!validateStep3(extractTextFromContent(instant.content))) {
                  return;
                }
                if (editId)
                  router.push("/create/instant/step-4?editId=" + editId);
                else router.push("/create/instant/step-4");
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
