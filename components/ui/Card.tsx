import Link from 'next/link';
import { ReactNode } from 'react';

type CardProps = {
  href?: string;
  children: ReactNode;
  className?: string;
};

export default function Card({ href, children, className = '' }: CardProps) {
  const cardContent = (
    <div className={`card border border-gray-200 rounded overflow-hidden ${className}`} style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
      {children}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="cardlink no-underline text-inherit hover:no-underline">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

