import { animated, useSpring } from "@react-spring/web";
import type { ElementType, HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

export const AutoAnimate: React.FC<Props> = ({
  as: Tag = "div",
  children,
  ...rest
}) => {
  const AnimatedTag = animated(Tag);
  const styles = useSpring({
    from: { opacity: 0, y: -10 },
    to: { opacity: 1, y: 0 },
  });
  return (
    <AnimatedTag style={styles} {...rest}>
      {children}
    </AnimatedTag>
  );
};
