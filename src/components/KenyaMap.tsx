import { useState } from "react";
import { motion } from "framer-motion";

interface KenyaMapProps {
  selectedCounty: string;
  onSelectCounty: (county: string) => void;
  countyData?: Record<string, { risk: string; sales: number }>;
}

// Full Kenya map with all 47 counties - approximate SVG paths
// Coffee-producing counties are interactive, others are displayed for context
const COFFEE_COUNTIES: Record<string, { d: string; cx: number; cy: number }> = {
  Nyeri: {
    d: "M248,218 L260,208 L275,212 L280,225 L272,238 L258,240 L246,232 Z",
    cx: 262, cy: 225,
  },
  Kirinyaga: {
    d: "M275,212 L290,208 L300,218 L296,232 L280,235 L272,225 Z",
    cx: 286, cy: 222,
  },
  "Murang'a": {
    d: "M240,238 L258,240 L272,238 L268,258 L252,268 L238,260 Z",
    cx: 255, cy: 252,
  },
  Kiambu: {
    d: "M230,260 L252,268 L248,290 L232,296 L220,282 L222,265 Z",
    cx: 236, cy: 278,
  },
  Embu: {
    d: "M296,232 L300,218 L318,222 L325,240 L315,255 L300,248 Z",
    cx: 310, cy: 238,
  },
  Meru: {
    d: "M275,170 L300,162 L325,172 L330,195 L318,222 L300,218 L290,208 L275,212 L268,192 Z",
    cx: 300, cy: 192,
  },
  Machakos: {
    d: "M252,268 L268,258 L290,270 L298,300 L278,320 L255,310 L248,290 Z",
    cx: 272, cy: 290,
  },
  Bungoma: {
    d: "M95,198 L115,188 L130,195 L132,215 L118,228 L100,222 Z",
    cx: 115, cy: 208,
  },
};

