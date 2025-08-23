// components/Card.tsx
import React from 'react';

type Props = {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export default function Card({ title, children, footer, className = '' }: Props) {
  return (
    <div className={`rounded-2xl border bg-white ${className}`}>
      {title && <div className="px-5 py-4 border-b font-semibold">{title}</div>}
      <div className="px-5 py-4">{children}</div>
      {footer && <div className="px-5 py-4 border-t">{footer}</div>}
    </div>
  );
}

