// =========================================================
// RODA & SABOR — Componente: Roleta SVG (v3)
// =========================================================

const PALETA = [
  '#2a2218',
  '#1c1814',
  '#8a7a4f',
  '#d4af37',
  '#b8960c',
  '#c9a227',
  '#4a7c59',
  '#f2d680',
  '#e8c547',
  '#ff9d00'
];

function polar(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;

  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad)
  };
}

function fatiaPath(cx, cy, r, a1, a2) {
  const p1 = polar(cx, cy, r, a2);
  const p2 = polar(cx, cy, r, a1);

  const large = a2 - a1 <= 180 ? '0' : '1';

  return `
    M${cx} ${cy}
    L${p1.x.toFixed(2)} ${p1.y.toFixed(2)}
    A${r} ${r} 0 ${large} 0 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}
    Z
  `;
}

function luminosidade(hex) {
  const h = (hex || '').replace('#', '');

  if (h.length < 6) return 0;

  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);

  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function esc(texto) {
  return String(texto || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatarRotulo(rotulo) {
  if (!rotulo) return '';

  return rotulo
    .replace('Desconto de ', '')
    .replace('Desconto ', '')
    .replace('% de desconto', '% OFF')
    .replace('% desconto', '% OFF')
    .replace('Não foi dessa vez', 'Sem Prêmio')
    .replace('Tente outra vez', 'Tente Nov.')
    .trim();
}

export function montarRoletaSvg(premios) {
  const SZ = 400;
  const cx = SZ / 2;
  const cy = SZ / 2;
  const r = SZ / 2 - 5;

  const pesos = premios.map((p) =>
    Math.max(
      Number(
        p.probabilidade_vitoria ??
        p.probabilidadeVitoria
      ) || 0,
      0.001
    )
  );

  const total = pesos.reduce((soma, p) => soma + p, 0);

  let anguloAtual = 0;
  let paths = '';

  const fatiasInfo = [];

  premios.forEach((premio, indice) => {

    const span = (pesos[indice] / total) * 360;

    const inicio = anguloAtual;
    const fim = anguloAtual + span;
    const meio = inicio + span / 2;

    const cor =
      premio.cor ||
      premio.color ||
      PALETA[indice % PALETA.length];

    fatiasInfo.push({
      ...premio,
      anguloInicial: inicio,
      anguloFinal: fim,
      anguloMeio: meio
    });

    const corTexto =
      luminosidade(cor) > 0.55
        ? '#15130f'
        : '#f5efe0';

    const pos = polar(
      cx,
      cy,
      r * 0.72,
      meio
    );

    let rotulo = formatarRotulo(
      premio.label || premio.nome || ''
    );

    if (rotulo.length > 10) {
      rotulo =
        rotulo.substring(0, 10) + '...';
    }

    let fontSize = 12;

    if (span < 40) fontSize = 10;
    if (span < 25) fontSize = 8;
    if (span < 15) fontSize = 7;

    let rotacaoTexto = meio + 90;

    if (rotacaoTexto > 180) {
      rotacaoTexto += 180;
    }

    paths += `
      <path
        d="${fatiaPath(cx, cy, r, inicio, fim)}"
        fill="${cor}"
        stroke="#0b0a08"
        stroke-width="1.2"
      />

      <text
        x="${pos.x.toFixed(2)}"
        y="${pos.y.toFixed(2)}"
        fill="${corTexto}"
        font-size="${fontSize}"
        font-weight="700"
        font-family="Inter,sans-serif"
        text-anchor="middle"
        dominant-baseline="middle"
        transform="rotate(
          ${rotacaoTexto},
          ${pos.x.toFixed(2)},
          ${pos.y.toFixed(2)}
        )"
      >
        ${esc(rotulo)}
      </text>
    `;

    anguloAtual = fim;
  });

  const svg = `
    <svg
      class="roleta-disco"
      viewBox="0 0 ${SZ} ${SZ}"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Roleta de prêmios"
    >

      <circle
        cx="${cx}"
        cy="${cy}"
        r="${r}"
        fill="#151310"
      />

      ${paths}

      <circle
        cx="${cx}"
        cy="${cy}"
        r="${r}"
        fill="none"
        stroke="#34291a"
        stroke-width="1"
      />

    </svg>
  `;

  return {
    svg,
    fatiasInfo
  };
}

export function calcularAnguloParada(
  fatiasInfo,
  premioId,
  rotacaoAtual
) {
  const fatia = premioId
    ? fatiasInfo.find(
        (f) => f.id === premioId
      )
    : null;

  const alvo = fatia
    ? fatia.anguloMeio
    : fatiasInfo[0]?.anguloMeio || 0;

  const voltas =
    5 + Math.floor(Math.random() * 2);

  const offsetAtual =
    rotacaoAtual % 360;

  const alvoMod =
    (360 - alvo + 360) % 360;

  const delta =
    (alvoMod - offsetAtual + 360) % 360;

  return (
    rotacaoAtual +
    voltas * 360 +
    delta
  );
}