// Non-coffee counties (background context)
const OTHER_COUNTIES: Record<string, { d: string; cx: number; cy: number }> = {
  Mombasa: { d: "M320,405 L335,400 L340,415 L330,420 Z", cx: 330, cy: 410 },
  Kwale: { d: "M300,400 L320,405 L330,420 L320,440 L295,435 L290,415 Z", cx: 310, cy: 420 },
  Kilifi: { d: "M320,360 L340,355 L345,380 L340,400 L320,405 L310,385 Z", cx: 330, cy: 378 },
  "Tana River": { d: "M295,310 L330,300 L345,330 L340,355 L320,360 L300,350 L285,330 Z", cx: 318, cy: 332 },
  Lamu: { d: "M345,310 L370,305 L375,330 L360,340 L345,330 Z", cx: 358, cy: 320 },
  "Taita Taveta": { d: "M270,370 L300,360 L310,385 L300,400 L275,405 L262,390 Z", cx: 286, cy: 385 },
  Garissa: { d: "M330,240 L380,230 L395,270 L385,310 L345,310 L330,300 L325,260 Z", cx: 358, cy: 272 },
  Wajir: { d: "M370,150 L420,140 L435,180 L425,220 L395,230 L380,230 L370,190 Z", cx: 400, cy: 185 },
  Mandera: { d: "M400,80 L440,75 L450,110 L440,140 L420,140 L400,120 Z", cx: 425, cy: 108 },
  Marsabit: { d: "M290,100 L340,90 L370,105 L370,150 L340,160 L310,155 L290,130 Z", cx: 330, cy: 125 },
  Isiolo: { d: "M290,155 L310,155 L340,160 L340,195 L325,210 L300,205 L285,185 Z", cx: 312, cy: 180 },
  Turkana: { d: "M150,50 L200,42 L230,55 L240,100 L220,130 L180,140 L155,120 L140,85 Z", cx: 192, cy: 90 },
  "West Pokot": { d: "M130,140 L155,130 L168,145 L162,168 L140,175 L128,160 Z", cx: 148, cy: 155 },
  Samburu: { d: "M230,130 L270,120 L290,130 L290,155 L275,170 L250,168 L232,150 Z", cx: 260, cy: 145 },
  "Trans Nzoia": { d: "M115,188 L130,180 L145,185 L148,200 L135,208 L118,205 Z", cx: 132, cy: 195 },
  Baringo: { d: "M175,170 L200,162 L215,175 L218,200 L200,210 L178,202 Z", cx: 198, cy: 188 },
  "Uasin Gishu": { d: "M140,195 L160,188 L175,195 L172,215 L155,222 L138,212 Z", cx: 158, cy: 206 },
  "Elgeyo Marakwet": { d: "M162,168 L175,170 L178,190 L170,200 L158,195 L155,180 Z", cx: 166, cy: 182 },
  Nandi: { d: "M130,215 L155,222 L152,240 L135,248 L120,238 Z", cx: 138, cy: 232 },
  Laikipia: { d: "M220,170 L250,168 L260,180 L255,200 L235,210 L218,200 Z", cx: 238, cy: 188 },
  Nakuru: { d: "M195,215 L220,210 L235,220 L232,248 L210,260 L192,248 Z", cx: 214, cy: 235 },
  Narok: { d: "M170,268 L195,260 L210,270 L215,300 L195,318 L172,310 L165,288 Z", cx: 192, cy: 290 },
  Kajiado: { d: "M215,300 L240,295 L255,310 L250,340 L230,355 L210,342 L208,318 Z", cx: 232, cy: 325 },
  Kericho: { d: "M148,240 L165,235 L178,248 L175,268 L158,275 L145,262 Z", cx: 162, cy: 255 },
  Bomet: { d: "M158,275 L175,268 L185,280 L180,298 L165,305 L152,292 Z", cx: 168, cy: 288 },
  Kakamega: { d: "M100,222 L118,228 L122,248 L108,260 L92,252 L88,235 Z", cx: 105, cy: 242 },
  Vihiga: { d: "M108,260 L122,258 L125,272 L115,278 L105,270 Z", cx: 115, cy: 268 },
  Kisumu: { d: "M108,275 L125,272 L135,285 L128,300 L112,298 L105,288 Z", cx: 118, cy: 288 },
  Siaya: { d: "M80,262 L100,258 L108,275 L100,290 L82,288 L75,275 Z", cx: 92, cy: 275 },
  "Homa Bay": { d: "M82,295 L100,290 L112,305 L108,325 L90,330 L78,315 Z", cx: 95, cy: 310 },
  Migori: { d: "M78,325 L95,320 L108,335 L102,355 L85,358 L72,342 Z", cx: 90, cy: 340 },
  Kisii: { d: "M115,298 L132,295 L140,310 L135,325 L118,328 L110,315 Z", cx: 125, cy: 312 },
  Nyamira: { d: "M128,280 L145,278 L150,292 L142,305 L130,300 Z", cx: 139, cy: 292 },
  Nyandarua: { d: "M218,200 L240,195 L248,218 L240,238 L225,242 L215,225 Z", cx: 230, cy: 218 },
  Nairobi: { d: "M242,290 L255,288 L260,300 L252,308 L240,305 Z", cx: 250, cy: 298 },
  Kitui: { d: "M310,280 L340,270 L355,300 L348,335 L320,340 L305,315 Z", cx: 330, cy: 306 },
  Makueni: { d: "M275,320 L305,315 L312,345 L300,370 L272,365 L265,340 Z", cx: 288, cy: 342 },
  Tharaka_Nithi: { d: "M300,205 L318,210 L320,230 L308,240 L295,230 Z", cx: 308, cy: 222 },
  "Tharaka-Nithi": { d: "M300,205 L318,210 L320,230 L308,240 L295,230 Z", cx: 308, cy: 222 },
};

const riskColors: Record<string, string> = {
  low: "hsl(152 60% 45%)",
  medium: "hsl(36 80% 55%)",
  high: "hsl(15 80% 55%)",
  critical: "hsl(0 72% 51%)",
};

