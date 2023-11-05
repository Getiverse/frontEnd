import React, { useEffect, useState } from "react";
import Image from "next/image";
import { BsFillSunFill } from "react-icons/bs";
import { BsFillMoonFill } from "react-icons/bs";
import Text from "../Text";
import { useRouter } from "next/router";
import { sidebarOpen } from "../../utils/atoms/sidebarOpen";
import Switch from "../Switch";
import { useRecoilState, useRecoilValue } from "recoil";
import Link from "next/link";
import { TAB_BAR_ITEMS } from "../../utils/constants";
import getiverseLogo from "/public/getiverse_simple.png";
import { useTheme } from "next-themes";
import { theme } from "../../utils/atoms/theme";
import { getIconBasedOnName } from "../../utils/reactFunction";
const SidebarIcons = ({ pathName }: { pathName: string }) => {
  const isOpen = useRecoilValue(sidebarOpen);
  const [hovered, setHovered] = useState(pathName);

  return (
    <ul className="mt-24" onMouseLeave={() => setHovered("")}>
      {TAB_BAR_ITEMS.map((element) => {

        return (
          <Link href={element.path} key={element.path}>
            <li
              onMouseEnter={() => setHovered(element.path)}
              className={`mt-8 flex flex-row items-center ${
                hovered === element.path ||
                (hovered == "" && element.path == pathName)
                  ? "text-blue-600"
                  : "text-gray-500 dark:text-gray-300"
              } text-lg cursor-pointer`}
              key={element.id}
            >
              <HalfCircleActive show={element.path === pathName} />
              <div
                className={`${
                  isOpen ? "lg:ml-8 lg:w-auto" : ""
                } w-full flex items-center justify-center flex-none `}
              >
                {getIconBasedOnName(element.icon, hovered == element.path)}

                {hovered == element.path && !isOpen && (
                  <div className="flex relative items-center">
                    <div
                      className={`absolute left-2 z-30 px-5 py-1 rounded-xl text-gray-100 bg-blue-500 bg-opacity-80 dark:bg-opacity-50`}
                    >
                      <Text className="whitespace-nowrap">{element.name}</Text>
                    </div>
                  </div>
                )}
              </div>
              <Text
                className={`ml-4 hidden ${isOpen ? "lg:block" : "lg:hidden"}`}
              >
                {element.name}
              </Text>
            </li>
          </Link>
        );
      })}
    </ul>
  );
};

