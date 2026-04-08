import { useState } from "react";
import { motion } from "framer-motion";

interface KenyaMapProps {
  selectedCounty: string;
  onSelectCounty: (county: string) => void;
  countyData?: Record<string, { risk: string; sales: number }>;
}

// Simplified SVG paths for Kenya coffee counties (approximate shapes)
const COUNTY_PATHS: Record<string, { d: string; cx: number; cy: number }> = {
  Nyeri: {
    d: "M200,120 L230,105 L260,115 L265,145 L245,165 L215,160 L195,145 Z",
    cx: 230, cy: 135,
  },
  Kirinyaga: {
    d: "M260,115 L290,110 L305,130 L295,155 L265,145 Z",
    cx: 280, cy: 130,
  },
  "Murang'a": {
    d: "M195,145 L215,160 L245,165 L240,195 L210,200 L185,180 Z",
    cx: 215, cy: 175,
  },
  Kiambu: {
    d: "M185,180 L210,200 L205,235 L175,240 L160,215 L165,190 Z",
    cx: 185, cy: 210,
  },
  Embu: {
    d: "M295,155 L305,130 L340,135 L350,165 L325,180 L300,170 Z",
    cx: 320, cy: 155,
  },
  Meru: {
    d: "M260,60 L300,50 L340,65 L350,100 L340,135 L305,130 L290,110 L260,115 L250,85 Z",
    cx: 300, cy: 90,
  },
  Machakos: {
    d: "M210,200 L240,195 L270,210 L280,250 L250,270 L215,255 L205,235 Z",
    cx: 240, cy: 235,
  },
  Bungoma: {
    d: "M50,100 L85,85 L110,95 L115,130 L95,150 L60,140 Z",
    cx: 82, cy: 115,
  },
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
      <svg viewBox="20 30 370 280" className="w-full h-auto" style={{ maxHeight: 500 }}>
        {/* Background Kenya outline (simplified) */}
        <path
          d="M30,40 L120,35 L180,50 L250,40 L330,45 L370,80 L380,150 L360,200 L340,260 L300,300 L240,310 L180,290 L130,260 L80,220 L50,170 L35,120 Z"
          fill="hsl(222, 41%, 7%)"
          stroke="hsl(222, 30%, 20%)"
          strokeWidth="1.5"
        />

        {/* County regions */}
        {Object.entries(COUNTY_PATHS).map(([county, { d, cx, cy }]) => {
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
                whileHover={{ scale: 1.02 }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              />
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isSelected ? "hsl(210, 40%, 98%)" : "hsl(215, 20%, 55%)"}
                fontSize={county === "Murang'a" ? "8" : "9"}
                fontWeight={isSelected ? "700" : "500"}
                className="pointer-events-none select-none"
                fontFamily="'Space Grotesk', system-ui"
              >
                {county}
              </text>
              {countyData?.[county] && (
                <text
                  x={cx}
                  y={cy + 14}
                  textAnchor="middle"
                  fill={riskColors[risk]}
                  fontSize="7"
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
        <g transform="translate(30, 270)">
          {[
            { label: "Low Risk", color: riskColors.low },
            { label: "Medium", color: riskColors.medium },
            { label: "High", color: riskColors.high },
            { label: "Critical", color: riskColors.critical },
          ].map((item, i) => (
            <g key={item.label} transform={`translate(${i * 80}, 0)`}>
              <rect width="10" height="10" rx="2" fill={item.color} fillOpacity="0.7" />
              <text x="14" y="9" fill="hsl(215, 20%, 55%)" fontSize="7" fontFamily="Inter, system-ui">
                {item.label}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
