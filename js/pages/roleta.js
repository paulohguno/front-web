// =========================================================
// RODA & SABOR — Página: Roleta (v2 — 10 prêmios)
// =========================================================
import { listarPremiosRoleta, girarRoleta, listarMeusCupons } from '../services/roletaService.js';
import { buscarMeuPerfil } from '../services/authService.js';
import { obterEstado, definirUsuario } from '../store/store.js';
import { montarRoletaSvg, calcularAnguloParada } from '../components/roletaSvg.js';
import { formatarData } from '../utils/formatters.js';
import { toastErro } from '../utils/toast.js';

// Cores fixas para cada fatia indexada — garante consistência visual
// mesmo que o backend mude a cor salva (fallback por ordem)
const CORES_FALLBACK = [
  '#2a2218','#1c1814','#8a7a4f','#d4af37','#b8960c',
  '#c9a227','#4a7c59','#f2d680','#e8c547','#ff9d00',
];

export async function renderRoleta(raiz) {
  raiz.innerHTML = `
    <main>
      <div class="container">
        <div class="tela-roleta">
          <span class="eyebrow">Sorte premiada</span>
          <h1>Roleta Roda &amp; Sabor</h1>
          <p style="max-width:480px;margin:0 auto var(--espaco-3);color:var(--cor-texto-suave);">
            Troque <strong style="color:var(--cor-dourado-claro)">100 pontos</strong> por um giro.
            Chances reais de ganhar de 5% a 50% de desconto — ou perder e tentar de novo!
          </p>
          <div id="area-roleta"><div class="carregando-bloco"><div class="spinner"></div></div></div>
          <div id="area-resultado" style="margin-top:var(--espaco-5);"></div>
          <div id="area-tabela-chances" style="margin-top:var(--espaco-6);text-align:left;"></div>
          <div id="area-cupons" style="margin-top:var(--espaco-6);text-align:left;"></div>
        </div>
      </div>
    </main>`;

  const areaRoleta   = raiz.querySelector('#area-roleta');
  const areaResult   = raiz.querySelector('#area-resultado');
  const areaCupons   = raiz.querySelector('#area-cupons');
  const areaTabela   = raiz.querySelector('#area-tabela-chances');

  let premios = [];
  let fatiasInfo = [];
  let rotacaoAtual = 0;
  let girando = false;

  try {
    premios = await listarPremiosRoleta();
  } catch (err) {
    areaRoleta.innerHTML = `<div class="alerta alerta-erro">${err.message}</div>`;
    return;
  }

  if (!premios.length) {
    areaRoleta.innerHTML = `<div class="estado-vazio"><h3>Roleta sem prêmios</h3></div>`;
    return;
  }

  // Garantir cor em cada prêmio (fallback por índice)
  premios.forEach((p, i) => { p.cor = p.color || p.cor || CORES_FALLBACK[i % CORES_FALLBACK.length]; });

  const { svg, fatiasInfo: fi } = montarRoletaSvg(premios);
  fatiasInfo = fi;

  const estado = obterEstado();
  const pontos = estado.usuario?.pontos ?? 0;

  // ── Roleta ──────────────────────────────────────────────
  areaRoleta.innerHTML = `
    <div class="roleta-palco">
      <svg class="roleta-ponteiro" viewBox="0 0 28 36" width="26" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 36 L2 10 Q0 4 6 2 L14 0 L22 2 Q28 4 26 10 Z" fill="#d4af37" stroke="#0b0a08" stroke-width="1.5"/>
        <circle cx="14" cy="10" r="4" fill="#1a1408"/>
      </svg>
      <div class="roleta-svg-wrap" id="roleta-wrap">${svg}</div>
      <button class="roleta-centro-btn" id="btn-girar" ${pontos < 100 ? 'disabled' : ''}>GIRAR</button>
    </div>
    <div class="roleta-custo">
      <span>★ Custo: <strong style="color:var(--cor-dourado-claro)">100 pts</strong></span>
      <span style="margin-left:14px;">Seus pontos: <strong id="exibir-pontos" style="color:var(--cor-dourado-claro)">${pontos}</strong></span>
    </div>
    ${pontos < 100 ? `<div class="alerta alerta-info" style="max-width:420px;margin:var(--espaco-3) auto 0;">
      Você precisa de 100 pontos para girar. Faça pedidos para acumular!
    </div>` : ''}
  `;

  // ── Tabela de chances ────────────────────────────────────
  const totalPeso = premios.reduce((s, p) => s + Number(p.probabilidade_vitoria || 0), 0);
  areaTabela.innerHTML = `
    <div class="card" style="max-width:560px;margin:0 auto;">
      <h3 style="margin-bottom:var(--espaco-4);">Chances de cada prêmio</h3>
      <div class="tabela-wrap">
        <table class="tabela-admin">
          <thead><tr><th>Cor</th><th>Prêmio</th><th>Probabilidade</th></tr></thead>
          <tbody>
            ${premios.map((p) => {
              const pct = totalPeso > 0 ? ((Number(p.probabilidade_vitoria) / totalPeso) * 100).toFixed(1) : 0;
              const ehPerda = Number(p.desconto_percentual || 0) === 0 && !String(p.nome).toLowerCase().includes('frete');
              return `
                <tr>
                  <td><span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:${p.cor};border:1px solid var(--cor-borda-forte);"></span></td>
                  <td style="font-weight:600;color:${ehPerda ? 'var(--cor-texto-fraco)' : 'var(--cor-texto)'};">${p.nome || p.label}</td>
                  <td class="numero-mono" style="color:${ehPerda ? 'var(--cor-erro)' : 'var(--cor-dourado-claro)'};">${pct}%</td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
      <p style="font-size:0.76rem;color:var(--cor-texto-fraco);margin-top:var(--espaco-3);margin-bottom:0;">
        Chance de perder (sem prêmio): <strong style="color:var(--cor-erro);">
          ${(premios.filter(p => !Number(p.desconto_percentual)).reduce((s,p)=>s+Number(p.probabilidade_vitoria||0),0)/totalPeso*100).toFixed(1)}%
        </strong>
        &nbsp;·&nbsp; Chance de ganhar qualquer desconto: <strong style="color:var(--cor-sucesso);">
          ${(premios.filter(p => Number(p.desconto_percentual)>0).reduce((s,p)=>s+Number(p.probabilidade_vitoria||0),0)/totalPeso*100).toFixed(1)}%
        </strong>
      </p>
    </div>`;

  const discEl   = areaRoleta.querySelector('.roleta-disco');
  const btnGirar = areaRoleta.querySelector('#btn-girar');
  const exibirPts= areaRoleta.querySelector('#exibir-pontos');

  btnGirar?.addEventListener('click', async () => {
    if (girando) return;
    girando = true;
    btnGirar.disabled = true;
    btnGirar.textContent = '...';
    areaResult.innerHTML = '';

    let resposta = null;
    try {
      resposta = await girarRoleta();
    } catch (err) {
      toastErro(err.message || 'Erro ao girar.');
      girando = false;
      btnGirar.disabled = false;
      btnGirar.textContent = 'GIRAR';
      return;
    }

    // Animação
    const premioId = resposta.premio?.id ?? null;
    const anguloFinal = calcularAnguloParada(fatiasInfo, premioId, rotacaoAtual);
    rotacaoAtual = anguloFinal;
    discEl.style.transform = `rotate(${anguloFinal}deg)`;

    setTimeout(async () => {
      girando = false;

      // Atualizar pontos
      try {
        const u = resposta.usuario || await buscarMeuPerfil();
        definirUsuario(u);
        const novospontos = u.pontos ?? 0;
        if (exibirPts) exibirPts.textContent = novospontos;
        btnGirar.disabled = novospontos < 100;
        btnGirar.textContent = novospontos >= 100 ? 'GIRAR' : 'SEM PONTOS';
      } catch {}

      // Resultado
      const nomeP = resposta.premio?.label || resposta.premio?.nome || '';
      const ehPerda = !resposta.cupom && (!resposta.premio || Number(resposta.premio.desconto_percentual || 0) === 0);

      if (resposta.cupom) {
        const isJackpot = Number(resposta.premio?.desconto_percentual || 0) >= 50;
        areaResult.innerHTML = `
          <div class="alerta alerta-sucesso" style="max-width:460px;margin:0 auto;text-align:center;padding:var(--espaco-5);">
            <div style="font-size:${isJackpot ? '2.4rem' : '1.8rem'};margin-bottom:var(--espaco-2);">${isJackpot ? '🎰🎉🎰' : '🎉'}</div>
            <h3 style="color:var(--cor-sucesso);margin-bottom:var(--espaco-2);">
              ${isJackpot ? 'JACKPOT! ' : ''}Você ganhou ${nomeP}!
            </h3>
            <p style="margin-bottom:var(--espaco-3);">${resposta.message}</p>
            <div style="font-family:var(--fonte-mono);font-size:1.15rem;font-weight:800;color:var(--cor-dourado-claro);letter-spacing:0.05em;padding:var(--espaco-3);border:1px dashed var(--cor-dourado-opaco);border-radius:var(--raio-md);background:var(--cor-dourado-fundo);">
              ${resposta.cupom.codigo}
            </div>
            <p style="font-size:0.78rem;margin-top:var(--espaco-3);margin-bottom:0;color:var(--cor-texto-fraco);">
              Use este cupom no carrinho. Válido por 30 dias.
            </p>
            <a href="#/carrinho" class="btn btn-primario btn-sm" style="margin-top:var(--espaco-4);display:inline-flex;">Usar no carrinho</a>
          </div>`;
      } else if (ehPerda) {
        areaResult.innerHTML = `
          <div style="max-width:460px;margin:0 auto;text-align:center;">
            <div style="font-size:2.2rem;margin-bottom:var(--espaco-2);">😅</div>
            <h3 style="color:var(--cor-texto-suave);margin-bottom:var(--espaco-2);">${nomeP || 'Não foi dessa vez!'}</h3>
            <p style="color:var(--cor-texto-fraco);">${resposta.message}</p>
            <a href="#/menu" class="btn btn-secundario btn-sm" style="margin-top:var(--espaco-3);display:inline-flex;">Fazer pedido e ganhar pontos</a>
          </div>`;
      } else {
        areaResult.innerHTML = `
          <div class="alerta alerta-info" style="max-width:460px;margin:0 auto;text-align:center;">
            <p style="margin:0;">${resposta.message}</p>
          </div>`;
      }

      carregarCupons();
    }, 4400);
  });

  async function carregarCupons() {
    try {
      const cupons = await listarMeusCupons();
      if (!cupons.length) { areaCupons.innerHTML = ''; return; }

      areaCupons.innerHTML = `
        <h2 style="margin-bottom:var(--espaco-4);">Meus cupons</h2>
        <div class="cupons-grade">
          ${cupons.map((c) => `
            <div class="cupom-card ${c.resgatado ? 'usado' : ''}">
              <div class="cupom-codigo">${c.codigo}</div>
              <div style="margin:var(--espaco-2) 0;font-size:1.05rem;font-weight:700;color:var(--cor-dourado-claro);">
                ${Number(c.descontoPercentual) > 0 ? c.descontoPercentual + '% de desconto' : 'Prêmio especial'}
              </div>
              <div style="font-size:0.76rem;color:var(--cor-texto-fraco);">
                ${c.resgatado
                  ? '<span style="color:var(--cor-texto-fraco);">✓ Utilizado</span>'
                  : `Expira em ${formatarData(c.expiraEm)}`}
              </div>
              ${!c.resgatado ? `<a href="#/carrinho" class="btn btn-secundario btn-sm" style="margin-top:var(--espaco-3);">Usar no carrinho</a>` : ''}
            </div>`).join('')}
        </div>`;
    } catch {}
  }

  carregarCupons();
}
