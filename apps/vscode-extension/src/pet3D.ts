export type PetSpecies = "dog" | "cat" | "dino" | "bot" | "fox";
export type PetMood = "idle" | "watching" | "error" | "warning" | "celebrating";

export interface Pet3DRenderOptions {
  species: PetSpecies;
  mood: PetMood;
  name: string;
  size?: number;
}

/**
 * Generates an Isometric 3D Hovering Pet with floating bobbing animation,
 * depth shading (top, front, side faces), glowing LED matrix eyes, and dynamic ground shadow.
 */
export function render3DPetSvg(options: Pet3DRenderOptions): string {
  const { species, mood, name, size = 180 } = options;

  // Mood-based color palettes with 3D depth facets (highlight, base, shadow, glow)
  const palettes: Record<PetMood, { main: string; top: string; side: string; glow: string; eye: string; ring: string }> = {
    idle: {
      main: "#38bdf8", // Cyber Cyan
      top: "#7dd3fc",
      side: "#0284c7",
      glow: "rgba(56, 189, 248, 0.45)",
      eye: "#ffffff",
      ring: "rgba(56, 189, 248, 0.3)"
    },
    watching: {
      main: "#00f5d4", // Emerald Cyan
      top: "#5eead4",
      side: "#0f766e",
      glow: "rgba(0, 245, 212, 0.5)",
      eye: "#ffffff",
      ring: "rgba(0, 245, 212, 0.35)"
    },
    error: {
      main: "#f43f5e", // Alert Crimson
      top: "#fda4af",
      side: "#be123c",
      glow: "rgba(244, 63, 94, 0.6)",
      eye: "#ffffff",
      ring: "rgba(244, 63, 94, 0.4)"
    },
    warning: {
      main: "#f59e0b", // Amber
      top: "#fde68a",
      side: "#b45309",
      glow: "rgba(245, 158, 11, 0.5)",
      eye: "#ffffff",
      ring: "rgba(245, 158, 11, 0.35)"
    },
    celebrating: {
      main: "#10b981", // Emerald
      top: "#6ee7b7",
      side: "#047857",
      glow: "rgba(16, 185, 129, 0.55)",
      eye: "#ffffff",
      ring: "rgba(16, 185, 129, 0.35)"
    }
  };

  const pal = palettes[mood] || palettes.idle;

  // Render species-specific 3D isometric geometries
  let pet3DGeometry = "";

  if (species === "bot") {
    // 3D Mecha Drone Bot with floating thrusters, visor, and antenna ring
    pet3DGeometry = `
      <!-- Antenna with 3D glowing sphere -->
      <line x1="90" y1="36" x2="90" y2="24" stroke="${pal.top}" stroke-width="2.5" stroke-linecap="round" />
      <circle cx="90" cy="22" r="5" fill="${pal.top}" filter="url(#glow3d)" />

      <!-- Head 3D Cube / Chassis -->
      <!-- Top Face -->
      <polygon points="90,36 120,48 90,60 60,48" fill="${pal.top}" />
      <!-- Left Face -->
      <polygon points="60,48 90,60 90,86 60,74" fill="${pal.main}" />
      <!-- Right Face -->
      <polygon points="90,60 120,48 120,74 90,86" fill="${pal.side}" />

      <!-- 3D Visor Screen -->
      <polygon points="68,54 88,62 88,72 68,64" fill="#030712" />
      <circle cx="76" cy="62" r="2.8" fill="${pal.eye}" class="eye-glow" filter="url(#glow3d)" />
      <polygon points="92,62 112,54 112,64 92,72" fill="#030712" />
      <circle cx="104" cy="62" r="2.8" fill="${pal.eye}" class="eye-glow" filter="url(#glow3d)" />

      <!-- Body Torso Cube -->
      <!-- Top Face -->
      <polygon points="90,88 114,98 90,108 66,98" fill="${pal.top}" />
      <!-- Left Face -->
      <polygon points="66,98 90,108 90,126 66,116" fill="${pal.main}" />
      <!-- Right Face -->
      <polygon points="90,108 114,98 114,116 90,126" fill="${pal.side}" />

      <!-- Hover Thruster Rings -->
      <ellipse cx="90" cy="132" rx="16" ry="6" fill="none" stroke="${pal.top}" stroke-width="2" opacity="0.8" />
      <ellipse cx="90" cy="135" rx="10" ry="3.5" fill="${pal.main}" filter="url(#glow3d)" />
    `;
  } else if (species === "cat") {
    // 3D Pixel Neko with pointed 3D ears, whiskers, and curling 3D tail
    pet3DGeometry = `
      <!-- Left 3D Ear -->
      <polygon points="64,30 76,46 54,50" fill="${pal.top}" />
      <polygon points="64,30 54,50 58,40" fill="${pal.side}" />

      <!-- Right 3D Ear -->
      <polygon points="116,30 126,50 104,46" fill="${pal.top}" />
      <polygon points="116,30 104,46 110,40" fill="${pal.side}" />

      <!-- Head 3D Cube -->
      <polygon points="90,44 118,56 90,68 62,56" fill="${pal.top}" />
      <polygon points="62,56 90,68 90,92 62,80" fill="${pal.main}" />
      <polygon points="90,68 118,56 118,80 90,92" fill="${pal.side}" />

      <!-- Glowing 3D Eyes -->
      <ellipse cx="76" cy="72" rx="3.5" ry="4" fill="${pal.eye}" class="eye-glow" filter="url(#glow3d)" />
      <ellipse cx="104" cy="72" rx="3.5" ry="4" fill="${pal.eye}" class="eye-glow" filter="url(#glow3d)" />

      <!-- Nose and Whisker dots -->
      <circle cx="90" cy="78" r="2" fill="#ffffff" />
      <line x1="56" y1="72" x2="44" y2="70" stroke="${pal.top}" stroke-width="1.5" stroke-linecap="round" />
      <line x1="56" y1="77" x2="44" y2="79" stroke="${pal.top}" stroke-width="1.5" stroke-linecap="round" />
      <line x1="124" y1="72" x2="136" y2="70" stroke="${pal.top}" stroke-width="1.5" stroke-linecap="round" />
      <line x1="124" y1="77" x2="136" y2="79" stroke="${pal.top}" stroke-width="1.5" stroke-linecap="round" />

      <!-- Body 3D Cube -->
      <polygon points="90,92 114,102 90,112 66,102" fill="${pal.top}" />
      <polygon points="66,102 90,112 90,130 66,120" fill="${pal.main}" />
      <polygon points="90,112 114,102 114,120 90,130" fill="${pal.side}" />

      <!-- 3D Paws -->
      <polygon points="74,128 82,132 82,136 74,132" fill="${pal.top}" />
      <polygon points="98,132 106,128 106,132 98,136" fill="${pal.top}" />

      <!-- Curling 3D Tail -->
      <path d="M 114,120 Q 134,116 130,98 Q 126,88 136,88" fill="none" stroke="${pal.top}" stroke-width="4" stroke-linecap="round" filter="url(#glow3d)" />
    `;
  } else if (species === "dino") {
    // 3D Dev Dino with isometric snout, ridge spikes, and tail
    pet3DGeometry = `
      <!-- Head Ridge Spikes -->
      <polygon points="76,32 82,38 72,40" fill="${pal.top}" />
      <polygon points="86,28 92,34 82,36" fill="${pal.top}" />

      <!-- Head 3D Isometric Volume -->
      <polygon points="90,38 122,50 90,62 58,50" fill="${pal.top}" />
      <polygon points="58,50 90,62 90,86 58,74" fill="${pal.main}" />
      <polygon points="90,62 122,50 122,74 90,86" fill="${pal.side}" />

      <!-- Eye -->
      <ellipse cx="76" cy="64" rx="3.5" ry="4" fill="${pal.eye}" class="eye-glow" filter="url(#glow3d)" />
      <ellipse cx="104" cy="64" rx="3.5" ry="4" fill="${pal.eye}" class="eye-glow" filter="url(#glow3d)" />

      <!-- Dino Snout / Teeth -->
      <polygon points="90,74 100,78 90,82 80,78" fill="#ffffff" opacity="0.8" />

      <!-- Body 3D Volume -->
      <polygon points="90,86 116,96 90,106 64,96" fill="${pal.top}" />
      <polygon points="64,96 90,106 90,126 64,116" fill="${pal.main}" />
      <polygon points="90,106 116,96 116,116 90,126" fill="${pal.side}" />

      <!-- Dino Arms -->
      <line x1="72" y1="104" x2="62" y2="108" stroke="${pal.top}" stroke-width="3" stroke-linecap="round" />
      <line x1="108" y1="104" x2="118" y2="108" stroke="${pal.top}" stroke-width="3" stroke-linecap="round" />

      <!-- Tail -->
      <polygon points="64,116 46,122 56,128 64,124" fill="${pal.side}" />
    `;
  } else if (species === "fox") {
    // 3D Glitch Fox with large triangular faceted ears and fluffy tail
    pet3DGeometry = `
      <!-- Left Fox Ear -->
      <polygon points="60,26 74,44 50,48" fill="${pal.top}" />
      <polygon points="60,26 50,48 54,38" fill="${pal.side}" />
      <polygon points="60,34 68,44 56,46" fill="#ffffff" />

      <!-- Right Fox Ear -->
      <polygon points="120,26 130,48 106,44" fill="${pal.top}" />
      <polygon points="120,26 106,44 112,38" fill="${pal.side}" />
      <polygon points="120,34 112,44 124,46" fill="#ffffff" />

      <!-- 3D Face -->
      <polygon points="90,42 120,54 90,66 60,54" fill="${pal.top}" />
      <polygon points="60,54 90,66 90,92 60,80" fill="${pal.main}" />
      <polygon points="90,66 120,54 120,80 90,92" fill="${pal.side}" />

      <!-- Fox Eyes -->
      <polygon points="70,66 82,70 76,74" fill="${pal.eye}" class="eye-glow" filter="url(#glow3d)" />
      <polygon points="110,66 98,70 104,74" fill="${pal.eye}" class="eye-glow" filter="url(#glow3d)" />
      <circle cx="90" cy="80" r="2.5" fill="#ffffff" />

      <!-- Body -->
      <polygon points="90,92 114,102 90,112 66,102" fill="${pal.top}" />
      <polygon points="66,102 90,112 90,130 66,120" fill="${pal.main}" />
      <polygon points="90,112 114,102 114,120 90,130" fill="${pal.side}" />

      <!-- Bushy Fox Tail -->
      <polygon points="114,116 138,104 144,120 120,130" fill="${pal.top}" filter="url(#glow3d)" />
      <polygon points="138,104 144,120 152,112" fill="#ffffff" />
    `;
  } else {
    // 3D Cyber Pup (Dog) - Default
    pet3DGeometry = `
      <!-- Left Floppy 3D Ear -->
      <polygon points="54,42 66,36 62,64 50,68" fill="${pal.top}" />
      <polygon points="50,68 62,64 58,74 46,76" fill="${pal.side}" />

      <!-- Right Floppy 3D Ear -->
      <polygon points="126,42 114,36 118,64 130,68" fill="${pal.top}" />
      <polygon points="130,68 118,64 122,74 134,76" fill="${pal.side}" />

      <!-- Head 3D Cube -->
      <polygon points="90,40 118,52 90,64 62,52" fill="${pal.top}" />
      <polygon points="62,52 90,64 90,88 62,76" fill="${pal.main}" />
      <polygon points="90,64 118,52 118,76 90,88" fill="${pal.side}" />

      <!-- Glowing 3D Eyes -->
      <circle cx="76" cy="66" r="3.5" fill="${pal.eye}" class="eye-glow" filter="url(#glow3d)" />
      <circle cx="104" cy="66" r="3.5" fill="${pal.eye}" class="eye-glow" filter="url(#glow3d)" />

      <!-- Cute Snout & Nose -->
      <polygon points="90,72 100,76 90,82 80,76" fill="#0b1329" />
      <circle cx="90" cy="75" r="2.2" fill="${pal.top}" />

      <!-- Cyber Collar Ring -->
      <polygon points="90,88 114,98 90,104 66,98" fill="${pal.top}" filter="url(#glow3d)" />

      <!-- Torso 3D Cube -->
      <polygon points="90,102 114,110 90,120 66,110" fill="${pal.top}" />
      <polygon points="66,110 90,120 90,134 66,124" fill="${pal.main}" />
      <polygon points="90,120 114,110 114,124 90,134" fill="${pal.side}" />

      <!-- Wagging 3D Tail -->
      <polygon points="114,122 132,112 136,118 118,128" fill="${pal.top}" class="tail-wag" filter="url(#glow3d)" />
    `;
  }

  // Floating Status Holo-Crown
  let statusCrown = "";
  if (mood === "error") {
    statusCrown = `
      <g class="pulse-alert" transform="translate(76, 6)">
        <polygon points="14,0 28,14 14,28 0,14" fill="#f43f5e" filter="url(#glow3d)" />
        <text x="14" y="19" font-size="14" fill="#ffffff" text-anchor="middle" font-weight="900" font-family="system-ui">!</text>
      </g>
    `;
  } else if (mood === "watching") {
    statusCrown = `
      <g class="spin-ring">
        <ellipse cx="90" cy="20" rx="36" ry="10" fill="none" stroke="${pal.main}" stroke-width="1.2" stroke-dasharray="8 6" opacity="0.6" />
      </g>
    `;
  } else if (mood === "celebrating") {
    statusCrown = `
      <g class="sparkles-3d">
        <text x="36" y="28" font-size="14" fill="${pal.top}" filter="url(#glow3d)">✦</text>
        <text x="134" y="34" font-size="12" fill="${pal.main}" filter="url(#glow3d)">✦</text>
        <text x="124" y="110" font-size="10" fill="#f59e0b" filter="url(#glow3d)">★</text>
      </g>
    `;
  }

  return `
<svg width="${size}" height="${size}" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg" class="pet-3d-svg" role="img" aria-label="${escapeAttr(name)} 3D companion">
  <defs>
    <filter id="glow3d" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3.2" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.75" />
      <stop offset="50%" stop-color="#050814" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="podiumGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1e293b" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#090d16" stop-opacity="0.95" />
    </radialGradient>
  </defs>

  <style>
    .pet-3d-svg {
      overflow: visible;
      user-select: none;
      filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.45));
    }
    .hover-layer {
      animation: hoverBob 3.2s ease-in-out infinite alternate;
      transform-origin: 90px 90px;
    }
    .shadow-layer {
      animation: shadowScale 3.2s ease-in-out infinite alternate;
      transform-origin: 90px 162px;
    }
    .spin-ring {
      animation: spinHolo 10s linear infinite;
      transform-origin: 90px 20px;
    }
    .pulse-alert {
      animation: pulseAlert 0.8s ease-in-out infinite alternate;
      transform-origin: 90px 20px;
    }
    .tail-wag {
      animation: wagTail 1.4s ease-in-out infinite alternate;
      transform-origin: 114px 122px;
    }
    .eye-glow {
      animation: eyeBlink 4s infinite;
    }
    @keyframes hoverBob {
      0% { transform: translateY(6px); }
      100% { transform: translateY(-10px); }
    }
    @keyframes shadowScale {
      0% { transform: scale(1.15); opacity: 0.8; }
      100% { transform: scale(0.75); opacity: 0.25; }
    }
    @keyframes spinHolo {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes pulseAlert {
      0% { transform: translate(76px, 6px) scale(0.9); }
      100% { transform: translate(76px, 6px) scale(1.15); }
    }
    @keyframes wagTail {
      0% { transform: rotate(-6deg); }
      100% { transform: rotate(14deg); }
    }
    @keyframes eyeBlink {
      0%, 94%, 98%, 100% { transform: scaleY(1); }
      96% { transform: scaleY(0.1); }
    }
  </style>

  <!-- 3D Holographic Base Podium -->
  <ellipse cx="90" cy="162" rx="64" ry="16" fill="url(#podiumGrad)" stroke="${pal.ring}" stroke-width="1.2" />
  <ellipse cx="90" cy="162" rx="46" ry="11" fill="none" stroke="${pal.main}" stroke-width="0.8" stroke-dasharray="4 4" opacity="0.5" />

  <!-- Dynamic Ground Shadow (Shrinks when pet hovers up) -->
  <ellipse cx="90" cy="162" rx="42" ry="10" fill="url(#shadowGrad)" class="shadow-layer" />

  <!-- Hovering 3D Pet Layer -->
  <g class="hover-layer">
    ${statusCrown}
    ${pet3DGeometry}
  </g>
</svg>
  `.trim();
}

function escapeAttr(val: string): string {
  return val.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
