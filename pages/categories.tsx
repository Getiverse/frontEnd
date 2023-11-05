import { NextPage } from "next";
import Container from "../components/container/Container";
import Text from "../components/Text";
import Title from "../components/Title";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/router";
import Category from "../components/Category";
import { GraphqlCategory } from "../graphql/types/category";
import { GET_ALL_CATEGORIES } from "../graphql/query/category";
import { useQuery } from "@apollo/client";
import RoutingGuard from "../components/RoutingGuard";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { GET_MY_PROFILE_PRIMARY_STATS } from "../graphql/query/me";
import { toast } from "react-toastify";

const Categories: NextPage = () => {
  const router = useRouter();
  const { rollback } = router.query;
  const [selectedCategories, setSelectedCategories] = useState<
    string[] | string | undefined
  >([]);
  const { loading, error, data, refetch } = useQuery<{
    findAllCategories: GraphqlCategory[];
  }>(GET_ALL_CATEGORIES);

  const { loading: loadingSelectedCategories, data: selectedCategoriesInit } =
    useQuery<GET_MY_PROFILE_PRIMARY_STATS>(GET_MY_PROFILE_PRIMARY_STATS);

  useEffect(() => {
    if (selectedCategoriesInit?.me.selectedCategories)
      setSelectedCategories(selectedCategoriesInit?.me.selectedCategories);
  }, [selectedCategoriesInit?.me.selectedCategories]);

  return (
    <RoutingGuard>
      <Container
        bg="bg-[url('/category_universe_bg.jpg')] object-cover"
        className="flex flex-col items-center px-4"
      >
        <LoadingSpinner open={loading || loadingSelectedCategories} />
        <div className="mt-6 relative w-full">
          <IoIosArrowBack
            color="white"
            className="absolute"
            size={30}
            onClick={() => router.back()}
          />
          <Text
            className="text-center w-full"
            color="text-gray-50"
            size="text-lg"
            weight="font-normal"
          >
            Welcome to Getiverse
          </Text>
        </div>
        <Title
          size="text-2xl"
          color="text-gray-300"
          className="text-center mt-8"
          weight="font-bold"
        >
          What are you interested in?
        </Title>
        <Text
          className="text-center w-full"
          color="text-gray-100"
          size="text-md"
          weight="font-thin"
        >
          Chooose one or more.
        </Text>
        {!loading && !loadingSelectedCategories && (
          <div
            className="h-[calc(100vh-240px)] w-full my-4 grid grid-flow-dense grid-cols-12 gap-2 overflow-y-scroll justify-center scrollbar-hide"
            style={{ scrollbarWidth: "none" }}
          >
            {data?.findAllCategories.map(({ name, id, image }) => (
              <Category
                key={id}
                category={name}
                id={id}
                Icon={image}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
              />
            ))}
          </div>
        )}
        {!loading && (
          <div className="h-16 pb-6 w-full flex justify-end">
            <button
              className="bg-white rounded-2xl text-blue-500 px-6 "
              onClick={() =>
                rollback
                  ? router.back()
                  : handleCategoriesChecks(selectedCategories?.length) &&
                    router.push("/authors")
              }
            >
              {rollback ? "FINISH " : "NEXT"}
            </button>
          </div>
        )}
      </Container>
    </RoutingGuard>
  );
};

function handleCategoriesChecks(categoriesLength: number | undefined) {
  if (!categoriesLength || categoriesLength < 3) {
    toast.error("Please select at least three categories");
    return false;
  }
  return true;
}

export default Categories;
