function AvatarSkeleton({
  width,
  height,
  className,
}: {
  width: string;
  height: string;
  className?: string;
}) {
  return (
    <div
      className={`${width} ${className} ${height} rounded-full bg-gray-500 animate-pulse`}
    />
  );
}

export default AvatarSkeleton;
