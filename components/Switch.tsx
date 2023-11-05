import React, { Dispatch, SetStateAction, useState } from "react";
import { IconType } from "react-icons";

function Switch({
  className = "",
  large = false,
  setValue,
  LeftIcon,
  RightIcon,
  value,
  onClick,
}: {
  className?: string;
  large: boolean;
  value: boolean;
  LeftIcon: IconType;
  RightIcon: IconType;
  setValue: Dispatch<SetStateAction<boolean>>;

  onClick?: () => void;
}) {
  return (
    <button
      onClick={() => {
        setValue((prev: boolean) => !prev);
        onClick && onClick();
      }}
      className={`relative transition duration-300 ease-linear delay-300 ${
        large ? "w-16 h-8" : "w-12 h-6"
      } rounded-3xl bg-gray-200 dark:bg-slate-800 ${className}`}
    >
      <div
        className={`absolute top-1/2 -translate-y-1/2 ${
          value ? "right-1" : "left-1"
        } p-1 rounded-full text-blue-500 text-sm bg-white dark:bg-gray-950`}
      >
        {!value ? <LeftIcon size={18} /> : <RightIcon size={18} />}
      </div>
    </button>
  );
}

export default Switch;
