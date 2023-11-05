import { Device } from "@capacitor/device";
import Head from "next/head";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { isIos } from "../../utils/atoms/isIos";
import Container from "../types/container";
import Header from "./Header";

function Container({
  children,
  bg = "bg-[#E4E5F1]",
  className = "",
  relative = true,
  showSidebarAndHeader = false
}: Container) {
  const [iosValue, setIosStatus] = useRecoilState(isIos);
  useEffect(() => {
    Device.getInfo().then((val) => {
      if (val.platform == "ios") {
        setIosStatus(true);
      }
    });
  }, []);

  return (
    <div
      id="getiverse-container"
      className={`w-full dark:bg-gray-950 ${
        iosValue ? "pt-8 pb-10" : ""
      } ${bg} ${className} ${
        relative ? "relative" : ""
      } min-h-screen ${showSidebarAndHeader ? "lg:overflow-y-scroll" : "container lg:mx-auto max-w-3xl"}`}
    >
      <Head>
        <meta
          name="viewport"
          content="height=device-height, 
                      width=device-width, initial-scale=1.0, 
                      minimum-scale=1.0, maximum-scale=1.0, 
                      user-scalable=no, target-densitydpi=device-dpi, viewport-fit=cover"
        />
        <meta charSet="UTF-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin={"true"}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Castoro&family=Poppins:wght@300&family=Roboto:wght@300&family=Rubik:ital,wght@1,300&display=swap"
          rel="stylesheet"
        />
      </Head>
      {showSidebarAndHeader && <Header />}
      {children}
    </div>
  );
}

export default Container;
