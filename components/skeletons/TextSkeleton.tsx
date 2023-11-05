function TextSkeleton({
  height,
  width,
  className = "rounded-md",
}: {
  height: string;
  width: string;
  className?: string;
}) {
  return (
    <div
      className={`${width} ${height} ${className} bg-gray-500 animate-pulse `}
    />
  );
}

export default TextSkeleton;
