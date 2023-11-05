import { useState } from "react";
import { IconType } from "react-icons";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";
import Text from "./Text";

function Collapse({
  name,
  Icon,
  id,
  radios,
  value,
  setValue,
}: {
  name: string;
  value: string;
  setValue: (value: string) => void;
  Icon: IconType;
  id: number;
  radios: {
    label: string;
    Icon: any;
  }[];
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <button
        className="flex py-3 justify-between items-center rounded text-xs font-medium leading-normal text-white border-b border-gray-300 dark:border-gray-700 w-full transition duration-150 ease-in-out"
        type="button"
        data-te-ripple-color="light"
        data-te-target={`#${name.split(" ")[0] + id}`}
        aria-expanded="false"
        aria-controls={name.split(" ")[0] + id}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div className="flex items-center space-x-5">
          <Icon size={26} className="text-gray-500" />
          <Text color="text-gray-500">{name}</Text>
        </div>
        {expanded ? (
          <MdOutlineExpandLess size={28} className="text-gray-500" />
        ) : (
          <MdOutlineExpandMore size={28} className="text-gray-500" />
        )}
      </button>
      <div className={expanded ? "" : "!visible hidden"}>
        <div className="block px-5">
          {radios.map((radio) => {
            return (
              <div className="flex items-center justify-between py-3 border-b border-gray-300 dark:border-gray-700 w-full">
                <radio.Icon size={26} className="text-gray-500" />
                <label
                  htmlFor={
                    name.split(" ")[0] + id + "_" + radio.label.split(" ")[0]
                  }
                  className="text-gray-500 dark:text-gray-100 w-full text-lg pl-4 font-medium"
                >
                  {radio.label}
                </label>
                <input
                  onChange={(e) => setValue(e.currentTarget.value)}
                  checked={value === radio.label}
                  className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:checked:focus:border-primary"
                  type="radio"
                  id={name.split(" ")[0] + id + "_" + radio.label.split(" ")[0]}
                  name={name}
                  value={radio.label}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Collapse;
