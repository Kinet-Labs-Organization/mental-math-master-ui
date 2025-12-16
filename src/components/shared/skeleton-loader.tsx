const SkeletonLoader = ({
  height,
  width,
  radius,
}: {
  height?: number | string;
  width?: number | string;
  radius?: number;
}) => {
  return (
    <div
      className="skeleton-loader"
      style={{ height, width, '--skeleton-radius': `${radius}px` } as React.CSSProperties}
    />
  );
};
export default SkeletonLoader;
