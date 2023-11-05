import React, { useEffect, useState } from "react";
import { PlateElement, PlateElementProps } from "@udecode/plate-common";

import { cn } from "@/lib/utils";
import { useRecoilValue } from "recoil";
import { fontStyle } from "../../../../utils/atoms/fontStyle";

const ParagraphElement = React.forwardRef<
  React.ElementRef<typeof PlateElement>,
  PlateElementProps
>(({ className, children, ...props }: PlateElementProps, ref) => {
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
    const size = 17;
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

  return (
    <PlateElement
      ref={ref}
      style={{
        fontSize: getFontSize(),
      }}
      className={cn("m-0 px-0 py-1", className)}
      {...props}
    >
      {children}
    </PlateElement>
  );
});
ParagraphElement.displayName = "ParagraphElement";

export { ParagraphElement };
