import { fontStyle } from "../utils/atoms/fontStyle";
import { Text } from "./types/text";
import { useRecoilValue } from "recoil";
import { useEffect, useRef, useState } from "react";
import {
  Cedarville,
  Lato,
  Montserrat,
  OpenSans,
  Roboto,
} from "../utils/constants";

function Title({
  children,
  className = "",
  color = "text-gray-700",
  size = "text-5xl",
  weight = "font-semibold",
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
    getFontSize();
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
  function getFontSize() {
    const newValueMoltiplier = selectedFont.fontSizeMoltiplier;
    if (ref.current !== null) {
      /**
       * @ts-ignore*/
      const value = initialSizes[newValueMoltiplier.toString()];
      if (value !== 0) ref.current.style.fontSize = value + "px";
    }
  }
  return (
    <h1
      ref={ref}
      className={`${getFontClassName(
        selectedFont.fontFamily
      )} dark:text-gray-200 ${className} ${color} ${size} ${weight}`}
    >
      {children}
    </h1>
  );
}

export default Title;
