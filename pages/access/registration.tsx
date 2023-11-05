import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
// import { useRecoilState, useRecoilValue } from "recoil";
import GradientButton from "../../components/buttons/GradientButton";
import Container from "../../components/container/Container";
import CustomInput from "../../components/input/CustomInput";
import Title from "../../components/Title";
import getiverse from "../../public/icons/getiverse.svg";
import background from "../../public/universe_login_background.png";
import bottom_background from "../../public/bottom_background_login.png";
import { FaKey, FaUserAlt } from "react-icons/fa";
import { createAccount } from "../../inMemoryData/registration_and_login/registration";
import { IoIosArrowBack } from "react-icons/io";
import { RoutesName } from "../../utils/constants";
// import { moreModal } from "../../utils/atoms/moreModal";
// import { ModalType } from "../../components/types/Modal";
// import { captchaToken } from "../../utils/atoms/captchaToken";
import HumanVerification from "../../components/specialModals/HumanVerification";
import { toast } from "react-toastify";

const Registration: NextPage = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [registred, setRegistred] = useState(false);
  const router = useRouter();
  // const [prevHumanVerification, setPrevHumanVerification] = useState(false);
  // const capToken = useRecoilValue(captchaToken);
  // const [openModal, setOpenModal] = useRecoilState(moreModal);

  // useEffect(() => {
  //   setOpenModal((current) => ({
  //     ...current,
  //     open: false,
  //     type: ModalType.HUMAN_VERIFICATION,
  //   }));
  // }, []);

  // useEffect(() => {
  //   if (openModal.open == false && !capToken && prevHumanVerification == true) {
  //     throw new Error("devi verifcare che non sei un robot");
  //   }
  //   setPrevHumanVerification(openModal.open);
  // }, [openModal.open]);

  // useEffect(() => {
  //   if (capToken) {
  //   }
  // }, [capToken]);

  useEffect(() => {
    if (registred) router.replace("/access/verification");
  }, [registred]);

  return (
    <>
      <HumanVerification />
      <Container bg="bg-gray-50 flex flex-col">
        <Head>
          <title>Getiverse Registration</title>
        </Head>
        <div className="relative">
          <Image
            src={background}
            className="w-full relative"
            alt="cippa lippa"
          />
          <div className="w-28 h-28 bg-gray-50 dark:bg-slate-700 rounded-full drop-shadow-md flex items-center justify-center absolute top-16 left-1/2 transform -translate-x-1/2 ">
            <Image src={getiverse} alt="getiverse logo" />
          </div>
          <IoIosArrowBack
            className="absolute top-6 left-4"
            color="white"
            size={30}
            onClick={() => router.back()}
          />
        </div>
        <div className="flex-1 flex flex-col my-14 justify-center">
          <Title className="text-center">Sign up</Title>
          <div className="px-8 mt-6 sm:mt-12 space-y-4">
            <CustomInput
              onChange={({ currentTarget }) => setFullName(currentTarget.value)}
              value={fullName ? fullName : ""}
              placeHolder="type your full name"
              label="Full Name"
              Icon={<FaUserAlt color="#3B82F6" />}
            />
            <CustomInput
              onChange={({ currentTarget }) =>
                setEmail(currentTarget.value.trim())
              }
              value={email ? email : ""}
              placeHolder="type your email"
              label="Email"
              Icon={<FaUserAlt color="#3B82F6" />}
            />

            <CustomInput
              type="password"
              value={password}
              onChange={({ currentTarget }) =>
                setPassword(currentTarget.value.trim())
              }
              placeHolder="type your password"
              label="Password"
              Icon={<FaKey color="#3B82F6" />}
            />
            <CustomInput
              type="password"
              value={retypePassword}
              onChange={({ currentTarget }) =>
                setRetypePassword(currentTarget.value.trim())
              }
              placeHolder="retype your password"
              label="Retype-Password"
              Icon={<FaKey color="#3B82F6" />}
            />
          </div>
          <div className="w-full flex justify-center pt-8 px-8">
            <GradientButton
              onClick={async () => {
                // setOpenModal((current) => ({
                //   ...current,
                //   open: true,
                //   type: ModalType.HUMAN_VERIFICATION,
                // }));
                if (
                  await createAccount(
                    email,
                    password,
                    fullName,
                    retypePassword,
                    setRegistred
                  )
                ) {
                  router.push(RoutesName.VERIFICATION);
                }
              }}
            >
              Register
            </GradientButton>
          </div>
        </div>
        <Image
          src={bottom_background}
          alt="universe background"
          className="w-full absolute bottom-0 left-0"

        />
      </Container>
    </>
  );
};

export default Registration;
