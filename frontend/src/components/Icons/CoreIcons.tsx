import React from 'react';

interface Props {
  color?: string;
}

export const ArrowUp = ({ color }: Props) => (
  <svg
    width="13"
    height="12"
    viewBox="0 0 13 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M7.50008 3.76774L10.793 7.06064L12.2072 5.64642L7.20718 0.646423H5.79297L0.792969 5.64642L2.20718 7.06064L5.50008 3.76774L5.50008 11.3535H7.50008L7.50008 3.76774Z"
      fill={color}
    />
  </svg>
);

export const ArrowDown = ({ color }: Props) => (
  <svg
    width="13"
    height="12"
    viewBox="0 0 13 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M7.50008 8.23226L10.793 4.93936L12.2072 6.35358L7.20718 11.3536H5.79297L0.792969 6.35358L2.20718 4.93936L5.50008 8.23226L5.50008 0.646469H7.50008L7.50008 8.23226Z"
      fill={color}
    />
  </svg>
);
