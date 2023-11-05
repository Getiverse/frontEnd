import { Grid } from "@giphy/react-components";
import { useState } from "react";
import { GiphyFetch } from "@giphy/js-fetch-api";
import Text from "./Text";
import { AiOutlineClose } from "react-icons/ai";
import { imageUploaded } from "../utils/atoms/imageUploaded";
import { useRecoilState } from "recoil";

function GiphyUloader({ setOpen }: { setOpen: (val: boolean) => void }) {
  const [search, setSearch] = useState("");
  return (
    <div className="h-full w-full max-w-4xl md:max-h-[600px] md:rounded-lg md:shadow-lg md:left-1/2 md:-translate-x-1/2 md:top-32 absolute left-0 top-0 z-[3] bg-white dark:bg-gray-950 overflow-y-scroll overflow-x-hidden">
      <div className="flex bg-white sticky top-0 left-0 z-[110] items-center px-6 justify-between w-full py-5 border-b-2 border-gray-300 dark:border-gray-700 bg-whtie dark:bg-gray-950  overflow-y-scroll">
        <Text color="text-gray-500" size="text-2xl">
          GIPHY
        </Text>
        <button onClick={() => setOpen(false)}>
          <AiOutlineClose className="text-gray-500" size="28" />
        </button>
      </div>
      <div className="px-4">
        <input
          placeholder="Search on Giphy"
          className="border border-gray-300 bg-gray-100 dark:bg-slate-600 dark:border-gray-700 mt-4 w-full px-2 py-2 rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="h-full w-full flex flex-col items-center pt-4 relative">
        <Components searchTerm={search} setOpen={setOpen} />
      </div>
    </div>
  );
}

export default GiphyUloader;

const Components = ({
  searchTerm,
  setOpen,
}: {
  searchTerm: string;
  setOpen: (val: boolean) => void;
}) => {
  // use @giphy/js-fetch-api to fetch gifs
  // apply for a new Web SDK key. Use a separate key for every platform (Android, iOS, Web)
  const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY);
  const randomSubjects = ["planes", "cars", "space", "football"];
  const getRandomSubject = () =>
    randomSubjects[Math.floor(Math.random() * randomSubjects.length)];
  const fetchGifs = (offset: number) =>
    gf.search(searchTerm.length > 0 ? searchTerm : getRandomSubject(), {
      offset,
      limit: 10,
    });
  const [image, setImage] = useRecoilState(imageUploaded);

  return (
    <>
      <Grid
        onGifClick={(gif) => {
          setImage(gif.images.downsized_large.url);
          setOpen(false);
        }}
        className="absolute max-h-full"
        key={searchTerm}
        hideAttribution={true}
        noLink={true}
        columns={2}
        width={360}
        fetchGifs={fetchGifs}
      />
    </>
  );
};
