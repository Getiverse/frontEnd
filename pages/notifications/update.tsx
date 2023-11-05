import Image from "next/image";
import { useRouter } from "next/router";
import Container from "../../components/container/Container";
import Header from "../../components/logged_in/layout/Header";
import TabBar from "../../components/logged_in/layout/TabBar";
import RecomandedAuthor from "../../components/RecomandedAuthor";
import RoutingGuard from "../../components/RoutingGuard";
import Text from "../../components/Text";
import Title from "../../components/Title";
import avatarTest from "/public/avatar-test.jpg";
import getiverseLogo from "/public/icons/getiverse.svg";

function Update() {
  const router = useRouter();
  return (
    <RoutingGuard>
      <Container bg="bg-gray-50">
        <div className="flex flex-col w-full h-screen">
          <Header label="Updates" hideIcons={true} />
          <main className="px-8 pt-5 pb-24 h-full flex-1 overflow-y-scroll scrollbar-hide">
            <div className="flex justify-center mt-4">
              <Image
                className="scale-125"
                src={getiverseLogo}
                alt="getiverse logo"
              />
            </div>
            <Title className="text-center mt-5" size="text-4xl">
              Update 12.0
            </Title>
            <Text size="text-lg" className="mt-12">
              -AI for reading articles bug fixes
              <br />
              -Better UI
              <br />
              -new Themes
              <br />
              -Fix critical bugs
              <br />
              -Java
            </Text>
          </main>
        </div>
      </Container>
    </RoutingGuard>
  );
}

export default Update;
