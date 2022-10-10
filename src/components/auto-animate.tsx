import React from 'react';
import { animated, useSpring } from '@react-spring/web';

interface Props extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}
export const AutoAnimate: React.FC<Props> = ({ children, ...rest }) => {
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
