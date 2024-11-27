import React from "react";
import Skeleton from "@mui/material/Skeleton";

const SkeletonLoader = ({
  count = 1,
  variant = "text",
  width = "100%",
  height = 20,
  animation = "pulse",
  sx = {},
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          variant={variant}
          width={width}
          height={height}
          animation={animation}
          style={{
            backgroundColor: "rgb(var(--loader-bg-color))",
            ...sx,
          }}
        />
      ))}
    </>
  );
};

export default SkeletonLoader;
