import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiHelpCircle, BiImage, BiLogOut, BiSearch } from "react-icons/bi";
import Container from "../../components/container/Container";
import CustomInput from "../../components/input/CustomInput";
import Header from "../../components/logged_in/layout/Header";
import { COLLPSE_SETTINGS } from "../../utils/constants";
import Collapse from "../../components/Collapse";
import Text from "../../components/Text";
import { FiUser } from "react-icons/fi";
import { MdNotificationsNone, MdOutlineSecurity } from "react-icons/md";
import { useTheme } from "next-themes";
import { BsFlag } from "react-icons/bs";
import RoutingGuard from "../../components/RoutingGuard";
import { LOGOUT } from "../../graphql/mutation/user";
import { useMutation } from "@apollo/client";
import LinkSetting from "../../components/LinkSetting";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { useRecoilState } from "recoil";
import { theme } from "../../utils/atoms/theme";
import { getAuth } from "firebase/auth";

const Settings: NextPage = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [postType, setPostType] = useState("Normal Post");
  const [themeValue, setThemeValue] = useRecoilState(theme);
  const { setTheme } = useTheme();
  // const [logout, { data, loading, error }] = useMutation<{
  //   logout: { id: string };
  // }>(LOGOUT);

  useEffect(() => {
    if (themeValue == "Dark") {
      setTheme("dark");
    } else if (themeValue == "Light") {
      setTheme("light");
    } else {
      setTheme("system");
    }
  }, [themeValue]);

  return (
    <RoutingGuard>
      <Container bg="bg-white">
        <div className="flex flex-col w-full h-screen">
          <Header label="Settings" hideIcons />
          <main className="flex-1 overflow-y-scroll px-8 py-5 scrollbar-hide">
            {/* <CustomInput
              value={search}
              placeHolder="Search for a setting..."
              Icon={<BiSearch className="text-gray-600" />}
              onChange={(e) => setSearch(e.currentTarget.value)}
            /> */}
            <div className="mt-2">
              <LinkSetting
                href="settings/account"
                label="Account"
                Icon={FiUser}
              />
              <Collapse
                value={postType}
                setValue={setPostType}
                Icon={COLLPSE_SETTINGS[0].Icon}
                id={COLLPSE_SETTINGS[0].id}
                name={COLLPSE_SETTINGS[0].name}
                radios={COLLPSE_SETTINGS[0].radios}
                key={COLLPSE_SETTINGS[0].id}
              />
              <Collapse
                value={themeValue}
                setValue={setThemeValue}
                Icon={COLLPSE_SETTINGS[1].Icon}
                id={COLLPSE_SETTINGS[1].id}
                name={COLLPSE_SETTINGS[1].name}
                radios={COLLPSE_SETTINGS[1].radios}
                key={COLLPSE_SETTINGS[1].id}
              />

              <LinkSetting
                href="settings/privacy"
                label="Privacy and Security"
                Icon={MdOutlineSecurity}
              />
              <LinkSetting
                href="settings/backgrounds"
                label="Article Backgrounds"
                Icon={BiImage}
              />
              {/* <LinkSetting
                Icon={MdNotificationsNone}
                label="Notifications"
                href="settings/notifications"
              /> */}
              <LinkSetting
                Icon={BiHelpCircle}
                label="About"
                href="settings/about"
              />
              {/* <LinkSetting
                Icon={BsFlag}
                label="Languages"
                href="settings/languages"
              /> */}
              <button
                onClick={() => {
                  try {
                    FirebaseAuthentication.signOut();
                  } catch (e) {
                    console.log(e);
                  }
                  // getAuth().signOut();
                  // logout();
                  sessionStorage.clear();
                  window.location.href = "/access/login";
                }}
                className="flex items-center space-x-5 border-b border-gray-300 dark:border-gray-700 py-3 w-full"
              >
                <BiLogOut className="text-red-500" size={26} />
                <Text color="text-red-500" disableDark>
                  Logout
                </Text>
              </button>
            </div>
          </main>
        </div>
      </Container>
    </RoutingGuard>
  );
  {
    /*</RoutingGuard>*/
  }
};

export default Settings;
