import React from 'react';

interface SVGProps {
  className?: string;
  size?: number | string;
}

export const SVGIllustrations: Record<string, React.FC<SVGProps>> = {
  start: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <defs>
        <linearGradient id="grad-start" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="90" height="90" rx="15" fill="url(#grad-start)" />
      <path d="M50 20 L30 45 L45 45 L45 75 L55 75 L55 45 L70 45 Z" fill="#ffffff" />
      <text x="50" y="85" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" letterSpacing="1">
        START
      </text>
    </svg>
  ),

  book: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <path d="M25 15 H75 C80 15, 80 85, 75 85 H25 C20 85, 20 15, 25 15 Z" fill="#1e40af" />
      <path d="M28 15 H75 V85 H28 C23 85, 23 15, 28 15 Z" fill="#3b82f6" />
      <path d="M25 18 H28 V82 H25 C22 82, 22 18, 25 18 Z" fill="#93c5fd" />
      <path d="M35 15 V85" stroke="#1d4ed8" strokeWidth="2" strokeDasharray="3,3" />
      <rect x="42" y="30" width="22" height="4" rx="1" fill="#fef08a" />
      <rect x="42" y="40" width="22" height="2" rx="0.5" fill="#ffffff" opacity="0.8" />
      <rect x="42" y="48" width="18" height="2" rx="0.5" fill="#ffffff" opacity="0.8" />
      <rect x="42" y="56" width="22" height="2" rx="0.5" fill="#ffffff" opacity="0.8" />
      <circle cx="53" cy="72" r="4" fill="#facc15" />
    </svg>
  ),

  one: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <circle cx="50" cy="50" r="40" fill="#a855f7" opacity="0.15" />
      <path d="M42 35 H52 V75 H40 M52 75 H58" stroke="#a855f7" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),

  'computer game': ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <rect x="15" y="20" width="70" height="45" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="3" />
      <rect x="22" y="25" width="56" height="30" rx="3" fill="#020617" />
      <circle cx="32" cy="40" r="3" fill="#22c55e" />
      <circle cx="68" cy="40" r="3" fill="#ef4444" />
      <path d="M45 40 L55 40 M50 35 L50 45" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
      <rect x="35" y="65" width="30" height="15" rx="4" fill="#334155" />
      <path d="M42 65 L40 78 M58 65 L60 78" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
      <circle cx="43" cy="72" r="2" fill="#ef4444" />
      <circle cx="57" cy="72" r="2" fill="#facc15" />
    </svg>
  ),

  pen: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <g transform="rotate(45 50 50)">
        <path d="M47 15 H53 V75 L50 85 L47 75 Z" fill="#2563eb" />
        <path d="M47 15 H53 V25 H47 Z" fill="#cbd5e1" />
        <rect x="49" y="10" width="2" height="5" fill="#475569" />
        <path d="M48 25 H52 V55 H48 Z" fill="#1e40af" />
        <path d="M49 75 H51 V80 L50 85 Z" fill="#0f172a" />
        <path d="M53 30 V45 H58 V42 H54 V30 Z" fill="#cbd5e1" />
      </g>
    </svg>
  ),

  ten: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <circle cx="50" cy="50" r="40" fill="#3b82f6" opacity="0.15" />
      <g stroke="#3b82f6" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" transform="translate(10, 0)">
        <path d="M22 35 H30 V75 M30 75" />
        <rect x="44" y="35" width="18" height="40" rx="9" />
      </g>
    </svg>
  ),

  four: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <circle cx="50" cy="50" r="40" fill="#eab308" opacity="0.15" />
      <path d="M48 30 L32 58 H58 M50 30 V75" stroke="#eab308" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),

  bike: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <circle cx="30" cy="65" r="15" stroke="#475569" strokeWidth="4" fill="none" />
      <circle cx="30" cy="65" r="5" fill="#475569" />
      <circle cx="70" cy="65" r="15" stroke="#475569" strokeWidth="4" fill="none" />
      <circle cx="70" cy="65" r="5" fill="#475569" />
      <path d="M30 65 L48 65 L58 45 L38 45 Z" stroke="#ca8a04" strokeWidth="4" strokeLinejoin="round" fill="none" />
      <path d="M30 65 L42 40 L50 40 M42 40 L40 33 L46 33" stroke="#ca8a04" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M70 65 L58 45 L55 35 L62 35" stroke="#ca8a04" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M48 65 L53 52" stroke="#475569" strokeWidth="2" />
      <circle cx="53" cy="52" r="3" fill="#ca8a04" />
    </svg>
  ),

  seven: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <circle cx="50" cy="50" r="40" fill="#f97316" opacity="0.15" />
      <path d="M32 35 H62 L44 75" stroke="#f97316" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),

  ruler: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <g transform="rotate(-30 50 50)">
        <rect x="15" y="42" width="70" height="16" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
        <path d="M25 42 V47 M35 42 V47 M45 42 V47 M55 42 V47 M65 42 V47 M75 42 V47" stroke="#475569" strokeWidth="1.5" />
        <path d="M20 42 V50 M30 42 V50 M40 42 V50 M50 42 V50 M60 42 V50 M70 42 V50 M80 42 V50" stroke="#0f172a" strokeWidth="2" />
        <text x="30" y="55" fontSize="6" fill="#475569" fontWeight="bold">1</text>
        <text x="40" y="55" fontSize="6" fill="#475569" fontWeight="bold">2</text>
        <text x="50" y="55" fontSize="6" fill="#475569" fontWeight="bold">3</text>
        <text x="60" y="55" fontSize="6" fill="#475569" fontWeight="bold">4</text>
        <text x="70" y="55" fontSize="6" fill="#475569" fontWeight="bold">5</text>
      </g>
    </svg>
  ),

  eight: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <circle cx="50" cy="50" r="40" fill="#8b5cf6" opacity="0.15" />
      <path d="M50 45 C56 45 60 41 60 36 C60 31 56 27 50 27 C44 27 40 31 40 36 C40 41 44 45 50 45 Z M50 45 C58 45 63 50 63 58 C63 66 58 71 50 71 C42 71 37 66 37 58 C37 50 42 45 50 45 Z" stroke="#8b5cf6" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),

  'go-kart': ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      {/* Background track circle hint */}
      <circle cx="50" cy="50" r="44" fill="#3b82f6" opacity="0.1" />
      
      {/* Rear Wing / Spoiler structure */}
      <path d="M 12 28 L 24 28 L 24 44 L 12 44 Z" fill="#ef4444" />
      <rect x="8" y="24" width="8" height="24" rx="2" fill="#ef4444" />
      <path d="M 16 44 L 20 54" stroke="#475569" strokeWidth="3" />
      
      {/* Engine & Exhaust Details */}
      <rect x="22" y="42" width="10" height="12" rx="2" fill="#64748b" />
      <circle cx="27" cy="48" r="3" fill="#334155" />
      <path d="M 28 42 L 18 36 L 16 38" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Chassis Body Pods */}
      <path d="M 22 56 L 76 56 L 72 65 L 26 65 Z" fill="#ef4444" />
      <path d="M 42 42 L 68 56 L 42 65 Z" fill="#dc2626" />
      
      {/* Bucket Seat */}
      <path d="M 32 58 L 36 38 L 46 42 L 42 58 Z" fill="#1e293b" />
      
      {/* Steering column and wheel */}
      <line x1="55" y1="55" x2="44" y2="44" stroke="#1e293b" strokeWidth="3" />
      <ellipse cx="44" cy="44" rx="8" ry="4" transform="rotate(-15 44 44)" fill="none" stroke="#0f172a" strokeWidth="3" />
      
      {/* Front Nose Cone & Number Plate */}
      <path d="M 72 58 L 86 61 L 82 66 L 70 65 Z" fill="#dc2626" />
      <rect x="75" y="60" width="6" height="5" rx="1" fill="#ffffff" />
      <text x="77" y="64" fontSize="4.5" fill="#1e293b" fontWeight="black" fontFamily="sans-serif">1</text>
      
      {/* Rear Wheel (Thick racing slick) */}
      <circle cx="28" cy="66" r="14" fill="#1e293b" />
      <circle cx="28" cy="66" r="6" fill="#cbd5e1" />
      <circle cx="28" cy="66" r="3" fill="#eab308" />
      
      {/* Front Wheel */}
      <circle cx="68" cy="66" r="11" fill="#1e293b" />
      <circle cx="68" cy="66" r="5" fill="#cbd5e1" />
      <circle cx="68" cy="66" r="2.5" fill="#eab308" />
    </svg>
  ),

  bag: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <path d="M30 35 L26 80 C26 84, 30 87, 34 87 H66 C70 87, 74 84, 74 80 L70 35 Z" fill="#ec4899" />
      <path d="M38 35 C38 22, 62 22, 62 35" stroke="#db2777" strokeWidth="4" strokeLinecap="round" fill="none" />
      <polygon points="50,45 53,52 61,53 55,59 57,67 50,63 43,67 45,59 39,53 47,52" fill="#ffffff" />
    </svg>
  ),

  'pencil case': ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <rect x="15" y="40" width="70" height="35" rx="12" fill="#a855f7" />
      <path d="M15 48 H85" stroke="#7e22ce" strokeWidth="3" />
      <rect x="42" y="35" width="16" height="5" rx="1" fill="#eab308" />
      <g transform="translate(18, 12) rotate(-20)">
        <rect x="5" y="10" width="6" height="30" fill="#3b82f6" />
        <polygon points="5,10 8,2 11,10" fill="#fde047" />
        <polygon points="7,4 8,2 9,4" fill="#1e3a8a" />
      </g>
      <g transform="translate(32, 10) rotate(15)">
        <rect x="5" y="10" width="6" height="30" fill="#ef4444" />
        <polygon points="5,10 8,2 11,10" fill="#fde047" />
        <polygon points="7,4 8,2 9,4" fill="#7a0e0e" />
      </g>
      <circle cx="70" cy="58" r="5" fill="#facc15" />
    </svg>
  ),

  train: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <rect x="45" y="35" width="35" height="35" rx="2" fill="#22c55e" />
      <rect x="18" y="47" width="28" height="23" fill="#15803d" />
      <rect x="65" y="28" width="10" height="8" fill="#eab308" />
      <rect x="50" y="42" width="10" height="10" fill="#ffffff" />
      <rect x="25" y="35" width="6" height="13" fill="#ef4444" />
      <polygon points="22,35 28,35 31,31 19,31" fill="#7a0e0e" />
      <rect x="12" y="70" width="76" height="5" rx="2" fill="#475569" />
      <circle cx="28" cy="74" r="9" fill="#1e293b" stroke="#ca8a04" strokeWidth="2" />
      <circle cx="28" cy="74" r="3" fill="#cbd5e1" />
      <circle cx="52" cy="74" r="9" fill="#1e293b" stroke="#ca8a04" strokeWidth="2" />
      <circle cx="52" cy="74" r="3" fill="#cbd5e1" />
      <circle cx="72" cy="74" r="9" fill="#1e293b" stroke="#ca8a04" strokeWidth="2" />
      <circle cx="72" cy="74" r="3" fill="#cbd5e1" />
    </svg>
  ),

  six: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <circle cx="50" cy="50" r="40" fill="#16a34a" opacity="0.15" />
      <path d="M56 30 C45 31 38 42 38 56 C38 64 43 71 52 71 C61 71 66 64 66 56 C66 48 61 42 52 42 C45 42 41 47 39 53" stroke="#16a34a" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),

  plane: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <g transform="translate(10, 15) rotate(10)">
        <path d="M15 42 Q35 35 65 38 L75 30 V50 L65 44 L15 42 Z" fill="#f59e0b" />
        <ellipse cx="45" cy="40" rx="35" ry="6" fill="#ca8a04" />
        <path d="M40 15 L45 40 L50 15 Z" fill="#3b82f6" />
        <path d="M40 65 L45 40 L50 65 Z" fill="#3b82f6" />
        <rect x="73" y="25" width="4" height="20" fill="#3b82f6" />
        <path d="M12 35 V47" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
        <circle cx="12" cy="41" r="2" fill="#eab308" />
      </g>
    </svg>
  ),

  kite: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <g transform="translate(10, -5) rotate(15 50 50)">
        <polygon points="50,15 75,45 50,70 25,45" fill="#3b82f6" />
        <path d="M50,15 L50,70" stroke="#ef4444" strokeWidth="2" />
        <path d="M25,45 L75,45" stroke="#ef4444" strokeWidth="2" />
        <path d="M50,70 Q55,80 48,90 T56,105" fill="none" stroke="#eab308" strokeWidth="2" />
        <polygon points="46,80 50,83 48,80" fill="#ef4444" />
        <polygon points="50,92 54,95 52,92" fill="#22c55e" />
        <polygon points="48,100 52,103 50,100" fill="#3b82f6" />
      </g>
    </svg>
  ),

  five: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <circle cx="50" cy="50" r="40" fill="#ef4444" opacity="0.15" />
      <path d="M58 35 H38 V50 C42 49 53 47 58 52 C63 57 62 67 55 71 C48 74 41 72 38 67" stroke="#ef4444" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),

  monster: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <ellipse cx="50" cy="62" rx="25" ry="20" fill="#22c55e" />
      <rect x="35" y="32" width="30" height="25" rx="10" fill="#22c55e" />
      <path d="M28 50 Q15 45 25 35" fill="none" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
      <path d="M72 50 Q85 45 75 35" fill="none" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
      <rect x="32" y="74" width="8" height="15" rx="3" fill="#15803d" />
      <rect x="60" y="74" width="8" height="15" rx="3" fill="#15803d" />
      <circle cx="36" cy="35" r="7" fill="#ffffff" stroke="#15803d" strokeWidth="1.5" />
      <circle cx="36" cy="35" r="3" fill="#000000" />
      <circle cx="50" cy="30" r="7" fill="#ffffff" stroke="#15803d" strokeWidth="1.5" />
      <circle cx="50" cy="30" r="3" fill="#000000" />
      <circle cx="64" cy="35" r="7" fill="#ffffff" stroke="#15803d" strokeWidth="1.5" />
      <circle cx="64" cy="35" r="3" fill="#000000" />
      <path d="M42 62 Q50 70 58 62" fill="none" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
      <polygon points="44,62 46,65 48,62" fill="#ffffff" />
      <polygon points="56,62 54,65 52,62" fill="#ffffff" />
    </svg>
  ),

  pencil: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <g transform="rotate(45 50 50)">
        <rect x="44" y="15" width="12" height="55" fill="#facc15" />
        <rect x="44" y="15" width="12" height="8" fill="#fda4af" />
        <rect x="44" y="23" width="12" height="3" fill="#94a3b8" />
        <polygon points="44,70 56,70 50,85" fill="#fde047" />
        <polygon points="48,80 52,80 50,85" fill="#1e293b" />
        <rect x="48" y="26" width="4" height="44" fill="#ca8a04" />
      </g>
    </svg>
  ),

  doll: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <circle cx="50" cy="32" r="14" fill="#fed7aa" />
      <path d="M38 46 L30 65 L35 66 L42 50 Z" fill="#ca8a04" />
      <path d="M62 46 L70 65 L65 66 L58 50 Z" fill="#ca8a04" />
      <path d="M36 46 H64 L68 80 H32 Z" fill="#ca8a04" fillRule="evenodd" />
      <circle cx="48" cy="55" r="2" fill="#ffffff" />
      <circle cx="52" cy="65" r="2" fill="#ffffff" />
      <circle cx="45" cy="30" r="2.5" fill="#3b82f6" />
      <circle cx="55" cy="30" r="2.5" fill="#3b82f6" />
      <path d="M46 36 Q50 40 54 36" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      <path d="M35 24 Q38 32 32 38" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
      <path d="M65 24 Q62 32 68 38" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
      <circle cx="30" cy="38" r="4" fill="#f43f5e" />
      <circle cx="70" cy="38" r="4" fill="#f43f5e" />
    </svg>
  ),

  three: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <circle cx="50" cy="50" r="40" fill="#ea580c" opacity="0.15" />
      <path d="M38 35 H58 L46 49 C54 49 61 54 61 61 C61 68 54 72 45 72 C39 72 36 68 35 65" stroke="#ea580c" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),

  car: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <path d="M15 52 L18 40 Q25 32 45 32 Q65 32 72 40 L85 52 Z" fill="#1d4ed8" />
      <rect x="12" y="50" width="76" height="15" rx="5" fill="#2563eb" />
      <circle cx="30" cy="65" r="10" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
      <circle cx="30" cy="65" r="3" fill="#cbd5e1" />
      <circle cx="70" cy="65" r="10" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
      <circle cx="70" cy="65" r="3" fill="#cbd5e1" />
      <path d="M25 48 H45 V37 H28 Z" fill="#93c5fd" />
      <path d="M52 48 H75 L70 40 H52 Z" fill="#93c5fd" />
      <circle cx="16" cy="56" r="3" fill="#fef08a" />
      <rect x="80" y="53" width="5" height="4" fill="#ef4444" />
    </svg>
  ),

  two: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <circle cx="50" cy="50" r="40" fill="#7e22ce" opacity="0.15" />
      <path d="M36 40 C36 31 44 26 51 28 C57 30 61 36 59 42 C57 48 51 53 45 58 L36 67 H62" stroke="#7e22ce" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),

  rubber: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <g transform="rotate(20 50 50)">
        <path d="M20 35 L55 35 L65 65 L30 65 Z" fill="#ef4444" />
        <path d="M55 35 L80 35 L90 65 L65 65 Z" fill="#3b82f6" />
        <rect x="48" y="32" width="10" height="36" fill="#1e293b" opacity="0.1" />
      </g>
    </svg>
  ),

  nine: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <circle cx="50" cy="50" r="40" fill="#dc2626" opacity="0.15" />
      <path d="M44 70 C55 69 62 58 62 44 C62 36 57 29 48 29 C39 29 34 36 34 44 C34 52 39 58 48 58 C55 58 59 53 61 47" stroke="#dc2626" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),

  notebook: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <rect x="25" y="15" width="55" height="70" rx="4" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
      <rect x="25" y="15" width="8" height="70" fill="#22c55e" />
      <path d="M20 25 H28 M20 35 H28 M20 45 H28 M20 55 H28 M20 65 H28 M20 75 H28" fill="none" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
      <line x1="38" y1="30" x2="72" y2="30" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="38" y1="40" x2="72" y2="40" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="38" y1="50" x2="72" y2="50" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="38" y1="60" x2="72" y2="60" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="38" y1="70" x2="72" y2="70" stroke="#cbd5e1" strokeWidth="2" />
    </svg>
  ),

  ball: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <circle cx="50" cy="50" r="35" fill="#facc15" />
      <path d="M50 15 C30 25, 30 75, 50 85 Z" fill="#3b82f6" />
      <path d="M50 15 C70 25, 70 75, 50 85 Z" fill="#ef4444" />
      <circle cx="50" cy="50" r="35" fill="none" stroke="#1e293b" strokeWidth="3" />
      <path d="M50 15 V85" fill="none" stroke="#1e293b" strokeWidth="2" />
      <circle cx="50" cy="50" r="6" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
    </svg>
  ),

  finish: ({ className = '', size = '100%' }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <defs>
        <linearGradient id="grad-finish" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="90" height="90" rx="15" fill="url(#grad-finish)" />
      <polygon points="50,15 59,34 80,37 65,52 68,73 50,63 32,73 35,52 20,37 41,34" fill="#ffffff" />
      <polygon points="50,23 56,36 71,38 60,49 62,64 50,56 38,64 40,49 29,38 44,36" fill="#facc15" />
      <text x="50" y="85" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="1">
        FINISH
      </text>
    </svg>
  ),
};

interface SpellingImageProps {
  word: string;
  className?: string;
  size?: number | string;
}

export const SpellingImage: React.FC<SpellingImageProps> = ({ word, className = '', size = '100%' }) => {
  const normWord = word.toLowerCase().trim();
  const Comp = SVGIllustrations[normWord] || SVGIllustrations.book;
  return <Comp className={className} size={size} />;
};
