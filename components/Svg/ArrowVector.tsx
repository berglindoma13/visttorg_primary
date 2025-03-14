import React from "react";
import { SVG } from "../../types/svg";

const ArrowVector: React.FC<SVG> = (props) => {
  return (
    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5 7H1M1 7L7 1M1 7L7 13" stroke="#BDBDBD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default ArrowVector;
