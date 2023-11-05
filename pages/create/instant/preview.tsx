import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue } from "recoil";
import Button from "../../../components/buttons/Button";
import Container from "../../../components/container/Container";
import CreateHeader from "../../../components/logged_in/layout/CreateHeader";
import Text from "../../../components/Text";
import Title from "../../../components/Title";
import { createdInstant } from "../../../utils/atoms/createdInstant";
import ReadOnlyInstantEditor from "../../../components/editor/instants/ReadOnlyInstantEditor";
import { fixImageAndCategories, getDate } from "../../../utils/functions";
import { useMutation } from "@apollo/client";
import { ADD_INSTANT, UPDATE_INSTANT } from "../../../graphql/mutation/instant";
import { useEffect, useRef, useState } from "react";
import DatetimePicker from "../../../components/calendar";
import dayjs, { Dayjs } from "dayjs";
import { PublicDateRange } from "../../../components/calendar/types";
import PublishModal from "../../../components/specialModals/PublishModal";
import { moreModal } from "../../../utils/atoms/moreModal";
import { ModalType } from "../../../components/types/Modal";
import useOutsideClick from "../../../hooks/useOutsideClick";
import LoadingSpinner from "../../../components/LoadingSpinner";
import PostCreationInformation from "../../../components/specialModals/PostCreationInformation";
import Image from "next/image";
import RoutingGuard from "../../../components/RoutingGuard";
import { GET_MY_INSTANTS } from "../../../graphql/query/me";
import { INSTANTS_PAGEABLE_PAGE_SIZE } from "../../../utils/constants";
import useUid from "../../../hooks/useUid";
import {
  FIND_INSTANT_BY_ID,
  GET_INSTANTS_BY_USER_ID,
} from "../../../graphql/query/instant";
import { toast } from "react-toastify";
import { Article } from "../../../components/types/Article";

