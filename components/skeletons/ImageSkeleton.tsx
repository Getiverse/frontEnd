function ImageSkeleton({ height }: { height: string }) {
  return <div className={`w-full ${height} bg-gray-500 animate-pulse`} />;
}

export default ImageSkeleton;
