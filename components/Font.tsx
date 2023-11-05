import { fontStyle } from "../utils/atoms/fontStyle";
import { useRecoilState } from "recoil";

function Font({ name, className }: { name: string; className: any }) {
  const [font, setFont] = useRecoilState<{
    fontFamily: string;
    fontSizeMoltiplier: number;
  }>(fontStyle);
  const isActive = font.fontFamily === name;
  return (
    <button
      className="flex flex-col items-center"
      onClick={() => setFont((prev) => ({ ...prev, fontFamily: name }))}
    >
      <div
        className={`px-8 py-2 border ${
          isActive ? "border-blue-500" : "border-gray-300"
        } rounded`}
      >
        <p
          className={`${className} ${
            isActive ? "text-blue-500" : "text-gray-500"
          } text-xl`}
        >
          Ag
        </p>
      </div>
      <p
        className={`${className} ${
          isActive ? "text-blue-500" : "text-gray-400"
        } mt-2 text-xs`}
      >
        {name}
      </p>
    </button>
  );
}

export default Font;
