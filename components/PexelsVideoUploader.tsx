import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AiOutlineClose, AiOutlinePlayCircle } from "react-icons/ai";
import pexels from "../api/pexels";
import { imageUploaded } from "../utils/atoms/imageUploaded";
import { useRecoilState } from "recoil";
import Text from "./Text";
import { delay } from "../utils/functions";

function PexelsVideoUploader({ setOpen }: { setOpen: (val: boolean) => void }) {
  const MAX_DURATION = 22;
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<any[]>([]);
  const listInnerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState("");

  useEffect(() => {
    fetchPopular(page);
    setPage(1);
  }, []);

  async function fetchData(page: number) {
    try {
      const response = await pexels.get(`/videos/search`, {
        params: {
          query: search,
          per_page: 6,
          page: page,
          size: "small",
          max_duration: MAX_DURATION,
        },
      });
      response.data && setResult((prev) => [...prev, ...response.data.videos]);
    } catch (e) {
      console.log(e);
    }
  }

  const fetchPopular = async (page: number) => {
    const response = await pexels.get(`/videos/popular`, {
      params: {
        per_page: 6,
        page: page,
        size: "small",
        max_duration: MAX_DURATION,
      },
    });
    response.data && setResult((prev) => [...prev, ...response.data.videos]);
  };

  const onScroll = async () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight == scrollHeight) {
        setPage((prev) => prev + 1);
        search.length > 0 ? fetchData(page) : fetchPopular(page);
      }
    }
  };

  return (
    <div
      className="h-full w-full max-w-4xl md:max-h-[600px] md:rounded-lg md:shadow-lg md:left-1/2 md:-translate-x-1/2 md:top-32 absolute left-0 top-0 z-[3] bg-white dark:bg-gray-950 overflow-y-scroll overflow-x-hidden"
      onScroll={onScroll}
      ref={listInnerRef}
    >
      <div className="py-5 w-full border-b border-gray-300 z-[110] bg-white dark:bg-gray-950 dark:border-gray-500 sticky top-0 left-0 shadow px-4 text-gray-500 flex items-center justify-between">
        <Text size="text-2xl">Pexels</Text>
        <AiOutlineClose
          className="cursor-pointer"
          size={26}
          onClick={() => setOpen(false)}
        />
      </div>
      <div className="px-5">
        <input
          placeholder="search on Pexels"
          className="bg-gray-100 dark:bg-gray-700 dark:border-gray-500 border border-gray-300 rounded-md p-2 w-full my-5"
          onChange={(e) => {
            if (
              e.currentTarget.value.length != search.length &&
              e.currentTarget.value.length > 0
            ) {
              delay(500, () => {
                setPage(0);
                setResult([]);
                fetchData(page);
              });
            }
            setSearch(e.currentTarget.value);
          }}
        />
      </div>
      <div
        className={`grid grid-cols-2 gap-2 w-full h-full auto-cols-auto px-4 pb-32`}
      >
        {result?.map((val: any) => {
          return (
            <div className="relative w-full h-[320px]">
              <PexelsVideo
                setOpen={setOpen}
                selecteVideo={selectedVideo}
                setSelectedVideo={setSelectedVideo}
                val={val}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PexelsVideoUploader;

function PexelsVideo({
  val,
  setSelectedVideo,
  selecteVideo,
  setOpen,
}: {
  val: any;
  setSelectedVideo: (video: string) => void;
  selecteVideo: string;
  setOpen: (val: boolean) => void;
}) {
  return (
    <div className="relative w-full h-full">
      {val.id === selecteVideo ? (
        <Player
          setOpen={setOpen}
          isPlaying={val.id === selecteVideo}
          setIsPlaying={setSelectedVideo}
          id={val.id}
          src={val.video_files[2].link}
        />
      ) : (
        <>
          <Image
            alt="image"
            src={val.image}
            fill
            className="object-cover rounded-2xl"
          />
          <AiOutlinePlayCircle
            size={80}
            onClick={() => {
              setSelectedVideo(val.id);
            }}
            className="text-white left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 absolute"
          />
        </>
      )}
    </div>
  );
}
function Player({
  src,
  isPlaying,
  setIsPlaying,
  id,
  setOpen,
}: {
  src: string;
  isPlaying: boolean;
  setIsPlaying: (val: string) => void;
  id: string;
  setOpen: (val: boolean) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [image, setImage] = useRecoilState(imageUploaded);

  return (
    <>
                  
      <video
        muted
        className={`object-cover rounded-2xl h-full w-full absolute top-0 left-0 ${
          isPlaying ? "border border-blue-500" : ""
        }`}
        ref={videoRef}
        autoPlay
        src={src}
        loop
      >
                    
      </video>
                                   
      {isPlaying && (
        <button
          onClick={() => {
            setImage(src);
            setOpen(false);
          }}
          className="text-white bg-blue-500 left-1/2 -translate-x-1/2 bottom-4 w-40 py-2 rounded-xl absolute"
        >
          Select
        </button>
      )}
                           
    </>
  );
}
