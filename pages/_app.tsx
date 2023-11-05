import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import { Device } from "@capacitor/device";
import { App as CapacitorApp } from "@capacitor/app";
import { useRouter } from "next/router";
import { ApolloProvider } from "@apollo/client";
import { client } from "../graphql/config";
import { ThemeProvider } from "next-themes";
import { getApp, getApps, initializeApp } from "firebase/app";
import "firebase/auth";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { Capacitor } from "@capacitor/core";
import { firebaseWebConfig } from "../utils/firebase/config";
import { Persistence, getAuth, setPersistence } from "firebase/auth";
import "react-toastify/dist/ReactToastify.css";
import "react-spring-bottom-sheet/dist/style.css";
import { ToastContainer } from "react-toastify";


function MyApp({ Component, pageProps }: AppProps) {
  const [platform, setPlatform] = useState("");
  const [showChild, setShowChild] = useState(false);
  const router = useRouter();
  const [appInit, setAppInit] = useState(true);

  useEffect(() => {
    async function handleInit() {
      if (!Capacitor.isNativePlatform()) {
        const app = !getApps().length
          ? initializeApp(firebaseWebConfig)
          : getApp();
        const auth = getAuth(app);
        if (auth) {
          setAppInit(true);
        }
      }
      const event = CapacitorApp.addListener("backButton", ({ canGoBack }) => {
        if (!canGoBack || window.location.pathname === "/home") {
          CapacitorApp.exitApp();
        } else {
          router.back();
        }
      });
    }
    handleInit();
  }, []);

  useEffect(() => {
    Device.getInfo().then((info) => setPlatform(info.platform));
    setShowChild(true);
  }, []);

  if (!showChild && platform !== "web") {
    return null;
  }

  if ((typeof window === "undefined" && platform !== "web") || !appInit) {
    return <></>;
  } else {
    return (
      <ApolloProvider client={client}>
        <RecoilRoot>
          <ThemeProvider attribute="class">
            <ToastContainer />
            <Component {...pageProps} />
          </ThemeProvider>
        </RecoilRoot>
      </ApolloProvider>
    );
  }
}

export default MyApp;
