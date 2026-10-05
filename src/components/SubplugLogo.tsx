import React from 'react';

interface SubplugLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'stacked';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showGlow?: boolean;
}

export const SubplugLogo: React.FC<SubplugLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  showGlow = true,
}) => {
  // Dimension mapping
  const iconSizeMap = {
    sm: 30,
    md: 40,
    lg: 52,
    xl: 72,
  };

  const pixelSize = iconSizeMap[size];

  // Precision vector SVG matching the SUBPLUG electric lightning-plug artwork
  const LogoMark = (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-all duration-300 group-hover:scale-105 ${
        showGlow ? 'filter drop-shadow-[0_0_10px_rgba(0,245,155,0.45)]' : ''
      }`}
    >
      <defs>
        {/* Dynamic Electric Neon Gradient: Sky Cyan to Neon Lime Green */}
        <linearGradient id="subplugNeonGrad" x1="45" y1="12" x2="85" y2="105" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="35%" stopColor="#00D2FF" />
          <stop offset="70%" stopColor="#00FF87" />
          <stop offset="100%" stopColor="#22FF55" />
        </linearGradient>

        {/* Ambient Neon Bloom Filter */}
        <filter id="subplugBloom" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#subplugBloom)">
        {/* 1. Lightning Bolt Top Body (Smooth sharp geometry) */}
        <path
          d="M62 14L41 48H55L47 64"
          stroke="url(#subplugNeonGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 2. Seamless Electric Cable Loop flowing from lightning to plug */}
        <path
          d="M47 64C44 75 42 87 54 91C66 94 73 86 70 76"
          stroke="url(#subplugNeonGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 3. Plug Base Collar where wire enters */}
        <path
          d="M68 74L73 79L79 73L74 68Z"
          fill="url(#subplugNeonGrad)"
        />

        {/* 4. Tilted Electric Plug Body (45-degree angle) */}
        <rect
          x="72"
          y="56"
          width="20"
          height="19"
          rx="6"
          transform="rotate(45 72 56)"
          fill="url(#subplugNeonGrad)"
        />

        {/* Inscribed Lightning Bolt Icon on Plug Body */}
        <path
          d="M74 58L71 63H75L72 67"
          stroke="#071322"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 5. Dual Prongs / Metal Pins pointing to top-right */}
        {/* Prong 1 */}
        <line
          x1="80"
          y1="49"
          x2="88"
          y2="41"
          stroke="url(#subplugNeonGrad)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Prong 2 */}
        <line
          x1="88"
          y1="57"
          x2="96"
          y2="49"
          stroke="url(#subplugNeonGrad)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{LogoMark}</div>;
  }

  // Text Typography Classes
  const textSizeMap = {
    sm: 'text-base font-extrabold tracking-[0.14em]',
    md: 'text-xl sm:text-2xl font-black tracking-[0.15em]',
    lg: 'text-2xl sm:text-3xl font-black tracking-[0.16em]',
    xl: 'text-4xl font-black tracking-[0.18em]',
  };

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center group select-none ${className}`}>
        {LogoMark}
        <span
          className={`mt-2 font-black text-white uppercase ${textSizeMap[size]} transition-all duration-300 group-hover:text-emerald-300 drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]`}
          style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
            letterSpacing: '0.18em',
          }}
        >
          SUBPLUG
        </span>
      </div>
    );
  }

  // Horizontal Full Lockup (Default for Header & Footer)
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      {LogoMark}
      <div className="flex flex-col">
        <span
          className={`font-black text-white uppercase ${textSizeMap[size]} leading-none transition-all duration-300 group-hover:text-emerald-300 drop-shadow-[0_0_8px_rgba(0,229,255,0.3)]`}
          style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
            letterSpacing: '0.15em',
          }}
        >
          SUBPLUG
        </span>
      </div>
    </div>
  );
};
