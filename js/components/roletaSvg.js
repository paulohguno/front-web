// =========================================================
// RODA & SABOR — Componente: Roleta SVG (v2 — 10 fatias)
// =========================================================

const PALETA = ['#2a2218','#1c1814','#8a7a4f','#d4af37','#b8960c','#c9a227','#4a7c59','#f2d680','#e8c547','#ff9d00'];

function polar(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function fatiaPath(cx, cy, r, a1, a2) {
  const p1 = polar(cx, cy, r, a2);
  const p2 = polar(cx, cy, r, a1);
  const large = a2 - a1 <= 180 ? '0' : '1';
  return `M${cx} ${cy}L${p1.x.toFixed(2)} ${p1.y.toFixed(2)}A${r} ${r} 0 ${large} 0 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}Z`;
}

function luminosidade(hex) {
  const h = (hex||'').replace('#','');
  if (h.length < 6) return 0;
  const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
  return (0.299*r + 0.587*g + 0.114*b) / 255;
}

function esc(t) { return String(t||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

export function montarRoletaSvg(premios) {
  const SZ = 400, cx = SZ/2, cy = SZ/2, r = SZ/2 - 5;

  const pesos = premios.map(p => Math.max(Number(p.probabilidade_vitoria ?? p.probabilidadeVitoria) || 0, 0.001));
  const total = pesos.reduce((s,p) => s+p, 0);

  let ang = 0;
  const fatiasInfo = [];
  let paths = '';

  premios.forEach((premio, i) => {
    const span = (pesos[i]/total) * 360;
    const a1 = ang, a2 = ang + span, meio = ang + span/2;
    const cor = premio.cor || premio.color || PALETA[i % PALETA.length];
    fatiasInfo.push({ ...premio, anguloInicial:a1, anguloFinal:a2, anguloMeio:meio });

    const corTxt = luminosidade(cor) > 0.55 ? '#15130f' : '#f5efe0';
    const pos = polar(cx, cy, r * 0.60, meio);

    // Texto em duas linhas se for longo
    const rotulo = (premio.label || premio.nome || '').slice(0, 14);
    const fontSize = rotulo.length > 8 ? 10 : 12;

    paths += `
      <path d="${fatiaPath(cx,cy,r,a1,a2)}" fill="${cor}" stroke="#0b0a08" stroke-width="1.2"/>
      <text x="${pos.x.toFixed(2)}" y="${pos.y.toFixed(2)}"
        fill="${corTxt}" font-size="${fontSize}" font-weight="700" font-family="Inter,sans-serif"
        text-anchor="middle" dominant-baseline="middle"
        transform="rotate(${meio},${pos.x.toFixed(2)},${pos.y.toFixed(2)})">${esc(rotulo)}</text>`;
    ang = a2;
  });

  const svg = `<svg class="roleta-disco" viewBox="0 0 ${SZ} ${SZ}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Roleta de prêmios">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#151310"/>
    ${paths}
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#34291a" stroke-width="1"/>
  </svg>`;

  return { svg, fatiasInfo };
}

export function calcularAnguloParada(fatiasInfo, premioId, rotacaoAtual) {
  const fatia = premioId ? fatiasInfo.find(f => f.id === premioId) : null;
  const alvo = fatia ? fatia.anguloMeio : (fatiasInfo[0]?.anguloMeio || 0);
  const voltas = 5 + Math.floor(Math.random() * 2);
  const offsetAtual = rotacaoAtual % 360;
  const alvoMod = (360 - alvo + 360) % 360;
  const delta = (alvoMod - offsetAtual + 360) % 360;
  return rotacaoAtual + voltas * 360 + delta;
}
