import type { ReactNode, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({ children, className = '', ...rest }: Props) {
  return (
    <div className={`glass ${className}`} {...rest}>
      {children}
    </div>
  );
}
