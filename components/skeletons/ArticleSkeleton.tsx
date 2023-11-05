import AvatarSkeleton from "./AvatarSkeleton";
import ImageSkeleton from "./ImageSkeleton";
import TextSkeleton from "./TextSkeleton";

function ArticleSkeleton() {
  return (
    <article
      className={`bg-gray-50 dark:bg-slate-900 w-full pt-2 pb-4 rounded-2xl max-w-xs cursor-pointer hover:shadow`}
    >
      <div className="flex items-center pb-1 px-4 justify-between">
        <button className="flex items-center space-x-2 cursor-pointer hover:text-blue-500">
          <AvatarSkeleton width="w-10" height="h-10" className="scale-[77%]" />
          <TextSkeleton width="w-20" height="h-3" />
        </button>
      </div>
      <button className="w-full text-left">
        <div className="h-48 w-full relative">
          <ImageSkeleton height="h-48" />
        </div>
        <div className="ml-4 mt-5 space-y-3 w-full">
          <TextSkeleton className="" width="w-4/5" height="h-4" />
          <TextSkeleton className="" width="w-2/5" height="h-4" />
        </div>
        <div className="flex px-4 py-3 justify-between items-center">
          <TextSkeleton height="h-2" width="w-20" />
          <TextSkeleton width="w-20" height="h-4" className="my-1" />
        </div>
        <div className="px-4 pt-2 space-y-2 pb-8">
          <TextSkeleton width="w-full" height="h-2" />
          <TextSkeleton width="w-full" height="h-2" />
          <TextSkeleton width="w-full" height="h-2" />
        </div>
      </button>
    </article>
  );
}

export default ArticleSkeleton;
