import React from "react";
import { animated, useSpring } from "@react-spring/web";

export const AutoAnimate: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  children,
  ...rest
}) => {
  const styles = useSpring({
    from: { opacity: 0, y: -10 },
    to: { opacity: 1, y: 0 },
  });
  return (
    <animated.div style={styles} {...rest}>
      {children}
    </animated.div>
  );
};
