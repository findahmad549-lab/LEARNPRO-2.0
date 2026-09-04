import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  showTagline?: boolean;
  variant?: 'full' | 'icon' | 'badge';
  animated?: boolean;
}

export const EduSparkLogo: React.FC<LogoProps> = ({
  className = '',
  size = 36,
  showText = false,
  showTagline = true,
  variant = 'full',
}) => {
  const numericSize = typeof size === 'number' ? size : parseInt(size as string, 10) || 36;
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Official Circular EduSpark Logo Emblem */}
      <div
        className="relative shrink-0 rounded-full p-[1.5px] bg-gradient-to-tr from-cyan-400 via-fuchsia-500 to-amber-400 shadow-[0_0_12px_rgba(56,189,248,0.3)] transition-transform duration-300 hover:scale-105"
        style={{ width: numericSize, height: numericSize }}
      >
        {!imgError ? (
          <img
            src="/logo.png"
            alt="EduSpark Official Logo"
            className="w-full h-full rounded-full object-cover bg-[#060814]"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          /* High-definition SVG vector fallback representing the exact EduSpark emblem */
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full rounded-full bg-[#060814]"
          >
            <defs>
              <linearGradient id="neon-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00E5FF" />
                <stop offset="40%" stopColor="#A855F7" />
                <stop offset="70%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
              <linearGradient id="book-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
              <linearGradient id="book-purple" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9333EA" />
                <stop offset="100%" stopColor="#C084FC" />
              </linearGradient>
              <linearGradient id="star-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>

            {/* Dark Circular Background with Neon Border */}
            <circle cx="50" cy="50" r="46" fill="#060814" stroke="url(#neon-ring)" strokeWidth="3" />

            {/* Glowing Open Pages (Lower Wings) */}
            <path
              d="M26 55 C35 52 44 54 49 58 C50 58 50 58 51 58 C56 54 65 52 74 55 C72 58 65 60 52 61 C49 61 48 61 48 61 C35 60 28 58 26 55 Z"
              fill="url(#book-purple)"
            />
            <path
              d="M23 52 C33 48 43 51 49 55 C51 51 67 48 77 52 C74 56 66 58 52 59 C38 58 26 56 23 52 Z"
              fill="url(#book-cyan)"
            />

            {/* White Core Open Textbook Pages */}
            <path
              d="M28 47 C37 42 46 44 49 50 C50 50 50 50 51 50 C54 44 63 42 72 47 C68 53 58 54 50 54 C42 54 32 53 28 47 Z"
              fill="#FFFFFF"
            />

            {/* Triumphant Student Figure Emerging Upward */}
            {/* Figure Head */}
            <circle cx="50" cy="33" r="4" fill="#FFFFFF" />
            {/* Figure Body & Reaching Arm */}
            <path
              d="M48 39 C46 44 47 48 50 50 C53 48 54 44 52 39 C54 36 60 30 65 24 C64 24 60 27 55 33 C52 36 49 37 48 39 Z"
              fill="#FFFFFF"
            />

            {/* Radiant Golden Star at Top-Right */}
            <polygon
              points="67,18 69.5,23 75,23.5 71,27.5 72.2,33 67,30 61.8,33 63,27.5 59,23.5 64.5,23"
              fill="url(#star-gold)"
              filter="drop-shadow(0 0 3px #FBBF24)"
            />

            {/* Twinkling Accent Sparks */}
            <polygon points="41,21 42,24 45,25 42,26 41,29 40,26 37,25 40,24" fill="#38BDF8" />
            <polygon points="35,28 35.8,30 38,30.8 35.8,31.6 35,34 34.2,31.6 32,30.8 34.2,30" fill="#C084FC" />
            <polygon points="70,36 70.6,38 72.5,38.5 70.6,39 70,41 69.4,39 67.5,38.5 69.4,38" fill="#FACC15" />
          </svg>
        )}
      </div>

      {/* Brand Title & Tagline */}
      {showText && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white font-['Outfit',sans-serif]">
              Edu<span className="text-sky-500 dark:text-sky-400">Sp</span>
              <span className="text-fuchsia-500 dark:text-fuchsia-400">ar</span>
              <span className="text-amber-500 dark:text-amber-400">k</span>
            </span>
            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-gradient-to-r from-sky-500/10 via-fuchsia-500/10 to-amber-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 uppercase tracking-wider">
              AI
            </span>
          </div>
          {showTagline && (
            <span className="text-[8.5px] font-bold tracking-wider text-slate-400 dark:text-slate-400 uppercase mt-0.5 truncate">
              Learn Smart • Grow Fast • Shine Bright
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const BoostXLogo = EduSparkLogo;
export const LearnProLogo = EduSparkLogo;

