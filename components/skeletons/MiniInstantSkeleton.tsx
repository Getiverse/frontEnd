import { CSSProperties } from "react";
import AvatarSkeleton from "./AvatarSkeleton";
import TextSkeleton from "./TextSkeleton";

function MiniInstantSkeleton({ style }: { style: CSSProperties }) {
  return (
    <div style={style} className="px-1">
      <div style={style} className="relative rounded-2xl">
        <div className="absolute w-full h-full rounded-2xl bg-gradient-to-b from-black via-transparent to-black opacity-40 z-20 px-1" />
        <TextSkeleton
          width="w-32"
          height="h-4"
          className="absolute px-3 bottom-20 z-20 left-4"
        />
        <div className="absolute bottom-2 flex items-center px-3 z-20">
          <AvatarSkeleton height="h-10" width="w-10" className="scale-75" />
          <TextSkeleton width="w-20" height="h-3" className="ml-2" />
        </div>
      </div>
    </div>
  );
}

export default MiniInstantSkeleton;
