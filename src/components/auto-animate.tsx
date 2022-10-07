import React from 'react';

interface Props extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

export const AutoAnimate: React.FC<Props> = ({
  as: Tag = 'div',
  children,
  ...rest
}) => {
  return <Tag {...rest}>{children}</Tag>;
};
