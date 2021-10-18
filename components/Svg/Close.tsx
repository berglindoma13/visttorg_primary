import React from "react";
import { SVG } from "../../types/svg";

const CloseIcon: React.FC<SVG> = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="feather feather-x"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M18 6L6 18" {...props}></path>
      <path d="M6 6L18 18" {...props}></path>
    </svg>
  );
}

export default CloseIcon
