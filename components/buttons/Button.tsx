import React from "react";
import { GenericButton } from "../types/Button";

export default function Button({
  type = "primary",
  text = "",
  className = "w-full",
  Icon,
  padding = "px-6 py-3",
  onClick,
  disabled = false,
  textStyle = "",
  color = "bg-blue-500",
  iconLeft = false,
  buttonType = "button",
}: GenericButton) {
  function getStyle(type: string, padding: string, disabled: boolean) {
    if (type === "primary")
      return `${padding} ${color} ${
        disabled
          ? "bg-blue-200"
          : "bg-blue-500 hover:bg-blue-600 active:bg-blue-800 focus:bg-blue-600"
      } text-white font-medium text-md leading-tight uppercase shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out`;
    else if (type == "secondary")
      return `${
        padding ? padding : "px-6 py-3"
      } flex items-center justify-center border border-blue-500 text-blue-500 font-medium  hover:opacity-60 focus:outline-none focus:ring-0 transition active:opacity-100 active:border-blue-500 active:text-blue-500 active:shadow-lg  duration-150 ease-in-out`;
    else if (type === "thirdary")
      return `py-2 px-2 text-blue-500 font-medium  hover:bg-blue-50 dark:hover:bg-opacity-20 focus:outline-none focus:ring-0 transition active:bg-blue-100 duration-150 ease-in-out`;
  }
  return (
    <button
      data-mdb-ripple="true"
      data-mdb-ripple-color="light"
      disabled={disabled}
      onClick={() => onClick()}
      type={buttonType}
      className={`flex items-center justify-center rounded-md ${className} ${getStyle(
        type,
        padding,
        disabled
      )}`}
    >
      <div className="flex items-center justify-center">
        {Icon && iconLeft && (
          <span className="pl-3 text-[16px] opacity-100">{Icon}</span>
        )}
        <p className={textStyle}>{text}</p>
        {Icon && !iconLeft && (
          <span className="pl-3 text-[16px] opacity-100">{Icon}</span>
        )}
      </div>
    </button>
  );
}
