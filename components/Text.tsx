import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { fontStyle } from "../utils/atoms/fontStyle";
import {
  Cedarville,
  Lato,
  Montserrat,
  OpenSans,
  Roboto,
} from "../utils/constants";
import { Text } from "./types/text";

function Text({
  children,
  className = "",
  color = "text-gray-700",
  size = "text-xl",
  weight = "font-normal",
  disableDark = false,
  immutable = false,
  editor = false,
  ...attributes
}: Text) {
  const selectedFont = useRecoilValue(fontStyle);
  const ref = useRef<HTMLParagraphElement>(null);
  const [initialSizes, setInitalSizes] = useState({
    "0": 0,
    "0.05": 0,
    "0.1": 0,
    "0.15": 0,
  });
  useEffect(() => {
    setInitalSizes(getValues());
  }, [ref.current]);

  useEffect(() => {
    if (!immutable) {
      getFontSize();
    }
  }, [selectedFont.fontSizeMoltiplier]);

  const getValues = () => {
    if (ref.current !== null) {
      const size = parseFloat(
        window.getComputedStyle(ref.current, null).getPropertyValue("font-size")
      );
      return {
        "0": size,
        "0.05": size + size * 0.05,
        "0.1": size + size * 0.1,
        "0.15": size + size * 0.15,
      };
    }
    return {
      "0": 0,
      "0.05": 0,
      "0.1": 0,
      "0.15": 0,
    };
  };

  function getFontSize() {
    const newValueMoltiplier = selectedFont.fontSizeMoltiplier;
    if (ref.current !== null) {
      /**
       * @ts-ignore*/
      const value = initialSizes[newValueMoltiplier.toString()];
      if (value !== 0) ref.current.style.fontSize = value + "px";
    }
  }
  function getFontClassName(val: string) {
    switch (val.toLowerCase()) {
      case "cedarville":
        return Cedarville.className;
      case "lato":
        return Lato.className;
      case "montserrat":
        return Montserrat.className;
      case "roboto":
        return Roboto.className;
      case "opensans":
        return OpenSans.className;
    }
  }
  function handleTextType() {
    if (editor) {
      return (
        <span
          {...attributes}
          ref={ref}
          className={`${getFontClassName(
            selectedFont.fontFamily
          )} ${className} ${size} ${color} ${weight}`}
        >
          {children}
        </span>
      );
    }
    if (immutable)
      return (
        <span
          {...attributes}
          className={`text-gray-600 text-lg ${
            disableDark ? "" : "dark:text-gray-100"
          }`}
        >
          {children}{" "}
        </span>
      );
    else {
      return (
        <p
          ref={ref}
          className={`${getFontClassName(selectedFont.fontFamily)} ${
            disableDark ? "" : "dark:text-gray-100"
          } ${className} ${size} ${color} ${weight}`}
        >
          {children}
        </p>
      );
    }
  }

  return handleTextType();
}

export default Text;
