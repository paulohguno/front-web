// =========================================================
// RODA & SABOR — Componente: Roleta SVG
// Peça de assinatura: desenha fatias proporcionais ao peso
// de cada prêmio e anima a rotação até o resultado do sorteio.
// =========================================================

const PALETA_FATIAS = ['#d4af37', '#151310', '#8a7a4f', '#1c1814', '#f2d680', '#0b0a08'];

function polarParaCartesiano(cx, cy, raio, anguloGraus) {
  const anguloRad = ((anguloGraus - 90) * Math.PI) / 180;
  return { x: cx + raio * Math.cos(anguloRad), y: cy + raio * Math.sin(anguloRad) };
}

function caminhoFatia(cx, cy, raio, anguloInicial, anguloFinal) {
  const p1 = polarParaCartesiano(cx, cy, raio, anguloFinal);
  const p2 = polarParaCartesiano(cx, cy, raio, anguloInicial);
  const largeArc = anguloFinal - anguloInicial <= 180 ? '0' : '1';
  return `M ${cx} ${cy} L ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${raio} ${raio} 0 ${largeArc} 0 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} Z`;
}

/**
 * Monta o SVG da roleta a partir da lista de prêmios.
 * Cada prêmio tem peso = probabilidadeVitoria (relativo).
 */
export function montarRoletaSvg(premios) {
  const tamanho = 400;
  const cx = tamanho / 2;
  const cy = tamanho / 2;
  const raio = tamanho / 2 - 6;

  const pesos = premios.map((p) => Math.max(Number(p.probabilidade_vitoria ?? p.probabilidadeVitoria) || 0, 0.0001));
  const totalPeso = pesos.reduce((s, p) => s + p, 0);

  let anguloAcumulado = 0;
  const fatiasInfo = [];
  let fatiasSvg = '';

  premios.forEach((premio, indice) => {
    const fatiaAngulo = (pesos[indice] / totalPeso) * 360;
    const anguloInicial = anguloAcumulado;
    const anguloFinal = anguloAcumulado + fatiaAngulo;
    const anguloMeio = anguloInicial + fatiaAngulo / 2;
    const cor = premio.color || premio.cor || PALETA_FATIAS[indice % PALETA_FATIAS.length];

    fatiasInfo.push({ ...premio, anguloInicial, anguloFinal, anguloMeio });

    const corTexto = corLuminosidadeClara(cor) ? '#15130f' : '#f5efe0';
    const posTexto = polarParaCartesiano(cx, cy, raio * 0.62, anguloMeio);
    const rotuloCurto = (premio.label || premio.nome || '').slice(0, 16);

    fatiasSvg += `
      <path d="${caminhoFatia(cx, cy, raio, anguloInicial, anguloFinal)}" fill="${cor}" stroke="#0b0a08" stroke-width="1.5" />
      <text x="${posTexto.x.toFixed(2)}" y="${posTexto.y.toFixed(2)}" fill="${corTexto}" font-size="13" font-weight="700" font-family="Inter, sans-serif" text-anchor="middle" dominant-baseline="middle" transform="rotate(${anguloMeio}, ${posTexto.x.toFixed(2)}, ${posTexto.y.toFixed(2)})">${escaparTextoSvg(rotuloCurto)}</text>
    `;

    anguloAcumulado = anguloFinal;
  });

  const svg = `
    <svg class="roleta-disco" viewBox="0 0 ${tamanho} ${tamanho}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Roleta de prêmios">
      <circle cx="${cx}" cy="${cy}" r="${raio}" fill="#151310" />
      ${fatiasSvg}
      <circle cx="${cx}" cy="${cy}" r="${raio}" fill="none" stroke="#34291a" stroke-width="1" />
    </svg>
  `;

  return { svg, fatiasInfo };
}

function corLuminosidadeClara(hex) {
  if (!hex || !hex.startsWith('#')) return false;
  const limpo = hex.replace('#', '');
  const valor = limpo.length === 3
    ? limpo.split('').map((c) => c + c).join('')
    : limpo;
  if (valor.length !== 6) return false;
  const r = parseInt(valor.slice(0, 2), 16);
  const g = parseInt(valor.slice(2, 4), 16);
  const b = parseInt(valor.slice(4, 6), 16);
  const luminosidade = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminosidade > 0.6;
}

function escaparTextoSvg(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Calcula o ângulo final de rotação para que o ponteiro (fixo no topo, 0°)
 * pare exatamente sobre a fatia do prêmio vencedor, com voltas extras para efeito.
 */
export function calcularAnguloParada(fatiasInfo, premioVencedorId, rotacaoAtual) {
  const fatia = premioVencedorId
    ? fatiasInfo.find((f) => f.id === premioVencedorId)
    : null;

  const anguloAlvo = fatia ? fatia.anguloMeio : (fatiasInfo[0]?.anguloMeio || 0);

  const voltasExtras = 5 + Math.floor(Math.random() * 2); // 5-6 voltas
  const offsetAtual = rotacaoAtual % 360;
  const alvoFinalMod = (360 - anguloAlvo + 360) % 360;
  const delta = (alvoFinalMod - offsetAtual + 360) % 360;
  const anguloFinal = rotacaoAtual + voltasExtras * 360 + delta;

  return anguloFinal;
}
