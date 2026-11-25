export type PetSpecies = "bot" | "cat" | "dog" | "dino" | "fox";
export type PetMood = "idle" | "watching" | "error" | "warning" | "celebrating";

export interface PetRenderOptions {
  species?: PetSpecies;
  mood?: PetMood;
  name?: string;
  size?: number;
}

/**
 * Monochromatic Terminal Circular Robot Avatar (Luffy Robot).
 * High-contrast phosphor white, charcoal, and deep terminal black.
 */
export function renderRobotAvatarSvg(options: PetRenderOptions): string {
  const { mood = "watching", name = "luffy", size = 100 } = options;
  const isError = mood === "error";
  const isCelebrating = mood === "celebrating";

  let visorFace = "";
  if (isError) {
    visorFace = `
      <!-- Error / Alert Expression (! !) -->
      <path d="M 44 43 L 53 52 M 53 43 L 44 52" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" filter="url(#monoTerminalGlow)" class="alert-pulse" />
      <path d="M 67 43 L 76 52 M 76 43 L 67 52" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" filter="url(#monoTerminalGlow)" class="alert-pulse" />
      <ellipse cx="60" cy="61" rx="4.5" ry="4" fill="#ffffff" filter="url(#monoTerminalGlow)" />
      <g transform="translate(42, 2)">
        <rect x="0" y="0" width="36" height="11" rx="2" fill="#ffffff" />
        <text x="18" y="8.5" font-size="7.5" fill="#000000" font-weight="900" text-anchor="middle" font-family="monospace">! ALERT</text>
      </g>
    `;
  } else if (isCelebrating) {
    visorFace = `
      <!-- Fixed / Celebrating Expression (★ ★ ⌣) -->
      <path d="M 43 47 Q 49 39 55 47" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" filter="url(#monoTerminalGlow)" />
      <path d="M 65 47 Q 71 39 77 47" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" filter="url(#monoTerminalGlow)" />
      <path d="M 52 57 Q 60 65 68 57" fill="none" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" filter="url(#monoTerminalGlow)" />
      <g transform="translate(40, 2)">
        <rect x="0" y="0" width="40" height="11" rx="2" fill="#ffffff" />
        <text x="20" y="8.5" font-size="7.5" fill="#000000" font-weight="900" text-anchor="middle" font-family="monospace">✓ FIXED</text>
      </g>
    `;
  } else {
    // Normal / Watching / Idle: Smiling Visor Eyes and Mouth (◠ ◠ ⌣)
    visorFace = `
      <!-- Phosphor White Smiling Eyes (◠ ◠) -->
      <path d="M 44 47 Q 50 39 56 47" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" filter="url(#monoTerminalGlow)" class="robot-blink" />
      <path d="M 64 47 Q 70 39 76 47" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" filter="url(#monoTerminalGlow)" class="robot-blink" />
      <!-- Phosphor White Smiling Mouth (⌣) -->
      <path d="M 53 58 Q 60 64 67 58" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" filter="url(#monoTerminalGlow)" />
    `;
  }

  return `
<svg width="${size}" height="${size}" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="mono-terminal-robot" role="img" aria-label="${escapeAttr(name)}">
  <defs>
    <filter id="monoTerminalGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <style>
    .mono-terminal-robot { display: inline-block; overflow: visible; user-select: none; }
    .robot-blink { animation: eyeBlink 4s infinite; transform-origin: 60px 47px; }
    .alert-pulse { animation: alertPulse 0.5s infinite alternate; }
    @keyframes eyeBlink {
      0%, 93%, 97%, 100% { transform: scaleY(1); opacity: 1; }
      95% { transform: scaleY(0.1); opacity: 0.2; }
    }
    @keyframes alertPulse {
      0% { opacity: 1; }
      100% { opacity: 0.35; }
    }
  </style>

  <!-- Circular Outer Terminal Chassis -->
  <circle cx="60" cy="60" r="57" fill="#0a0a0a" stroke="#2a2a2a" stroke-width="2" />
  <circle cx="60" cy="60" r="53" fill="#050505" stroke="#1c1c1c" stroke-width="1" />

  <!-- Robot Shoulders / Torso -->
  <path d="M 28 115 Q 60 88 92 115 L 96 120 L 24 120 Z" fill="#e0e0e0" stroke="#222222" stroke-width="1" />
  <ellipse cx="60" cy="94" rx="16" ry="5" fill="#141414" stroke="#333333" stroke-width="1.2" />

  <!-- Antenna -->
  <rect x="58.5" y="10" width="3" height="15" rx="1.5" fill="#888888" />
  <circle cx="60" cy="9" r="4.5" fill="#ffffff" filter="url(#monoTerminalGlow)" />

  <!-- Ear Cushions / Headphones -->
  <rect x="19" y="35" width="8" height="28" rx="4" fill="#333333" stroke="#555555" stroke-width="1.2" />
  <rect x="93" y="35" width="8" height="28" rx="4" fill="#333333" stroke="#555555" stroke-width="1.2" />

  <!-- White Helmet / Head -->
  <ellipse cx="60" cy="49" rx="36" ry="29" fill="#f5f5f5" stroke="#333333" stroke-width="1.2" />
  <path d="M 40 28 Q 60 22 80 28" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.85" />

  <!-- Visor / Face Screen (Deep Terminal OLED Black) -->
  <ellipse cx="60" cy="51" rx="27" ry="19" fill="#000000" stroke="#262626" stroke-width="1.5" />

  <!-- Visor Eyes and Expressions -->
  ${visorFace}
</svg>
  `.trim();
}

