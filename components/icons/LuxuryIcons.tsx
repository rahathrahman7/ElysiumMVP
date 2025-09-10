// Luxury Icons for Elysium Trust Features
// Custom SVG icons replacing emojis for premium brand identity

import React from 'react';

interface LuxuryIconProps {
  className?: string;
  size?: number;
}

// Hallmark/Assay Office Icon - Classic seal design
export const HallmarkIcon = ({ className = "", size = 24 }: LuxuryIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Outer seal ring */}
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    
    {/* Inner decorative ring */}
    <circle
      cx="12"
      cy="12"
      r="7"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      opacity="0.6"
    />
    
    {/* Crown symbol in center */}
    <path
      d="M8 10L10 8L12 10L14 8L16 10L15 14H9L8 10Z"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
    />
    
    {/* Crown jewels */}
    <circle cx="10" cy="11" r="0.5" fill="currentColor" opacity="0.8" />
    <circle cx="12" cy="11" r="0.5" fill="currentColor" opacity="0.8" />
    <circle cx="14" cy="11" r="0.5" fill="currentColor" opacity="0.8" />
    
    {/* Decorative lines */}
    <path
      d="M6 6L8 8M18 6L16 8M6 18L8 16M18 18L16 16"
      stroke="currentColor"
      strokeWidth="0.5"
      opacity="0.4"
    />
  </svg>
);

// Premium Returns Icon - Elegant arrow cycle
export const ReturnsIcon = ({ className = "", size = 24 }: LuxuryIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Outer frame */}
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    
    {/* Return arrow cycle */}
    <path
      d="M16 8C16 6 14 4 12 4C10 4 8 6 8 8"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M8 16C8 18 10 20 12 20C14 20 16 18 16 16"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    
    {/* Arrow heads */}
    <path
      d="M6 8L8 6L8 10"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 16L16 18L16 14"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    
    {/* Center diamond accent */}
    <path
      d="M11 12L12 11L13 12L12 13L11 12Z"
      stroke="currentColor"
      strokeWidth="0.8"
      fill="currentColor"
      opacity="0.6"
    />
  </svg>
);

// Complimentary Service Icon - Elegant tools design
export const ServiceIcon = ({ className = "", size = 24 }: LuxuryIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Elegant border frame */}
    <path
      d="M4 4L20 4L20 20L4 20L4 4Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    
    {/* Crossed tools - ring sizing tools */}
    <path
      d="M8 8L16 16"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M16 8L8 16"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    
    {/* Tool handles */}
    <circle
      cx="8"
      cy="8"
      r="1.5"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
    />
    <circle
      cx="16"
      cy="8"
      r="1.5"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
    />
    
    {/* Center medallion */}
    <circle
      cx="12"
      cy="12"
      r="2"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      opacity="0.6"
    />
    
    {/* Inner precision mark */}
    <circle
      cx="12"
      cy="12"
      r="0.5"
      fill="currentColor"
      opacity="0.8"
    />
    
    {/* Corner decorative elements */}
    <path
      d="M4 6L6 4M18 4L20 6M20 18L18 20M6 20L4 18"
      stroke="currentColor"
      strokeWidth="0.8"
      opacity="0.4"
    />
  </svg>
);

// Map of service icons
export const serviceIcons = {
  hallmark: HallmarkIcon,
  returns: ReturnsIcon,
  service: ServiceIcon,
} as const;

export type ServiceIconType = keyof typeof serviceIcons;