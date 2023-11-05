import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import GoogleButton from "../../components/buttons/GoogleButton";
import GradientButton from "../../components/buttons/GradientButton";
import Container from "../../components/container/Container";
import CustomCheckBox from "../../components/input/CustomCheckBox";
import CustomInput from "../../components/input/CustomInput";
import Title from "../../components/Title";
import {
  loginWithEmailAndPassword,
  loginWithGoogle,
} from "../../inMemoryData/registration_and_login/login";
import getiverse from "../../public/icons/getiverse.svg";
import background from "../../public/universe_login_background.png";
import bottom_background from "../../public/bottom_background_login.png";
import { FaKey, FaUserAlt } from "react-icons/fa";
import { RoutesName } from "../../utils/constants";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../../graphql/mutation/user";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";

const Login: NextPage = () => {
  const [remember, setRemeber] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isAuth, setAuth] = useState(false);

  const [login, { data, loading, error }] = useMutation<{
    login: { id: string };
  }>(LOGIN);
  useEffect(() => {
    if (sessionStorage.getItem("token") && !isAuth) router.replace("/home");
  }, []);

  useEffect(() => {
    async function handleLogin() {
      if (isAuth) {
        try {
          await login();
          if (sessionStorage.getItem("token"))
            router.replace(RoutesName.WELCOME);
        } catch (e: any) {
          toast.error(e.message);
        }
      }
    }
    handleLogin();
  }, [isAuth]);

  return (
    <Container bg="bg-gray-50" className="flex flex-col">
      <LoadingSpinner open={loading} />
      <Head>
        <title>Getiverse Login</title>
      </Head>
      <div className="relative">
        <Image src={background} className="w-full relative" alt="cippa lippa" />
        <div className="w-28 h-28 bg-gray-50 dark:bg-slate-700 rounded-full drop-shadow-md flex items-center justify-center absolute top-16 sm:top-20 left-1/2 transform -translate-x-1/2 ">
          <Image src={getiverse} alt="getiverse logo" />
        </div>
      </div>
      <div className=" flex flex-col mt-10 mb-6 justify-center">
        <Title className="text-center mt-4 sm:mt-0">Login</Title>
        <div className="px-8 mt-4">
          <CustomInput
            value={email}
            onChange={({ currentTarget }) =>
              setEmail(currentTarget.value.trim())
            }
            placeHolder="type your email"
            label="Email"
            Icon={<FaUserAlt color="#3B82F6" />}
          />
          <CustomInput
            value={password}
            type="password"
            onChange={({ currentTarget }) =>
              setPassword(currentTarget.value.trim())
            }
            placeHolder="type your password"
            label="Password"
            Icon={<FaKey color="#3B82F6" />}
          />
        </div>

        <div className="w-full flex justify-between px-8 my-6 ">
          <span className="text-gray-500 pl-1 flex items-center">
            <CustomCheckBox
              checked={remember}
              id="remember me"
              name="remember me"
              value="false"
              onChange={() => setRemeber((prev) => !prev)}
            />
            <p className="ml-2 text-slate-600 dark:text-gray-300 text-center text-md">
              remember me
            </p>
          </span>
          <Link href={RoutesName.FORGOT}>
            <p className="text-slate-600 dark:text-gray-300 text-center text-md">
              forgot password?
            </p>
          </Link>
        </div>

        <div className="w-full flex justify-center px-8">
          <GradientButton
            onClick={() =>
              loginWithEmailAndPassword(
                email,
                password,
                remember,
                router,
                setAuth
              )
            }
          >
            Login
          </GradientButton>
        </div>
        <div className="flex items-center my-4 px-8">
          <div className="w-full mr-3 bg-gray-300 dark:border-gray-500 border-t" />
          <p className="text-gray-500 font-medium mb-1">Or</p>
          <div className="w-full ml-3 bg-gray-300 border-t dark:border-gray-500" />
        </div>
        <div className="w-full flex justify-center px-8">
          <GoogleButton onClick={() => loginWithGoogle(remember, setAuth)}>
            Continue With Google
          </GoogleButton>
        </div>
        <p className="text-slate-600 dark:text-gray-300 text-center pt-6">
          Don't have an Account?{" "}
          <Link
            href={RoutesName.REGISTRATION}
            className="underline text-lg ml-2"
          >
            Sign Up
          </Link>
        </p>
      </div>
      <Image
        src={bottom_background}
        alt="universe background"
        className="w-full absolute bottom-0 left-0"
      />
    </Container>
  );
};

export default Login;
