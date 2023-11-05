import { NextPage } from "next";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import Container from "../../../components/container/Container";
import Title from "../../../components/Title";
import Text from "../../../components/Text";
import Category from "../../../components/Category";
import { useState } from "react";
import CreateHeader from "../../../components/logged_in/layout/CreateHeader";
import Button from "../../../components/buttons/Button";
import Progressbar from "../../../components/Progressbar";
import { createdArticle } from "../../../utils/atoms/createdArticle";
import { useQuery } from "@apollo/client";
import { GraphqlCategory } from "../../../graphql/types/category";
import { GET_ALL_CATEGORIES } from "../../../graphql/query/category";
import RoutingGuard from "../../../components/RoutingGuard";
import PostCreationInformation from "../../../components/specialModals/PostCreationInformation";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../components/LoadingSpinner";

const Step4: NextPage = () => {
  const router = useRouter();
  const [article, setArticle] = useRecoilState(createdArticle);
  const [selectedCategories, setSelectedCategories] = useState(
    article.categories
  );
  const editId = router.query.editId;
  const { loading, error, data, refetch } = useQuery<{
    findAllCategories: GraphqlCategory[];
  }>(GET_ALL_CATEGORIES);

  function validateStep4(categoriesLength: number) {
    if (categoriesLength == 0) {
      toast.error("Please select at least one category");
      return false;
    } else if (categoriesLength > 3) {
      toast.error("You can select only 3 categories");
      return false;
    }
    return true;
  }

  return (
    <RoutingGuard>
      <PostCreationInformation text="Preview your instant is complete after you publish the instant it will be visible to all the People on Getiverse" />
      <Container
        bg="bg-[url('/category_universe_bg.jpg')] bg-cover"
        className="flex flex-col items-center px-4"
      >
        <LoadingSpinner open={loading} />
        <CreateHeader darkBg={true} title="Categories" />
        <Progressbar darkBg={true} id="title" value="80" />
        <Title
          size="text-xl"
          color="text-gray-300"
          className="text-center pt-2"
          weight="font-medium"
        >
          Chooose a category
        </Title>
        <Text
          className="text-center w-full"
          color="text-gray-100"
          size="text-md"
          weight="font-base"
        >
          You can choose max 3 category.
        </Text>
        <div
          className="h-[calc(100vh-300px)] w-full my-4 grid grid-flow-dense grid-cols-12 gap-2 overflow-scroll justify-center scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {data?.findAllCategories.map(({ name, image, id }) => (
            <Category
              key={id}
              category={name}
              id={id}
              Icon={image}
              selectedCategories={selectedCategories}
              /**@ts-ignore */
              setSelectedCategories={setSelectedCategories}
            />
          ))}
        </div>
        <div className="w-full flex justify-around h-10 mb-12">
          <Button
            onClick={() => {
              setArticle((prev) => ({
                ...prev,
                categories: selectedCategories,
              }));
              router.back();
            }}
            type="secondary"
            text="Back"
            className="w-32"
            padding="py-3"
          />
          {data?.findAllCategories && (
            <Button
              onClick={() => {
                if (!validateStep4(selectedCategories.length)) {
                  return;
                }
                setArticle((prev) => ({
                  ...prev,
                  categories: selectedCategories,
                }));
                if (editId)
                  router.push("/create/article/preview?editId=" + editId);
                else router.push("/create/article/preview");
              }}
              type="primary"
              text="Next"
              className="w-32"
              padding="py-3"
            />
          )}
        </div>
      </Container>
    </RoutingGuard>
  );
};

export default Step4;
