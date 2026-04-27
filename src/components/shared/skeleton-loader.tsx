import React from 'react';

const SkeletonLoader = ({
  height,
  width,
  radius,
  ...props
}: {
  height?: number | string;
  width?: number | string;
  radius?: number;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className="skeleton-loader"
      style={{ height, width, '--skeleton-radius': `${radius}px` } as React.CSSProperties}
      {...props}
    />
  );
};
export default SkeletonLoader;
