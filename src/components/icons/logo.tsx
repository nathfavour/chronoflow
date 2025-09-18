import { SVGProps } from 'react';

export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.33 3.67A10 10 0 1 1 3.67 20.33 10 10 0 0 1 20.33 3.67Z" />
      <path d="M7 12.5s2.5-2 5-2 5 2 5 2" />
      <path d="M7 15.5s2.5-2 5-2 5 2 5 2" />
    </svg>
  );
}