function CloseMenu() {
  const [open, setOpen] = useRecoilState(sidebarOpen);
  return (
    <svg
      onClick={() => setOpen((prev) => !prev)}
      className={`z-20 hidden lg:block cursor-pointer ${
        open ? "left-[11.75rem] " : "rotate-180 left-[7.5rem] "
      } absolute  duration-200 top-20`}
      width="27"
      height="40"
      viewBox="0 0 27 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.5 20V20.0647V20.1293V20.1939V20.2585V20.323V20.3875V20.4519V20.5162V20.5805V20.6448V20.709V20.7731V20.8372V20.9013V20.9653V21.0292V21.0931V21.1569V21.2207V21.2844V21.3481V21.4117V21.4753V21.5388V21.6023V21.6657V21.729V21.7923V21.8555V21.9187V21.9818V22.0449V22.1079V22.1708V22.2337V22.2965V22.3593V22.422V22.4847V22.5473V22.6098V22.6723V22.7347V22.797V22.8593V22.9215V22.9837V23.0458V23.1078V23.1698V23.2317V23.2936V23.3554V23.4171V23.4787V23.5403V23.6019V23.6633V23.7247V23.786V23.8473V23.9085V23.9696V24.0307V24.0917V24.1526V24.2135V24.2743V24.335V24.3956V24.4562V24.5167V24.5772V24.6376V24.6979V24.7581V24.8183V24.8783V24.9384V24.9983V25.0582V25.118V25.1777V25.2374V25.2969V25.3565V25.4159V25.4752V25.5345V25.5937V25.6529V25.7119V25.7709V25.8298V25.8886V25.9474V26.0061V26.0647V26.1232V26.1816V26.24V26.2983V26.3565V26.4146V26.4726V26.5306V26.5885V26.6463V26.704V26.7616V26.8192V26.8767V26.9341V26.9914V27.0486V27.1058V27.1628V27.2198V27.2767V27.3335V27.3902V27.4469V27.5034V27.5599V27.6163V27.6726V27.7288V27.7849V27.8409V27.8969V27.9528V28.0085V28.0642V28.1198V28.1753V28.2307V28.2861V28.3413V28.3964V28.4515V28.5065V28.5613V28.6161V28.6708V28.7254V28.7799V28.8344V28.8887V28.9429V28.997V29.0511V29.105V29.1589V29.2126V29.2663V29.3199V29.3733V29.4267V29.48V29.5332V29.5863V29.6393V29.6922V29.7449V29.7976V29.8502V29.9027V29.9551V30.0074V30.0596V30.1117V30.1637V30.2156V30.2674V30.3191V30.3707V30.4222V30.4736V30.5249V30.5761V30.6272V30.6782V30.729V30.7798V30.8305V30.881V30.9315V30.9818V31.0321V31.0822V31.1323V31.1822V31.232V31.2817V31.3313V31.3808V31.4302V31.4795V31.5287V31.5778V31.6267V31.6756V31.7243V31.7729V31.8214V31.8698V31.9181V31.9663V32.0144V32.0624V32.1102V32.1579V32.2056V32.2531V32.3005V32.3477V32.3949V32.442V32.4889V32.5357V32.5824V32.629V32.6755V32.7219V32.7681V32.8142V32.8602V32.9061V32.9519V32.9976V33.0431V33.0885V33.1338V33.179V33.2241V33.269V33.3138V33.3585V33.4031V33.4475V33.4919V33.5361V33.5802V33.6242V33.668V33.7117V33.7553V33.7988V33.8422V33.8854V33.9285V33.9715V34.0143V34.0571V34.0997V34.1421V34.1845V34.2267V34.2688V34.3108V34.3526V34.3943V34.4359V34.4774V34.5187V34.5599V34.601V34.6419V34.6827V34.7234V34.7639V34.8044V34.8447V34.8848V34.9248V34.9647V35.0045V35.0441V35.0836V35.1229V35.1622V35.2013V35.2402V35.279V35.3177V35.3563V35.3947V35.433V35.4711V35.5091V35.547V35.5847V35.6223V35.6598V35.6971V35.7343V35.7713V35.8082V35.845V35.8816V35.9181V35.9544V35.9906V36.0267V36.0626V36.0984V36.134V36.1695V36.2049V36.2401V36.2752V36.3101V36.3449V36.3795V36.414V36.4484V36.4826V36.5166V36.5505V36.5843V36.6179V36.6514V36.6847V36.7179V36.751V36.7838V36.8166V36.8492V36.8816V36.9139V36.9461V36.9781V37.0099V37.0416V37.0731V37.1045V37.1358V37.1669V37.1978V37.2286V37.2592V37.2897V37.3201V37.3502V37.3803V37.4101V37.4398V37.4694V37.4988V37.5281V37.5572V37.5861V37.6149V37.6435V37.672V37.7003V37.7285V37.7565V37.7843V37.812V37.8395V37.8669V37.8941V37.9212V37.9481V37.9748V38.0014V38.0278V38.054V38.0801V38.1061V38.1318V38.1574V38.1829V38.2081V38.2333V38.2582V38.283V38.3076V38.3321V38.3564V38.3805V38.4045V38.4283V38.4519V38.4754V38.4987V38.5219V38.5448V38.5676V38.5903V38.6127V38.635V38.6572V38.6791V38.7009V38.7225V38.744V38.7653V38.7864V38.8074V38.8281V38.8487V38.8692V38.8894V38.9095V38.9294V38.9492V38.9687V38.9881V39.0073V39.0264V39.0453V39.064V39.0825V39.1008V39.119V39.137V39.1548V39.1725V39.1899V39.2072V39.2243V39.2413V39.258V39.2746V39.291V39.3073V39.3233V39.3392V39.3548V39.3703V39.3857V39.4008V39.4158V39.4306V39.4452V39.4596V39.4738V39.4879V39.4937C8.96152 39.2285 0.5 30.6024 0.5 20C0.5 9.39761 8.96152 0.771521 19.5 0.506285V0.512139V0.526192V0.540427V0.554844V0.569443V0.584224V0.599186V0.614329V0.629653V0.645157V0.660841V0.676706V0.692749V0.708972V0.725374V0.741954V0.758712V0.775649V0.792763V0.810054V0.827523V0.845168V0.862989V0.880987V0.89916V0.917509V0.936033V0.954733V0.973606V0.992654V1.01188V1.03127V1.05084V1.07058V1.0905V1.11058V1.13084V1.15127V1.17188V1.19265V1.21359V1.23471V1.256V1.27745V1.29908V1.32087V1.34283V1.36497V1.38727V1.40974V1.43237V1.45518V1.47815V1.50129V1.52459V1.54806V1.5717V1.5955V1.61947V1.6436V1.6679V1.69236V1.71699V1.74178V1.76673V1.79185V1.81713V1.84257V1.86818V1.89395V1.91988V1.94597V1.97222V1.99863V2.0252V2.05193V2.07883V2.10588V2.13309V2.16046V2.18799V2.21568V2.24352V2.27152V2.29968V2.328V2.35647V2.38511V2.41389V2.44283V2.47193V2.50119V2.53059V2.56016V2.58987V2.61975V2.64977V2.67995V2.71028V2.74076V2.7714V2.80219V2.83313V2.86422V2.89547V2.92686V2.95841V2.9901V3.02195V3.05394V3.08609V3.11838V3.15082V3.18342V3.21616V3.24904V3.28208V3.31526V3.34859V3.38206V3.41569V3.44945V3.48337V3.51743V3.55163V3.58598V3.62047V3.65511V3.68989V3.72482V3.75989V3.7951V3.83045V3.86595V3.90159V3.93737V3.97329V4.00935V4.04556V4.0819V4.11839V4.15501V4.19178V4.22868V4.26572V4.3029V4.34022V4.37768V4.41528V4.45301V4.49088V4.52888V4.56703V4.60531V4.64372V4.68227V4.72096V4.75978V4.79874V4.83783V4.87705V4.91641V4.9559V4.99553V5.03528V5.07517V5.1152V5.15535V5.19564V5.23605V5.2766V5.31728V5.35809V5.39903V5.4401V5.4813V5.52263V5.56408V5.60567V5.64738V5.68922V5.73119V5.77329V5.81551V5.85786V5.90034V5.94294V5.98567V6.02853V6.07151V6.11461V6.15784V6.20119V6.24467V6.28827V6.33199V6.37584V6.41981V6.4639V6.50812V6.55245V6.59691V6.64149V6.68619V6.73101V6.77595V6.82101V6.86619V6.91149V6.95691V7.00244V7.0481V7.09387V7.13976V7.18577V7.2319V7.27814V7.3245V7.37098V7.41757V7.46428V7.5111V7.55804V7.60509V7.65226V7.69954V7.74694V7.79445V7.84207V7.8898V7.93765V7.98561V8.03368V8.08186V8.13016V8.17857V8.22708V8.27571V8.32445V8.37329V8.42225V8.47132V8.52049V8.56977V8.61917V8.66867V8.71827V8.76799V8.81781V8.86774V8.91777V8.96791V9.01816V9.06851V9.11897V9.16954V9.2202V9.27097V9.32185V9.37283V9.42391V9.4751V9.52639V9.57778V9.62927V9.68087V9.73256V9.78436V9.83626V9.88826V9.94036V9.99256V10.0449V10.0973V10.1498V10.2024V10.2551V10.3078V10.3607V10.4137V10.4668V10.52V10.5733V10.6267V10.6801V10.7337V10.7874V10.8411V10.895V10.9489V11.003V11.0571V11.1113V11.1656V11.2201V11.2746V11.3292V11.3839V11.4387V11.4935V11.5485V11.6036V11.6587V11.7139V11.7693V11.8247V11.8802V11.9358V11.9915V12.0472V12.1031V12.1591V12.2151V12.2712V12.3274V12.3837V12.4401V12.4966V12.5531V12.6098V12.6665V12.7233V12.7802V12.8372V12.8942V12.9514V13.0086V13.0659V13.1233V13.1808V13.2384V13.296V13.3537V13.4115V13.4694V13.5274V13.5854V13.6435V13.7017V13.76V13.8184V13.8768V13.9353V13.9939V14.0526V14.1114V14.1702V14.2291V14.2881V14.3471V14.4063V14.4655V14.5248V14.5841V14.6435V14.7031V14.7626V14.8223V14.882V14.9418V15.0017V15.0616V15.1217V15.1817V15.2419V15.3021V15.3624V15.4228V15.4833V15.5438V15.6044V15.665V15.7257V15.7865V15.8474V15.9083V15.9693V16.0304V16.0915V16.1527V16.214V16.2753V16.3367V16.3981V16.4597V16.5213V16.5829V16.6446V16.7064V16.7683V16.8302V16.8922V16.9542V17.0163V17.0785V17.1407V17.203V17.2653V17.3277V17.3902V17.4527V17.5153V17.578V17.6407V17.7035V17.7663V17.8292V17.8921V17.9551V18.0182V18.0813V18.1445V18.2077V18.271V18.3343V18.3977V18.4612V18.5247V18.5883V18.6519V18.7156V18.7793V18.8431V18.9069V18.9708V19.0347V19.0987V19.1628V19.2269V19.291V19.3552V19.4195V19.4838V19.5481V19.6125V19.677V19.7415V19.8061V19.8707V19.9353V20Z"
        className={`stroke-gray-300 dark:stroke-gray-700 ${
          !open
            ? "fill-outer-light dark:fill-outer-dark"
            : "fill-inner-light dark:fill-inner-dark"
        }`}
      />
      <rect
        x="19"
        y="1"
        width="1"
        height="38"
        className={`${
          !open
            ? "fill-outer-light dark:fill-outer-dark"
            : "fill-inner-light dark:fill-inner-dark"
        }`}
      />
      <path
        className={open ? "animate-moveleft" : "animate-moveright"}
        d="M14.3333 23.6667L11 20.3333M11 20.3333L14.3333 17M11 20.3333H26"
        stroke="#6B7280"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Logo() {
  const isOpen = useRecoilValue(sidebarOpen);
  return (
    <span
      className={`items-center justify-center flex flex-col ${
        isOpen ? "lg:flex-row mt-3" : "mt-2"
      }  lg:items-center text-blue-500`}
    >
      <Image
        src={getiverseLogo}
        width={30}
        className="mr-2"
        alt="getiverse logo"
      />
      <h3
        className={`hidden text-xl font-sans ${
          isOpen ? "lg:text-2xl lg:block" : "md:hidden"
        }`}
      >
        Getiverse
      </h3>
    </span>
  );
}

function HalfCircleActive({ show = false }) {
  const router = useRouter();
  return (
    <svg
      width={16}
      height={16}
      style={{
        display: `${show ? "inline-block" : "none"}`,
        position: "absolute",
      }}
    >
      <circle cx={0} cy={8} r="50%" fill="#2563EB" />
    </svg>
  );
}

function SidebarContainer({ children }: { children: React.ReactNode }) {
  const isOpen = useRecoilValue(sidebarOpen);
  return (
    <nav
      className={`hidden sm:block relative duration-300 ${
        isOpen ? "lg:w-72" : "lg:w-32"
      } h-screen bg-gray-50 dark:bg-slate-900 border-r border-border-light dark:border-border-dark`}
    >
      {children}
    </nav>
  );
}
function SidebarSwitch() {
  const isOpen = useRecoilValue(sidebarOpen);

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
    <div className="absolute w-full flex justify-center items-center bottom-2">
      <Text
        size="text-sm"
        className={`text-gray-500 hidden ${isOpen ? "lg:block" : "lg:hidden"}`}
      >
        lightMode
      </Text>
      <Switch
        large
        value={themeValue == "Light"}
        setValue={() =>
          setThemeValue((prev: string) => (prev == "Dark" ? "Light" : "Dark"))
        }
        LeftIcon={BsFillSunFill}
        RightIcon={BsFillMoonFill}
        className={isOpen ? "md:ml-4" : ""}
      />
    </div>
  );
}
function Sidebar() {
  //url example: /contact
  const router = useRouter();
  return (
    <SidebarContainer>
      <Logo />
      <CloseMenu />
      <SidebarIcons pathName={router.pathname} />
      <SidebarSwitch />
    </SidebarContainer>
  );
}

export default Sidebar;
