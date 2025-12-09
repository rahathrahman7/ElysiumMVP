// Diamond Shape Icons for Elysium
// SVG icons for various diamond cuts and shapes

import React from 'react';

interface DiamondIconProps {
  className?: string;
  size?: number;
}

// Round Diamond Icon
export const RoundDiamondIcon = ({ className = "", size = 24 }: DiamondIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <circle
      cx="12"
      cy="12"
      r="5"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      opacity="0.5"
    />
    <circle
      cx="12"
      cy="12"
      r="2"
      stroke="currentColor"
      strokeWidth="0.5"
      fill="none"
      opacity="0.3"
    />
  </svg>
);

// Oval Diamond Icon
export const OvalDiamondIcon = ({ className = "", size = 24 }: DiamondIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <ellipse
      cx="12"
      cy="12"
      rx="7"
      ry="9"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <ellipse
      cx="12"
      cy="12"
      rx="4"
      ry="5"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      opacity="0.5"
    />
    <ellipse
      cx="12"
      cy="12"
      rx="2"
      ry="2.5"
      stroke="currentColor"
      strokeWidth="0.5"
      fill="none"
      opacity="0.3"
    />
  </svg>
);

// Princess/Square Diamond Icon
export const PrincessDiamondIcon = ({ className = "", size = 24 }: DiamondIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="4"
      y="4"
      width="16"
      height="16"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <rect
      x="7"
      y="7"
      width="10"
      height="10"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      opacity="0.5"
    />
    <rect
      x="10"
      y="10"
      width="4"
      height="4"
      stroke="currentColor"
      strokeWidth="0.5"
      fill="none"
      opacity="0.3"
    />
  </svg>
);

// Pear Diamond Icon
export const PearDiamondIcon = ({ className = "", size = 24 }: DiamondIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 4C16 8 19 12 19 16C19 20 16 23 12 23C8 23 5 20 5 16C5 12 8 8 12 4Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M12 7C14.5 9.5 16.5 11.5 16.5 14C16.5 16.5 14.5 18.5 12 18.5C9.5 18.5 7.5 16.5 7.5 14C7.5 11.5 9.5 9.5 12 7Z"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      opacity="0.5"
    />
    <circle
      cx="12"
      cy="15"
      r="2"
      stroke="currentColor"
      strokeWidth="0.5"
      fill="none"
      opacity="0.3"
    />
  </svg>
);

// Radiant Diamond Icon
export const RadiantDiamondIcon = ({ className = "", size = 24 }: DiamondIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="6"
      y="4"
      width="12"
      height="16"
      stroke="currentColor"
      strokeWidth="1.5"
      rx="1.5"
      fill="none"
    />
    <rect
      x="8"
      y="6"
      width="8"
      height="12"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      opacity="0.5"
      rx="1"
    />
    <path
      d="M8 7.5L16 18.5M16 7.5L8 18.5"
      stroke="currentColor"
      strokeWidth="0.75"
      opacity="0.7"
    />
    <path
      d="M6 9L8 6H16L18 9"
      stroke="currentColor"
      strokeWidth="0.75"
      opacity="0.6"
    />
    <path
      d="M6 15L8 18H16L18 15"
      stroke="currentColor"
      strokeWidth="0.75"
      opacity="0.6"
    />
  </svg>
);

// Emerald/Rectangle Diamond Icon
export const EmeraldDiamondIcon = ({ className = "", size = 24 }: DiamondIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M6 4L18 4L20 6L20 18L18 20L6 20L4 18L4 6L6 4Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M8 6L16 6L17.5 7.5L17.5 16.5L16 18L8 18L6.5 16.5L6.5 7.5L8 6Z"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      opacity="0.5"
    />
    <rect
      x="10"
      y="9"
      width="4"
      height="6"
      stroke="currentColor"
      strokeWidth="0.5"
      fill="none"
      opacity="0.3"
    />
  </svg>
);

// Marquise Diamond Icon
export const MarquiseDiamondIcon = ({ className = "", size = 24 }: DiamondIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 3C16 3 20 7 20 12C20 17 16 21 12 21C8 21 4 17 4 12C4 7 8 3 12 3Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      transform="rotate(90 12 12)"
    />
    <path
      d="M12 6C14.5 6 17 8.5 17 12C17 15.5 14.5 18 12 18C9.5 18 7 15.5 7 12C7 8.5 9.5 6 12 6Z"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      opacity="0.5"
      transform="rotate(90 12 12)"
    />
    <ellipse
      cx="12"
      cy="12"
      rx="2"
      ry="4"
      stroke="currentColor"
      strokeWidth="0.5"
      fill="none"
      opacity="0.3"
    />
  </svg>
);

// Heart Diamond Icon
export const HeartDiamondIcon = ({ className = "", size = 24 }: DiamondIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M12 17.5L11 16.7C7.5 13.8 5.5 11.6 5.5 9C5.5 7.1 6.9 5.7 8.8 5.7C10 5.7 11.2 6.3 12 7.2C12.8 6.3 14 5.7 15.2 5.7C17.1 5.7 18.5 7.1 18.5 9C18.5 11.6 16.5 13.8 13 16.7L12 17.5Z"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      opacity="0.5"
    />
  </svg>
);

// Cushion Diamond Icon
export const CushionDiamondIcon = ({ className = "", size = 24 }: DiamondIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect
      x="4"
      y="4"
      width="16"
      height="16"
      rx="4"
      ry="4"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <rect
      x="7"
      y="7"
      width="10"
      height="10"
      rx="2.5"
      ry="2.5"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      opacity="0.5"
    />
    <rect
      x="10"
      y="10"
      width="4"
      height="4"
      rx="1"
      ry="1"
      stroke="currentColor"
      strokeWidth="0.5"
      fill="none"
      opacity="0.3"
    />
  </svg>
);

// Generic Diamond/Gemstone Icon (for general use)
export const DiamondIcon = ({ className = "", size = 24 }: DiamondIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M6 9L12 3L18 9L15 21L9 21L6 9Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M8 9L12 5L16 9L14 18L10 18L8 9Z"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      opacity="0.5"
    />
    <path
      d="M10 9L12 7L14 9L13 15L11 15L10 9Z"
      stroke="currentColor"
      strokeWidth="0.5"
      fill="none"
      opacity="0.3"
    />
    {/* Sparkle effects */}
    <circle cx="9" cy="7" r="0.5" fill="currentColor" opacity="0.6" />
    <circle cx="15" cy="7" r="0.5" fill="currentColor" opacity="0.6" />
    <circle cx="12" cy="11" r="0.5" fill="currentColor" opacity="0.4" />
  </svg>
);

// Map of diamond shapes to their icons
export const diamondShapeIcons = {
  round: RoundDiamondIcon,
  oval: OvalDiamondIcon,
  princess: PrincessDiamondIcon,
  pear: PearDiamondIcon,
  radiant: RadiantDiamondIcon,
  emerald: EmeraldDiamondIcon,
  marquise: MarquiseDiamondIcon,
  heart: HeartDiamondIcon,
  cushion: CushionDiamondIcon,
  diamond: DiamondIcon, // Generic
} as const;

export type DiamondShape = keyof typeof diamondShapeIcons;

// Helper component to render diamond icon by shape
interface DiamondShapeIconProps extends DiamondIconProps {
  shape: DiamondShape;
}

export const DiamondShapeIcon = ({ shape, ...props }: DiamondShapeIconProps) => {
  const IconComponent = diamondShapeIcons[shape];
  return <IconComponent {...props} />;
};