function Preview() {
  const router = useRouter();
  const [instant, setInstant] = useRecoilState(createdInstant);
  const [showCalendar, setShowCalendar] = useState(false);
  const [openModal, setOpenModal] = useRecoilState(moreModal);

  const uid = useUid();
  const editId = router.query.editId;
  const [updateInstant, { loading: loadingUpdate, data: updateData }] =
    useMutation<Article>(UPDATE_INSTANT, {
      update: async (cache, { data, errors }) => {
        if (errors) {
          toast.error(errors.toString());
          return false;
        }
        if (!loading) {
          const cachedInstants = await cache.readQuery<GET_MY_INSTANTS>({
            query: GET_MY_INSTANTS,
            variables: {
              page: {
                page: 0,
                size: INSTANTS_PAGEABLE_PAGE_SIZE,
              },
            },
          });

          if (cachedInstants)
            await cache.writeQuery({
              query: GET_MY_INSTANTS,
              variables: {
                page: {
                  page: 0,
                  size: INSTANTS_PAGEABLE_PAGE_SIZE,
                },
              },
              data: {
                getMyInstants: {
                  count: cachedInstants?.getMyInstants.count,
                  data: [
                    ...cachedInstants?.getMyInstants.data.map((val) =>
                      val.id == editId
                        ? {
                            ...val,
                            image: instant.image,
                            title: instant.title,
                            content: JSON.stringify(instant.content),
                            categories: instant.categories,
                          }
                        : val
                    ),
                  ],
                },
              },
            });

          const cachedInstant = await cache.readQuery<FIND_INSTANT_BY_ID>({
            query: FIND_INSTANT_BY_ID,
            variables: {
              type: editId,
            },
          });

          if (cachedInstant)
            await cache.writeQuery({
              query: FIND_INSTANT_BY_ID,
              variables: {
                type: editId,
              },
              data: {
                findInstantById: {
                  ...cachedInstant.findInstantById,
                  image: instant.image,
                  title: instant.title,
                  content: JSON.stringify(instant.content),
                  categories: instant.categories,
                },
              },
            });
          const userInstantsCached =
            await cache.readQuery<GET_INSTANTS_BY_USER_ID>({
              query: GET_INSTANTS_BY_USER_ID,
              variables: {
                type: uid,
                page: {
                  page: 0,
                  size: INSTANTS_PAGEABLE_PAGE_SIZE,
                },
              },
            });

          if (userInstantsCached && data) {
            await cache.writeQuery({
              query: GET_INSTANTS_BY_USER_ID,
              variables: {
                type: uid,
                page: {
                  page: 0,
                  size: INSTANTS_PAGEABLE_PAGE_SIZE,
                },
              },
              data: {
                getInstantsByUserId: {
                  count: userInstantsCached.getInstantsByUserId.count,
                  data: [
                    ...userInstantsCached?.getInstantsByUserId.data.map((val) =>
                      val.id == editId
                        ? {
                            ...val,
                            image: instant.image,
                            title: instant.title,
                            content: JSON.stringify(instant.content),
                            categories: instant.categories,
                          }
                        : val
                    ),
                  ],
                },
              },
            });
          }
          setInstant({
            categories: [],
            content: [
              {
                type: "paragraph",
                children: [{ text: "" }],
              },
            ],
            image: "",
            title: "",
            userId: "",
          });
          toast.success("Instant Updated With Success");
          router.replace("/home");
          router.push("/me");
        }
      },
    });

  const [addInstant, { data, loading, error }] = useMutation<{
    id: string;
    createdAt: string;
  }>(ADD_INSTANT, {
    update: async (cache, { data, errors }) => {
      if (errors) {
        toast.error(errors.toString());
        return false;
      }
      if (!loading) {
        const cachedInstants = await cache.readQuery<GET_MY_INSTANTS>({
          query: GET_MY_INSTANTS,
          variables: {
            page: {
              page: 0,
              size: INSTANTS_PAGEABLE_PAGE_SIZE,
            },
          },
        });

        const userInstantsCached =
          await cache.readQuery<GET_INSTANTS_BY_USER_ID>({
            query: GET_INSTANTS_BY_USER_ID,
            variables: {
              type: uid,
              page: {
                page: 0,
                size: INSTANTS_PAGEABLE_PAGE_SIZE,
              },
            },
          });

        if (userInstantsCached && data) {
          await cache.writeQuery({
            query: GET_INSTANTS_BY_USER_ID,
            variables: {
              type: uid,
              page: {
                page: 0,
                size: INSTANTS_PAGEABLE_PAGE_SIZE,
              },
            },
            data: {
              getInstantsByUserId: {
                count: userInstantsCached.getInstantsByUserId.count + 1,
                data: [
                  {
                    userId: uid,
                    image: instant.image,
                    title: instant.title,
                    createdAt: data.createdAt,
                    content: JSON.stringify(instant.content),
                    ratings: [],
                    categories: instant.categories,
                    id: data.id,
                    ratingAverage: 0,
                  },
                  ...userInstantsCached.getInstantsByUserId.data,
                ],
              },
            },
          });
        }
        if (cachedInstants && cachedInstants?.getMyInstants && data) {
          await cache.writeQuery({
            query: GET_MY_INSTANTS,
            variables: {
              page: {
                page: 0,
                size: INSTANTS_PAGEABLE_PAGE_SIZE,
              },
            },
            data: {
              getMyInstants: {
                count: cachedInstants.getMyInstants.count + 1,
                data: [
                  {
                    userId: uid,
                    image: instant.image,
                    title: instant.title,
                    createdAt: data.createdAt,
                    content: JSON.stringify(instant.content),
                    ratings: [],
                    categories: instant.categories,
                    id: data.id,
                    ratingAverage: 0,
                  },
                  ...cachedInstants.getMyInstants.data,
                ],
              },
            },
          });
        } else if (!cachedInstants?.getMyInstants && data) {
          await cache.writeQuery({
            query: GET_MY_INSTANTS,
            variables: {
              page: {
                page: 0,
                size: INSTANTS_PAGEABLE_PAGE_SIZE,
              },
            },
            data: {
              getMyInstants: {
                count: 1,
                data: [
                  {
                    userId: uid,
                    image: instant.image,
                    title: instant.title,
                    createdAt: data.createdAt,
                    content: JSON.stringify(instant.content),
                    ratings: [],
                    categories: instant.categories,
                    id: data.id,
                    ratingAverage: 0,
                  },
                ],
              },
            },
          });
        }
        setInstant({
          categories: [],
          content: [
            {
              type: "paragraph",
              children: [{ text: "" }],
            },
          ],
          image: "",
          title: "",
          userId: "",
        });
        toast.success("Instant Created With Success");
        router.replace("/home");
        router.push("/me");
      }
    },
  });

  const [dateTime, setDateTime] = useState<PublicDateRange>({
    start: dayjs(),
    end: dayjs(),
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownRef, () => {
    if (showCalendar) {
      setShowCalendar(false);
    }
  });
  // async function handleDateTimeSelect() {
  //   !loading &&
  //     addInstant(await fixImageAndCategories(instant, dateTime, false));
  //   setShowCalendar(false);
  // }

  return (
    <RoutingGuard>
      <LoadingSpinner open={loading || loadingUpdate} />
      <PublishModal
        mutatePost={
          !loading && !loadingUpdate && (!updateData || data)
            ? editId != undefined
              ? updateInstant
              : addInstant
            : () => null
        }
        post={instant}
        setShowCalendar={setShowCalendar}
      />
      <PostCreationInformation text="Preview your instant is complete after you publish the instant it will be visible to all the People on Getiverse" />
      <Container
        bg="bg-white"
        className="flex flex-col items-center px-6 relative"
      >
        {/* {showCalendar && (
          <div ref={dropdownRef} className="fixed z-50 bottom-0 w-full">
            <DatetimePicker
              onChange={(nextValue) => setDateTime(nextValue)}
              config={{
                startFrom: dayjs(),
                minDate: dayjs().subtract(1, "days"),
                maxDate: dayjs().add(14, "days"),
                useDoubleCalendars: false,
                useSingleValue: true,
              }}
            />
            <button
              onClick={handleDateTimeSelect}
              className="w-full bg-blue-500 h-12 text-white"
            >
              DONE
            </button>
          </div>
        )} */}
        <CreateHeader darkBg={true} title="Preview" />
        <div className="absolute w-full h-full bg-gradient-to-b from-black via-transparent to-black opacity-40 z-[1]" />
        <ImageVideo src={instant.image} />
        <Title
          className="absolute top-20 left-4 z-[2]"
          color="text-gray-50"
          weight="font-normal"
          size="text-2xl"
        >
          {instant.title}
        </Title>
        <div className="absolute bottom-24 w-full px-2 z-[2]">
          <div className="p-4 bg-gray-600 w-full z-[2] opacity-80 rounded-xl text-white">
            <ReadOnlyInstantEditor />
            <Text
              size="text-sm"
              color="text-white"
              className="mt-1"
              weight="font-thin"
            >
              {getDate()}
            </Text>
          </div>
        </div>
        <div className="w-full flex justify-around h-10 fixed z-[2] bottom-5 left-1/2 -translate-x-1/2 max-w-lg">
          <Button
            disabled={showCalendar}
            onClick={() => router.back()}
            type="secondary"
            text="Back"
            className="w-32"
            padding="py-3"
          />
          <Button
            disabled={showCalendar || loading || data != undefined}
            onClick={() =>
              setOpenModal((prev) => ({
                ...prev,
                open: true,
                type: ModalType.PUBLISH,
              }))
            }
            type="primary"
            text={editId != undefined ? "Edit" : "Publish"}
            className="w-32"
            padding="py-3"
          />
        </div>
      </Container>
    </RoutingGuard>
  );
}

export default Preview;

function ImageVideo({ src }: { src: string }) {
  const isVideo = src.includes("player");
  return isVideo ? (
    <video
      className={`object-cover h-full w-full absolute top-0 left-0`}
      autoPlay
      loop
      src={src}
    />
  ) : (
    <Image src={src} fill className="object-cover w-full h-full" alt="desert" />
  );
}
