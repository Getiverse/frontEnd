import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { Rating } from "react-simple-star-rating";
import { toast } from "react-toastify";
import { ADD_RATING, EDIT_RATING } from "../graphql/mutation/me";
import { GET_ARTICLE_BY_ID } from "../graphql/query/article";
import { FIND_INSTANT_BY_ID } from "../graphql/query/instant";
import {
  FIND_RATINGS_BY_POST_ID,
  FIND_RATING_BY_ID,
} from "../graphql/query/rating";
import { PostType } from "../graphql/types/enums";
import useUid from "../hooks/useUid";
import { RATINGS_PAGEABLE_SIZE } from "../utils/constants";
import Button from "./buttons/Button";
import CustomTextArea from "./CustomTextArea";
import LoadingBlock from "./LoadingBlock";
import Text from "./Text";

function AddRating({ ratingId }: { ratingId?: string }) {
  const [ratingStars, setRatingStars] = useState<number>(0);
  const [ratingComment, setRatingComment] = useState("");
  const router = useRouter();
  const isEditable = router.query.isEditable === "true";
  const postId = router.query.postId;
  const postType = router.query.type;
  const {
    data: rating,
    loading: ratingLoading,
    refetch: myRatingRefetch,
  } = useQuery<FIND_RATING_BY_ID>(FIND_RATING_BY_ID, {
    variables: {
      skip: !ratingId || !isEditable,
      type: ratingId,
    },
  });
  const uid = useUid();

  useEffect(() => {
    if (rating && isEditable) {
      setRatingComment(rating.findRatingById.comment);
      setRatingStars(rating.findRatingById.stars);
    }
  }, [rating]);

  const handleRating = (rate: number) => {
    setRatingStars(rate);
  };

  const [addRating, { data: addedRating, loading: loadingRating }] =
    useMutation<ADD_RATING>(ADD_RATING);

  const [editRating, { data: editedRating, loading: loadingUpdate }] =
    useMutation<EDIT_RATING>(EDIT_RATING);

  return (
    <div className="border-b py-5 px-5 flex flex-col items-center space-y-3 border-gray-300 dark:border-gray-700">
      <Text weight="font-semibold" size="text-2xl" className="pb-5">
        Do you Like the Post?
      </Text>
      {loadingRating ||
        (loadingUpdate ? (
          <LoadingBlock />
        ) : (
          <Fragment>
            <Rating
              emptyStyle={{ display: "flex" }}
              fillStyle={{ display: "-webkit-inline-box" }}
              size={45}
              initialValue={ratingStars}
              onClick={handleRating}
              transition
            />
            <CustomTextArea
              value={ratingComment}
              onChange={(e) => setRatingComment(e.currentTarget.value)}
              height="h-24"
              className="py-5"
              placeHolder="Enter the message"
            />
            <Button
              text="Submit"
              type="primary"
              className="w-32"
              disabled={loadingRating || loadingUpdate}
              padding="py-2 "
              onClick={() => {
                if (isEditable) {
                  !loadingUpdate &&
                    editRating({
                      variables: {
                        type: {
                          stars:
                            ratingStars > 0
                              ? ratingStars
                              : rating?.findRatingById.stars,
                          comment: ratingComment,
                          postId: router.query.postId,
                          previousStars: rating?.findRatingById.stars,
                          ratingId: ratingId,
                          postType:
                            router.query.type == "ARTICLE"
                              ? PostType.ARTICLE
                              : PostType.INSTANT,
                        },
                      },
                      update: async (cache, { data, errors }) => {
                        if (errors) {
                          toast.error(errors.toString());
                          return;
                        }
                        const cachedLibraries =
                          await cache.readQuery<FIND_RATINGS_BY_POST_ID>({
                            query: FIND_RATINGS_BY_POST_ID,
                            variables: {
                              postId: postId,
                              postType: postType,
                              page: {
                                page: 0,
                                size: RATINGS_PAGEABLE_SIZE,
                              },
                            },
                          });
                        if (cachedLibraries?.findRatingsByPostId.data && data) {
                          await cache.writeQuery({
                            query: FIND_RATINGS_BY_POST_ID,
                            variables: {
                              postId: postId,
                              postType: postType,
                              page: {
                                page: 0,
                                size: RATINGS_PAGEABLE_SIZE,
                              },
                            },
                            data: {
                              findRatingsByPostId: {
                                count:
                                  cachedLibraries?.findRatingsByPostId.count,
                                data: [
                                  {
                                    id: data.editRating.id,
                                    userId: uid,
                                    stars: ratingStars,
                                    createdAt: data.editRating.createdAt,
                                    comment: ratingComment,
                                    usefulRating: [],
                                    notUsefulRating: [],
                                    postId: postId,
                                    postType:
                                      router.query.type == "ARTICLE"
                                        ? PostType.ARTICLE
                                        : PostType.INSTANT,
                                  },
                                  ...cachedLibraries?.findRatingsByPostId.data.map(
                                    (val) =>
                                      val.id == ratingId
                                        ? {
                                            ...val,
                                            comment: ratingComment,
                                            stars: ratingStars,
                                            createdAt:
                                              data.editRating.createdAt,
                                          }
                                        : val
                                  ),
                                ],
                              },
                            },
                          });

                          if (postType == PostType.ARTICLE && rating) {
                            const cachedArticle =
                              await cache.readQuery<GET_ARTICLE_BY_ID>({
                                query: GET_ARTICLE_BY_ID,
                                variables: {
                                  type: postId,
                                },
                              });
                            if (cachedArticle?.findArticleById)
                              await cache.writeQuery({
                                query: GET_ARTICLE_BY_ID,
                                variables: {
                                  type: postId,
                                },
                                data: {
                                  findArticleById: {
                                    ...cachedArticle?.findArticleById,
                                    ratingSum:
                                      cachedArticle?.findArticleById.ratingSum +
                                      (ratingStars -
                                        rating.findRatingById.stars),
                                  },
                                },
                              });
                          } else if (rating) {
                            const cachedInstant =
                              await cache.readQuery<FIND_INSTANT_BY_ID>({
                                query: FIND_INSTANT_BY_ID,
                                variables: {
                                  type: postId,
                                },
                              });
                            if (cachedInstant)
                              await cache.writeQuery({
                                query: FIND_INSTANT_BY_ID,
                                variables: {
                                  type: postId,
                                },
                                data: {
                                  findInstantById: {
                                    ...cachedInstant?.findInstantById,
                                    ratingSum:
                                      cachedInstant?.findInstantById.ratingSum +
                                      (ratingStars -
                                        rating.findRatingById.stars),
                                  },
                                },
                              });
                          }
                          const ratingCache =
                            await cache.readQuery<FIND_RATING_BY_ID>({
                              query: FIND_RATING_BY_ID,
                              variables: {
                                type: ratingId,
                              },
                            });
                          if (ratingCache) {
                            await cache.writeQuery({
                              query: FIND_RATING_BY_ID,
                              variables: {
                                type: ratingId,
                              },
                              data: {
                                findRatingById: {
                                  ...ratingCache?.findRatingById,
                                  stars: ratingStars,
                                },
                              },
                            });
                          }
                        }
                        router.replace(
                          router.asPath.replace("&isEditable=true", "")
                        );
                      },
                    });
                } else {
                  !loadingRating &&
                    addRating({
                      variables: {
                        type: {
                          stars: ratingStars,
                          comment: ratingComment,
                          postId: router.query.postId,
                          postType:
                            router.query.type == "ARTICLE"
                              ? PostType.ARTICLE
                              : PostType.INSTANT,
                        },
                      },
                      update: async (cache, { data, errors }) => {
                        if (errors) {
                          toast.error(errors.toString());
                          return;
                        }
                        const cachedLibraries =
                          await cache.readQuery<FIND_RATINGS_BY_POST_ID>({
                            query: FIND_RATINGS_BY_POST_ID,
                            variables: {
                              postId: postId,
                              postType: postType,
                              page: {
                                page: 0,
                                size: RATINGS_PAGEABLE_SIZE,
                              },
                            },
                          });
                        if (cachedLibraries?.findRatingsByPostId.data && data) {
                          await cache.writeQuery({
                            query: FIND_RATINGS_BY_POST_ID,
                            variables: {
                              postId: postId,
                              postType: postType,
                              page: {
                                page: 0,
                                size: RATINGS_PAGEABLE_SIZE,
                              },
                            },
                            data: {
                              findRatingsByPostId: {
                                count:
                                  cachedLibraries?.findRatingsByPostId.count +
                                  1,
                                data: [
                                  {
                                    id: data.addRating.id,
                                    userId: uid,
                                    stars: ratingStars,
                                    createdAt: data.addRating.createdAt,
                                    comment: ratingComment,
                                    usefulRating: [],
                                    notUsefulRating: [],
                                    postId: postId,
                                    postType:
                                      router.query.type == "ARTICLE"
                                        ? PostType.ARTICLE
                                        : PostType.INSTANT,
                                  },
                                  ...cachedLibraries?.findRatingsByPostId.data,
                                ],
                              },
                            },
                          });
                        }
                        if (postType == PostType.ARTICLE && rating) {
                          const cachedArticle =
                            await cache.readQuery<GET_ARTICLE_BY_ID>({
                              query: GET_ARTICLE_BY_ID,
                              variables: {
                                type: postId,
                              },
                            });
                          if (cachedArticle?.findArticleById)
                            await cache.writeQuery({
                              query: GET_ARTICLE_BY_ID,
                              variables: {
                                type: postId,
                              },
                              data: {
                                findArticleById: {
                                  ...cachedArticle?.findArticleById,
                                  ratingSum:
                                    cachedArticle?.findArticleById.ratingSum +
                                    ratingStars,
                                },
                              },
                            });
                        } else if (rating) {
                          const cachedInstant =
                            await cache.readQuery<FIND_INSTANT_BY_ID>({
                              query: FIND_INSTANT_BY_ID,
                              variables: {
                                type: postId,
                              },
                            });
                          if (cachedInstant)
                            await cache.writeQuery({
                              query: FIND_INSTANT_BY_ID,
                              variables: {
                                type: postId,
                              },
                              data: {
                                findInstantById: {
                                  ...cachedInstant?.findInstantById,
                                  ratingSum:
                                    cachedInstant?.findInstantById.ratingSum +
                                    ratingStars,
                                },
                              },
                            });
                        }
                        const ratingCache =
                          await cache.readQuery<FIND_RATING_BY_ID>({
                            query: FIND_RATING_BY_ID,
                            variables: {
                              type: ratingId,
                            },
                          });
                        if (ratingCache) {
                          await cache.writeQuery({
                            query: FIND_RATING_BY_ID,
                            variables: {
                              type: ratingId,
                            },
                            data: {
                              findRatingById: {
                                ...ratingCache?.findRatingById,
                                stars: ratingStars,
                              },
                            },
                          });
                        }
                        toast.success("Rating added with success");
                        router.replace(
                          router.asPath.replace("&isEditable=true", "")
                        );
                      },
                    });
                }
              }}
            />
          </Fragment>
        ))}
    </div>
  );
}

export default AddRating;
