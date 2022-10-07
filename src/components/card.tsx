import clsx from 'clsx';
import React from 'react';

export const Card: React.FC<
  { className?: string } & React.HTMLAttributes<HTMLDivElement>
> = ({ className, ...rest }) => {
  return (
    <div
      className={clsx(
        'rounded border border-neutral-900 bg-neutral-800 shadow',
        className
      )}
      {...rest}
    ></div>
  );
};
