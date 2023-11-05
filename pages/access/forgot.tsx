import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import Container from "../../components/container/Container";
import CustomInput from "../../components/input/CustomInput";
import Title from "../../components/Title";
import getiverse from "../../public/icons/getiverse.svg";
import background from "../../public/universe_login_background.png";
import bottom_background from "../../public/bottom_background_login.png";
import { IoIosArrowBack } from "react-icons/io";
import Text from "../../components/Text";
import Button from "../../components/buttons/Button";
import Link from "next/link";
import { RoutesName } from "../../utils/constants";
import { emailAccess } from "../../utils/atoms/access/emailAccess";

const Forgot = () => {
  const [email, setEmail] = useRecoilState(emailAccess);
  const router = useRouter();
  return (
    <Container bg={"bg-gray-50"} className="flex flex-col">
      <Head>
        <title>Getiverse Forgot Password</title>
      </Head>
      <div className="relative">
        <Image
          src={background}
          className="w-full relative"
          alt="universe background"
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
      <div className="flex-1 flex flex-col my-10 justify-center px-12">
        <Title size="text-3xl" className="text-center mt-4 sm:mt-0">
          Forgot Password?
        </Title>
        <Text weight="font-thin" className="text-center pt-10">
          Enter your registred email bellow to recieve password reset
          instruction
        </Text>
        <CustomInput
          className="pb-10 pt-4"
          value={email}
          type="email"
          onChange={({ currentTarget }) => setEmail(currentTarget.value.trim())}
          placeHolder="type your email"
        />
        <Button
          type="primary"
          text="Reset Password"
          onClick={() => router.push(RoutesName.RESET)}
          padding="py-4"
        />
        <p className="text-slate-600 dark:text-gray-300 text-center pt-20">
          Back To:
          <Link
            href={RoutesName.LOGIN}
            className="underline text-lg ml-2 text-blue-500"
          >
            Login
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

export default Forgot;
