import { destinations } from "@/content";

/**
 * Mapa estilizado da rota (SVG, sem custo de API).
 * Projeta as coordenadas reais dos destinos numa moldura e liga as escalas
 * na ordem do roteiro (dia 1 → 7).
 */
const W = 1000;
const H = 640;
const PAD = 110;

export function RouteMap() {
  const pts = [...destinations].sort((a, b) => a.day - b.day);
  const lngs = pts.map((p) => p.coordinates.lng);
  const lats = pts.map((p) => p.coordinates.lat);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  const x = (lng: number) =>
    PAD + ((lng - minLng) / (maxLng - minLng || 1)) * (W - PAD * 2);
  // norte para cima → inverte a latitude
  const y = (lat: number) =>
    PAD + ((maxLat - lat) / (maxLat - minLat || 1)) * (H - PAD * 2);

  const nodes = pts.map((p) => ({
    ...p,
    cx: x(p.coordinates.lng),
    cy: y(p.coordinates.lat),
  }));
  const path = nodes.map((n, i) => `${i === 0 ? "M" : "L"} ${n.cx} ${n.cy}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Mapa da rota QIMO Grécia pelo mar Egeu"
    >
      <defs>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A2E50" />
          <stop offset="100%" stopColor="#04203C" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#sea)" rx="18" />

      {/* rota tracejada */}
      <path
        d={path}
        fill="none"
        stroke="#B89B5E"
        strokeWidth="2.5"
        strokeDasharray="2 10"
        strokeLinecap="round"
        opacity="0.9"
      />

      {nodes.map((n) => {
        const flip = n.cx > W - PAD - 140; // rótulo à esquerda quando encostar na borda
        return (
          <g key={n.slug}>
            <circle cx={n.cx} cy={n.cy} r="9" fill="#D2BB87" />
            <circle cx={n.cx} cy={n.cy} r="16" fill="none" stroke="#D2BB87" strokeWidth="1" opacity="0.4" />
            <text
              x={flip ? n.cx - 22 : n.cx + 22}
              y={n.cy - 4}
              textAnchor={flip ? "end" : "start"}
              fill="#F7F4EE"
              className="font-cormorant"
              fontSize="30"
            >
              {n.name}
            </text>
            <text
              x={flip ? n.cx - 22 : n.cx + 22}
              y={n.cy + 20}
              textAnchor={flip ? "end" : "start"}
              fill="#C9B484"
              fontSize="15"
              letterSpacing="2"
            >
              DIA {n.day}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
