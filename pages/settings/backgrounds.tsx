import { NextPage } from "next";
import Image from "next/image";
import Container from "../../components/container/Container";
import Header from "../../components/logged_in/layout/Header";
import { SetterOrUpdater, useRecoilState } from "recoil";
import { articleBackground } from "../../utils/atoms/articleBackground";
import Text from "../../components/Text";
import RoutingGuard from "../../components/RoutingGuard";

const Backgrounds: NextPage = () => {
  const [bg, setBg] = useRecoilState(articleBackground);
  return (
    <RoutingGuard>
      <Container bg="bg-white">
        <Header label="Backgrounds" hideIcons />
        <main className="flex-1 overflow-y-scroll px-8 py-10 scrollbar-hide grid grid-cols-2 gap-y-10 sm:gap-y-6 gap-x-6">
          <BGSelector src={""} bg={bg} setBg={setBg} name="Blank" />
          <BGSelector
            src={"/static/hexagons.svg"}
            bg={bg}
            setBg={setBg}
            name="Hexagons"
          />
          <BGSelector
            src={"/static/waves.svg"}
            bg={bg}
            setBg={setBg}
            name="Waves"
          />
          <BGSelector
            src={"/static/plus.svg"}
            bg={bg}
            setBg={setBg}
            name="Plus"
          />
          <BGSelector
            src={"/static/memphis.svg"}
            bg={bg}
            setBg={setBg}
            name="Memphis"
          />
        </main>
      </Container>
    </RoutingGuard>
  );
};

function BGSelector({
  src,
  bg,
  setBg,
  name,
}: {
  src: string;
  bg: string;
  setBg: SetterOrUpdater<string>;
  name: string;
}) {
  return (
    <button
      className={`rounded-xl relative h-48 border ${
        src == bg ? "border-blue-500" : "border-gray-300 dark:border-gray-600"
      }`}
      onClick={() => setBg(src)}
    >
      {src && (
        <Image
          alt="background image for article"
          className="bg-repeat object-cover rounded-xl opacity-70"
          fill
          src={src}
        />
      )}
      <Text size="text-md" className="absolute -bottom-8 left-0">
        {name}
      </Text>
    </button>
  );
}

export default Backgrounds;
