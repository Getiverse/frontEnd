import Image from "next/image";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import ImageVideo from "../../../components/ImageVideo";

import Text from "../../../components/Text";
import Title from "../../../components/Title";
import { createdInstant } from "../../../utils/atoms/createdInstant";
import * as htmlToImage from "html-to-image";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
/**@ts-ignore */
import * as download from "downloadjs";
import getiverseLogo from "../../../public/getiverse_simple.png";
import dynamic from "next/dynamic";
import {
  AVAILABLE_AUDIOS,
  AVAILABLE_FONTS,
  Cedarville,
  Lato,
  Montserrat,
  OpenSans,
  Roboto,
} from "../../../utils/constants";
import Font from "../../../components/Font";
import { fontStyle } from "../../../utils/atoms/fontStyle";
import { useRecoilValue } from "recoil";

const Editor = dynamic(
  () => import("../../../components/plate-editor/components/plate/editor"),
  {
    ssr: false,
  }
);
// If loading a variable font, you don't need to specify the font weight

function BoostViews() {
  const [instant, setInstant] = useRecoilState(createdInstant);
  const [template, setTemplate] = useState("light");
  const [musicSelected, setMusicSelected] = useState("");
  const font = useRecoilValue<{
    fontFamily: string;
    fontSizeMoltiplier: number;
  }>(fontStyle);

  function getFontClassName(val: string) {
    switch (val.toLowerCase()) {
      case "cedarville":
        return Cedarville.className;
      case "lato":
        return Lato.className;
      case "montserrat":
        return Montserrat.className;
      case "roboto":
        return Roboto.className;
      case "opensans":
        return OpenSans.className;
    }
  }

  function getAudio(val: string) {
    switch (val.toLowerCase()) {
      case "cedarville":
        return Cedarville.className;
      case "lato":
        return Lato.className;
      case "montserrat":
        return Montserrat.className;
      case "roboto":
        return Roboto.className;
      case "opensans":
        return OpenSans.className;
    }
  }

  const templates = [
    "dark",
    "light",
    "grayscale",
    "sepia",
    "invert",
    "universe",
    "glass",
    "empty",
  ];

  function handleDownload() {
    const element = document.getElementById("screenShot");
    if (element)
      htmlToImage.toPng(element).then(function (dataUrl: string) {
        download(dataUrl, "my-node.png");
      });
  }

  function getStyleBasedOnTemplate() {
    if (template == "dark") {
      return "bg-gray-800 text-white";
    }
    if (template == "light") return "bg-gray-100 text-gray-700";
    if (template == "empty") return "text-white font-mono";
    if (template == "grayscale")
      return "bg-cover object-cover grayscale backdrop-blur-sm opacity-70 bg-[url('https://images.unsplash.com/photo-1528484701073-2b22dc76649e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1631&q=80')]";
    if (template == "sepia")
      return "bg-cover object-cover sepia backdrop-blur-sm opacity-70 bg-[url('https://images.unsplash.com/photo-1528484701073-2b22dc76649e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1631&q=80')]";
    if (template == "invert")
      return "bg-cover object-cover invert backdrop-blur-sm opacity-70 bg-[url('https://images.unsplash.com/photo-1528484701073-2b22dc76649e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1631&q=80')]";
    if (template == "universe")
      return "bg-cover object-cover backdrop-blur-sm opacity-70 bg-[url('https://images.unsplash.com/photo-1528484701073-2b22dc76649e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1631&q=80')]";
    if (template == "glass")
      return "bg-cover object-cover backdrop-blur-md opacity-70 ";
  }

  return (
    <div className="flex">
      <div
        id="screenShot"
        className="flex flex-col items-center px-6 relative w-[700px] h-screen"
      >
        <div className="absolute w-full h-full bg-gradient-to-b from-black via-transparent to-black opacity-40 z-[1]" />
        <ImageVideo
          opacityEffect
          src={"https://cdn.filestackcontent.com/LAGufXfGQuG4F6uqcAnK"}
        />
        <Title
          className="absolute top-20 left-4 z-[2]"
          color="text-gray-50"
          weight="font-normal"
          size="text-2xl"
        >
          {instant.title}
        </Title>
        <div className="absolute top-1/2 -translate-y-1/2 w-full px-12 z-[2]">
          <div
            className={`p-10 w-full z-[2] opacity-90 ${getStyleBasedOnTemplate()} rounded-xl ${getFontClassName(
              font.fontFamily
            )}`}
          >
            <div className="z-100 opacity-100">
              <div className="flex items-center mb-3 ml-3">
                <Image width={50} src={getiverseLogo} alt="getiverse logo" />
                <div className="flex flex-col ml-3">
                  <Text
                    disableDark
                    size="text-xl"
                    color="text-blue-400"
                    weight="font-bold"
                    className="leading-tight underline"
                  >
                    getiverse.com
                  </Text>
                  <Text disableDark size="text-sm" color="text-blue-400">
                    @Getiverse
                  </Text>
                </div>
              </div>
              <div className="py-2 text-xl text-center overflow-x-hidden">
                <Editor
                  instant
                  readOnly
                  content={[
                    {
                      type: "p",
                      children: [
                        {
                          text: "There's two possible outcomes: if the result confirms the hypothesis, then you've made a measurament. If the result is contrary to the hypothesis, then you've made a discovery.",
                        },
                      ],
                    },
                  ]}
                />
              </div>
              <Text
                disableDark
                size="text-md"
                color={template == "light" ? "text-gray-700" : "text-white"}
                className="mt-1 text-center"
              >
                -Created by @Lucca Gugescu
              </Text>
            </div>
          </div>
        </div>
      </div>
      {/**Pannel */}
      <div className="z-50 flex flex-1 justify-center items-center">
        <div className="space-y-12 flex flex-col items-center">
          <Title size="text-6xl" className="mb-5">
            Generate Social Network Post:
          </Title>
          <Title size="text-4xl">Templates:</Title>
          <div className="flex space-x-4 overflow-x-scroll w-56 md:w-full justify-center">
            {templates.map((val) => (
              <button
                onClick={() => setTemplate(val)}
                className={`p-2 rounded-lg ${
                  val == template ? "bg-blue-500" : "border border-blue-500"
                }`}
              >
                {val}
              </button>
            ))}
          </div>
          <Title size="text-4xl">Fonts:</Title>
          <div className="flex space-x-4">
            {AVAILABLE_FONTS.map((val: string) => (
              <Font key={val} name={val} className={getFontClassName(val)} />
            ))}
          </div>
          <div className="flex space-x-4 overflow-x-scroll w-[700px] pb-12">
            {AVAILABLE_AUDIOS.map((val: string) => (
              <AudioPlayer
                val={val}
                musicSelected={musicSelected}
                setMusicSelected={setMusicSelected}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <button
              className="py-2 px-6 bg-blue-500 rounded-full self-center"
              onClick={() => handleDownload()}
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AudioPlayer({
  val,
  musicSelected,
  setMusicSelected,
}: {
  val: string;
  musicSelected: string;
  setMusicSelected: Dispatch<SetStateAction<string>>;
}) {
  const ref = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (ref.current && musicSelected == val) ref.current?.play();
    else ref.current?.pause();
  }, [musicSelected]);
  return (
    <div className="space-y-4 flex flex-col items-center justify-between h-32">
      <audio ref={ref} key={val} src={"/assets/audio/" + val}></audio>
      <Text className="text-center" size="text-sm">
        {val.slice(0, val.length - 4)}
      </Text>
      <button
        onClick={() =>
          musicSelected == val ? setMusicSelected("") : setMusicSelected(val)
        }
        className={`rounded-md py-1 px-12 ${
          musicSelected == val
            ? "bg-blue-500 text-white"
            : "bg-white border border-blue-500 text-blue-500"
        }`}
      >
        Select
      </button>
    </div>
  );
}

export default BoostViews;