export function KenyaMap({ selectedCounty, onSelectCounty, countyData }: KenyaMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative">
      <svg viewBox="50 30 420 410" className="w-full h-auto" style={{ maxHeight: 560 }}>
        {/* Kenya country outline */}
        <path
          d="M72,340 L78,358 L85,370 L100,380 L120,378 L150,370 L180,365 L210,342 L230,355 L250,340 L265,365 L272,370 L275,405 L290,415 L295,435 L310,440 L320,440 L330,420 L340,415 L345,380 L340,355 L345,330 L360,340 L375,330 L370,305 L385,310 L395,270 L425,220 L435,180 L450,110 L440,75 L400,80 L370,105 L340,90 L290,100 L240,100 L200,42 L150,50 L140,85 L128,140 L115,165 L95,185 L80,210 L75,240 L72,262 L72,290 Z"
          fill="hsl(222, 41%, 7%)"
          stroke="hsl(222, 30%, 20%)"
          strokeWidth="1.5"
        />

        {/* Lake Victoria (approximate) */}
        <path
          d="M72,270 L88,265 L100,272 L105,290 L100,310 L90,320 L78,315 L72,295 Z"
          fill="hsl(210, 50%, 15%)"
          stroke="hsl(210, 40%, 25%)"
          strokeWidth="0.5"
          opacity="0.5"
        />

        {/* Non-coffee counties (background) */}
        {Object.entries(OTHER_COUNTIES).map(([county, { d, cx, cy }]) => (
          <g key={county}>
            <path
              d={d}
              fill="hsl(222, 30%, 10%)"
              fillOpacity="0.4"
              stroke="hsl(222, 30%, 18%)"
              strokeWidth="0.5"
            />
            <text
              x={cx} y={cy}
              textAnchor="middle" dominantBaseline="central"
              fill="hsl(215, 20%, 35%)"
              fontSize="5.5"
              fontFamily="Inter, system-ui"
              className="pointer-events-none select-none"
            >
              {county.replace("_", " ")}
            </text>
          </g>
        ))}

        {/* Coffee counties (interactive) */}
        {Object.entries(COFFEE_COUNTIES).map(([county, { d, cx, cy }]) => {
          const isSelected = selectedCounty === county;
          const isHovered = hovered === county;
          const risk = countyData?.[county]?.risk || "low";
          const fillColor = isSelected
            ? riskColors[risk] || "hsl(152, 60%, 45%)"
            : isHovered
              ? "hsl(222, 30%, 22%)"
              : "hsl(222, 30%, 14%)";

          return (
            <g key={county}>
              <motion.path
                d={d}
                fill={fillColor}
                fillOpacity={isSelected ? 0.7 : 0.5}
                stroke={isSelected ? "hsl(152, 60%, 45%)" : "hsl(222, 30%, 25%)"}
                strokeWidth={isSelected ? 2.5 : 1}
                className="cursor-pointer transition-colors"
                onClick={() => onSelectCounty(county)}
                onMouseEnter={() => setHovered(county)}
                onMouseLeave={() => setHovered(null)}
                whileHover={{ scale: 1.03 }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              />
              <text
                x={cx} y={cy}
                textAnchor="middle" dominantBaseline="central"
                fill={isSelected ? "hsl(210, 40%, 98%)" : "hsl(215, 20%, 65%)"}
                fontSize={county === "Murang'a" ? "6" : "7"}
                fontWeight={isSelected ? "700" : "600"}
                className="pointer-events-none select-none"
                fontFamily="'Space Grotesk', system-ui"
              >
                {county}
              </text>
              {countyData?.[county] && (
                <text
                  x={cx} y={cy + 10}
                  textAnchor="middle"
                  fill={riskColors[risk]}
                  fontSize="5.5"
                  className="pointer-events-none select-none"
                  fontFamily="Inter, system-ui"
                >
                  {countyData[county].sales} MT/wk
                </text>
              )}
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(60, 420)">
          {[
            { label: "Low Risk", color: riskColors.low },
            { label: "Medium", color: riskColors.medium },
            { label: "High", color: riskColors.high },
            { label: "Critical", color: riskColors.critical },
          ].map((item, i) => (
            <g key={item.label} transform={`translate(${i * 80}, 0)`}>
              <rect width="8" height="8" rx="2" fill={item.color} fillOpacity="0.7" />
              <text x="12" y="7" fill="hsl(215, 20%, 55%)" fontSize="6" fontFamily="Inter, system-ui">
                {item.label}
              </text>
            </g>
          ))}
        </g>

        {/* Title */}
        <text x="260" y="455" textAnchor="middle" fill="hsl(215, 20%, 40%)" fontSize="7" fontFamily="Inter, system-ui">
          ☕ Coffee-producing counties highlighted
        </text>
      </svg>
    </div>
  );
}
