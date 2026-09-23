import React from 'react';

interface BloodDropIconProps {
  className?: string;
  size?: number;
}

export function BloodDropIcon({ className = "", size = 24 }: BloodDropIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2C12 2 18 8.5 18 14C18 17.31 15.31 20 12 20C8.69 20 6 17.31 6 14C6 8.5 12 2 12 2Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}