import { NextPage } from "next";
import Image from "next/image";
import Button from "../components/buttons/Button";
import Container from "../components/container/Container";
import Text from "../components/Text";
import Title from "../components/Title";
import getiverseLogo from "../public/getiverse-logo.png";
import { AiOutlineArrowRight } from "react-icons/ai";
import RoutingGuard from "../components/RoutingGuard";
import Link from "next/link";
import { useRouter } from "next/router";

const Welcome: NextPage = () => {
  const router = useRouter();
  return (
    <RoutingGuard>
      <Container
        bg="bg-[url('/welcome-bg.png')] bg-cover"
        className="flex flex-col items-center px-4"
      >
        <Image
          src={getiverseLogo}
          alt="getiverse linear gradient icon from pink to blue with white text"
          className="mt-20"
        />
        <Title
          size="text-3xl"
          color="text-gray-300"
          className="text-center mt-24"
          weight="font-bold"
        >
          Welcome to the Getiverse Community!
        </Title>
        <Text
          color="text-gray-300"
          weight="font-normal"
          className="text-center mt-12"
        >
          Discover the platform that gives you the freedom to write, read and
          publish your articles for free
        </Text>
        <Button
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 "
          type="primary"
          padding="px-6 py-3"
          text="get started"
          onClick={() => router.push("/categories")}
          Icon={<AiOutlineArrowRight className="animate-moveright" />}
        />
      </Container>
    </RoutingGuard>
  );
};

export default Welcome;