/**
 * Monochromatic Terminal Dot-Matrix Avatar Engine (Claude Code CLI Style).
 */
export function renderDottedPetSvg(options: PetRenderOptions): string {
  const { species = "cat", mood = "watching", name = "Byte", size = 100 } = options;

  const cols = 16;
  const rows = 16;
  const dotRadius = 3.8;
  const spacing = 10;
  const offset = 12;

  const pal = {
    on: "#ffffff",
    dim: "rgba(255, 255, 255, 0.75)",
    off: "rgba(255, 255, 255, 0.08)",
    border: "#262626",
    bg: "#050505",
    glow: "rgba(255, 255, 255, 0.4)",
    eye: "#ffffff"
  };

  const patterns: Record<string, string[]> = {
    cat: [
      "................",
      "..###......###..",
      ".####......####.",
      "#####......#####",
      ".####.####.####.",
      "..##########....",
      "..##EEEEEE##....",
      ".###..##..###...",
      "..###-##-###....",
      "....######......",
      "...########.....",
      "..##########..##",
      "..##########.###",
      "..##########.##.",
      "...##....##.....",
      "...##....##....."
    ],
    dog: [
      "................",
      "...##......##...",
      "..####....####..",
      "..####....####..",
      "...##.####.##...",
      "....########....",
      "...##EEEEEE##...",
      "...##########...",
      "....###--###....",
      ".....######.....",
      "....########....",
      "...##########.##",
      "..############.#",
      "..############..",
      "...##.####.##...",
      "...##......##..."
    ],
    dino: [
      "................",
      ".....########...",
      "....##########..",
      "....###EEEE##...",
      "....#########...",
      "....######......",
      "....#####--#....",
      "....########....",
      "...##########...",
      "##.##########...",
      "###.########....",
      ".###########....",
      "..#########.....",
      "...########.....",
      "....##...##.....",
      "...###...###...."
    ],
    bot: [
      ".......##.......",
      ".......##.......",
      ".....######.....",
      "....########....",
      "....#EEEEEE#....",
      "....#E####E#....",
      "....########....",
      ".....######.....",
      "......####......",
      "....########....",
      "...##########...",
      "...#..####..#...",
      "...#..####..#...",
      "....########....",
      ".....##..##.....",
      "....####.####..."
    ],
    fox: [
      "................",
      ".###........###.",
      ".####......####.",
      ".####......####.",
      "..####.##.####..",
      "...##########...",
      "...##EEEEEE##...",
      "...##########...",
      "....###--###....",
      ".....######...##",
      "....########.###",
      "...#############",
      "..##############",
      "..##########.###",
      "...##.####.##.##",
      "...##......##..."
    ]
  };

  const matrix = patterns[species] || patterns.cat;

  let dotsSvg = "";
  for (let r = 0; r < rows; r++) {
    const rowStr = matrix[r] || "................";
    for (let c = 0; c < cols; c++) {
      const char = rowStr[c] || ".";
      const cx = offset + c * spacing;
      const cy = offset + r * spacing;

      if (char === ".") {
        dotsSvg += `<circle cx="${cx}" cy="${cy}" r="1.3" fill="${pal.off}" />\n`;
      } else if (char === "E") {
        let eyeR = dotRadius + 0.5;
        let eyeClass = "mono-eye";
        if (mood === "error") {
          eyeClass = "mono-eye alert-blink";
          eyeR = dotRadius + 0.9;
        }
        dotsSvg += `<circle cx="${cx}" cy="${cy}" r="${eyeR}" fill="#ffffff" class="${eyeClass}" filter="url(#terminalGlow)" />\n`;
      } else if (char === "-") {
        dotsSvg += `<circle cx="${cx}" cy="${cy}" r="${(dotRadius * 0.8).toFixed(1)}" fill="${pal.dim}" />\n`;
      } else {
        dotsSvg += `<circle cx="${cx}" cy="${cy}" r="${dotRadius}" fill="${pal.on}" class="mono-dot" filter="url(#terminalGlow)" />\n`;
      }
    }
  }

  let headerTag = "";
  if (mood === "error") {
    headerTag = `
      <g transform="translate(62, 3)" class="mono-alert-tag">
        <rect x="0" y="0" width="48" height="9" rx="2" fill="#ffffff" />
        <text x="24" y="7" font-size="7" fill="#000000" text-anchor="middle" font-weight="900" font-family="monospace">! ALERT</text>
      </g>
    `;
  }

  return `
<svg width="${size}" height="${size}" viewBox="0 0 174 174" xmlns="http://www.w3.org/2000/svg" class="mono-terminal-avatar" role="img" aria-label="${escapeAttr(name)}">
  <defs>
    <filter id="terminalGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <style>
    .mono-terminal-avatar { display: inline-block; overflow: visible; user-select: none; }
    .mono-eye { animation: monoBlink 4s infinite; }
    .alert-blink { animation: alertPulse 0.5s infinite alternate; }
    @keyframes monoBlink {
      0%, 94%, 98%, 100% { opacity: 1; transform: scaleY(1); }
      96% { opacity: 0.1; transform: scaleY(0.2); }
    }
    @keyframes alertPulse {
      0% { opacity: 1; fill: #ffffff; }
      100% { opacity: 0.35; fill: #aaaaaa; }
    }
  </style>

  <rect x="2" y="2" width="170" height="170" rx="6" fill="${pal.bg}" stroke="${pal.border}" stroke-width="1.2" />
  <rect x="6" y="6" width="162" height="162" rx="4" fill="none" stroke="#161616" stroke-width="1" />

  ${headerTag}

  <g class="matrix-grid">
    ${dotsSvg}
  </g>
</svg>
  `.trim();
}

/**
 * Universal Avatar Selector:
 * Uses the cute Robot Avatar for 'bot' or when name is 'luffy' (or by default),
 * and Dotted Matrix Avatar for pixel species.
 */
export function renderPetAvatarSvg(options: PetRenderOptions): string {
  const species = options.species || "bot";
  if (species === "bot") {
    return renderRobotAvatarSvg(options);
  }
  return renderDottedPetSvg(options);
}

function escapeAttr(val: string): string {
  return val.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
