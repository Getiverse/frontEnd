import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import ImageVideo from "../../../components/ImageVideo";
import Instant from "../../../components/Instant";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  getInstantById,
  getUserById,
  User,
} from "../../../utils/fetch/public/query";

function InstantEmbed() {
  const [publicInstantData, setPublicInstantData] = useState<Instant>();
  const [author, setAuthor] = useState<User>();
  const router = useRouter();
  const idInstant = router.query.id as string;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (idInstant) {
        getInstantById(idInstant).then((val) => setPublicInstantData(val));
      }
    }
    fetchData();
  }, [idInstant]);

  useEffect(() => {
    if (publicInstantData && publicInstantData?.userId)
      getUserById(publicInstantData?.userId).then((val) => {
        setAuthor(val);
        setLoading(false);
      });
  }, [publicInstantData]);

  return (
    <Fragment>
      <LoadingSpinner open={loading} />
      {!loading && (
        <button
          className="w-full h-screen relative"
          onClick={() =>
            window.open(
              process.env.NEXT_PUBLIC_HOST + "/instants?instantId=" + idInstant,
              "_blank"
            )
          }
        >
          <h4 className="font-bold text-3xl text-white z-20 absolute bottom-24 px-5">
            {publicInstantData?.title}
          </h4>
          <ImageVideo src={publicInstantData?.image} />
          <div className="absolute w-full h-screen top-0 left-0 bg-gradient-to-b from-black via-transparent to-black opacity-40 z-10" />
          <div className="flex w-full justify-between px-4 absolute bottom-4 left-0 z-20">
            <div className="flex items-center space-x-2 ">
              <img
                src={author?.profileImage}
                alt="user profile image"
                className="rounded-full w-9 h-9 object-cover"
              />
              <div className="text-white flex flex-col flex-start ">
                <h5 className="font-bold text-xs">{author?.userName}</h5>
                <small className="font-light text-xs text-left">
                  {publicInstantData &&
                    /**@ts-ignore */
                    new Date(publicInstantData?.createdAt).toLocaleString(
                      "default",
                      {
                        month: "long",
                        day: "2-digit",
                      }
                    )}
                </small>
              </div>
            </div>
            <Link
              target={"_blank"}
              href={process.env.NEXT_PUBLIC_HOST + "/access/login"}
              className={`text-white
           px-2 text-sm rounded-xl flex items-center font-bold z-50 bg-gray-950 opacity-60 hover:bg-gray-800`}
            >
              <Image
                src="/icons/getiverse.svg"
                width={19}
                height={16}
                alt="getiverse logo"
                className="mr-2"
              />
              Subscribe
            </Link>
          </div>
        </button>
      )}
    </Fragment>
  );
}

export default InstantEmbed;
