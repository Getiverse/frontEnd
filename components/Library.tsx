import Image from "next/image";
import { useRouter } from "next/router";
import { CSSProperties } from "react";
import { MdOutlinePublic, MdOutlinePublicOff } from "react-icons/md";
import { handleImageType } from "../utils/functions";
import Text from "./Text";
import Title from "./Title";
import empty from "/public/emptyLibrary.png";

function Library({
  title,
  instants,
  articles,
  image,
  isPrivate,
  id,
  style,
}: {
  title: string;
  instants: number;
  articles: number;
  image: string;
  isPrivate: boolean;
  id: string;
  style: CSSProperties;
}) {
  const router = useRouter();

  return (
    <div
      style={style}
      className="relative rounded-2xl cursor-pointer"
      onClick={() => router.push("/library/" + title + "?id=" + id)}
    >
      {isPrivate ? (
        <MdOutlinePublicOff
          size={27}
          className="text-white absolute top-4 right-4 z-20"
        />
      ) : (
        <MdOutlinePublic
          size={27}
          className="text-white absolute top-4 right-4 z-20"
        />
      )}
      <Image
        src={image ? handleImageType(image) : empty}
        fill
        loading="lazy"
        alt="universe image"
        className="object-cover rounded-2xl"
      />
      <div className="w-full h-full absolute">
        <div className="w-full h-full bg-gradient-to-b from-black via-transparent to-black opacity-70 z-10 rounded-2xl" />
      </div>
      <Title
        color="text-white"
        size="text-xl"
        weight="font-medium"
        className="z-30 px-5 absolute bottom-10"
      >
        {title}
      </Title>
      <Text
        color="text-slate-300"
        size="text-xs"
        weight="font-base"
        className="z-30 px-5 text-center absolute bottom-5"
      >
        {articles} articoli - {instants} instants
      </Text>
    </div>
  );
}

export default Library;
