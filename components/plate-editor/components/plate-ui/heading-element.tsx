import React, { useEffect, useState } from "react";
import { PlateElement, PlateElementProps } from "@udecode/plate-common";
import { cva, VariantProps } from "class-variance-authority";
import { hashFnv32a } from "../../../../utils/functions";
import { useRecoilValue } from "recoil";
import { fontStyle } from "../../../../utils/atoms/fontStyle";

const headingVariants = cva("", {
  variants: {
    variant: {
      h1: "mb-3 mt-[2em] font-heading text-4xl font-bold",
      h2: "mb-2 mt-[1.4em] font-heading text-2xl font-semibold tracking-tight",
    },
    isFirstBlock: {
      true: "mt-0",
      false: "",
    },
  },
});

export function HeadingElement({
  className,
  variant = "h1",
  isFirstBlock,
  children,
  ...props
}: PlateElementProps & VariantProps<typeof headingVariants>) {
  const { element, editor } = props;
  const selectedFont = useRecoilValue(fontStyle);
  const [initialSizes, setInitalSizes] = useState({
    "0": 0,
    "0.05": 0,
    "0.1": 0,
    "0.15": 0,
  });

  useEffect(() => {
    setInitalSizes(getValues());
  }, []);

  const getValues = () => {
    const size = 30;
    return {
      "0": size,
      "0.05": size + size * 0.05,
      "0.1": size + size * 0.1,
      "0.15": size + size * 0.15,
    };
  };

  function getFontSize() {
    const newValueMoltiplier = selectedFont.fontSizeMoltiplier;
    /**@ts-ignore */
    const value = initialSizes[newValueMoltiplier.toString()];
    return value;
  }
  const Element = variant!;

  return (
    <PlateElement
      /**@ts-ignore */
      id={hashFnv32a(element?.children[0].text, true, 32)}
      asChild
      style={{
        fontSize: getFontSize(),
      }}
      className={headingVariants({
        variant,
        className,
        isFirstBlock: element === editor.children[0],
      })}
      {...props}
    >
      <Element>{children}</Element>
    </PlateElement>
  );
}
