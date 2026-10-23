import React from 'react';

interface SkillPathLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  showWordmark?: boolean;
  className?: string;
}

export const SkillPathLogo: React.FC<SkillPathLogoProps> = ({
  size = 'md',
  showTagline = false,
  showWordmark = true,
  className = ''
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  }[size];

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  }[size];

  const taglineSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs'
  }[size];

  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Skill Path Growth Mark: Ascending S-Path Ribbon + Arrowhead + Plus Sparkle */}
      <div className={`relative ${iconDimensions} shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 48 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_8px_rgba(255,107,0,0.25)] group-hover:scale-105 transition-transform duration-200"
        >
          <defs>
            <linearGradient id="skillPathRibbonGrad" x1="4" y1="36" x2="34" y2="6" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#EA580C" />
              <stop offset="50%" stopColor="#FF6B00" />
              <stop offset="100%" stopColor="#FF8526" />
            </linearGradient>
            <filter id="orangeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#FF6B00" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* S-shaped winding path rising upward */}
          <path
            d="M 6 30 C 4 37 13 41 21 38 C 29 35 30 27 22 23 C 14 19 12 14 18 9 C 21 6 25 7 28 9"
            stroke="url(#skillPathRibbonGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Directional arrowhead pointing up and northeast */}
          <path
            d="M 23 4 L 34 8 L 29 17 Z"
            fill="#FF6B00"
            filter="url(#orangeGlow)"
          />

          {/* Accent Plus Sparkle (+) in upper-right */}
          <path
            d="M 39 8 L 39 16 M 35 12 L 43 12"
            stroke="#FF6B00"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Wordmark and Tagline */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <div className={`font-black tracking-tight font-display ${textSizes} text-zinc-900 dark:text-white transition-colors flex items-center`}>
            <span>Skill</span>
            <span className="text-[#FF6B00] ml-0.5">Path</span>
          </div>
          {showTagline && (
            <span className={`text-zinc-500 dark:text-[#858D98] font-medium tracking-wide mt-0.5 ${taglineSizes}`}>
              Discover. Learn. Grow.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
