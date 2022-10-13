import React from 'react';
import clsx from 'clsx';

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
