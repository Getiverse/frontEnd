function InstantSkeleton() {
  return (
    <div className="relative h-screen w-full snap-start snap-always shadow bg-gray-500">
      <div className="h-3 bg-gray-700 w-64 absolute top-16 left-6 z-[2] rounded-md animate-pulse"></div>
      <div className="absolute bottom-24 px-4 z-[2] w-full animate-pulse">
        <div className="h-20 rounded-md w-full bg-gray-700 "></div>
      </div>
    </div>
  );
}

export default InstantSkeleton;
