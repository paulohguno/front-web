// =========================================================
// RODA & SABOR — Página: Roleta de prêmios
// =========================================================
import { listarPremiosRoleta, girarRoleta, listarMeusCupons } from '../services/roletaService.js';
import { buscarMeuPerfil } from '../services/authService.js';
import { obterEstado, definirUsuario } from '../store/store.js';
import { montarRoletaSvg, calcularAnguloParada } from '../components/roletaSvg.js';
import { formatarData } from '../utils/formatters.js';
import { toastErro } from '../utils/toast.js';

export async function renderRoleta(raiz) {
  raiz.innerHTML = `
    <main>
      <div class="container">
        <div class="tela-roleta">
          <span class="eyebrow">Sorte premiada</span>
          <h1>Roleta Roda &amp; Sabor</h1>
          <p style="max-width:460px; margin: 0 auto var(--espaco-4);">
            Cada giro custa 100 pontos. Ganhe cupons de desconto e use-os no próximo pedido.
          </p>

          <div id="area-roleta">
            <div class="carregando-bloco"><div class="spinner"></div></div>
          </div>

          <div id="area-resultado" style="margin-top: var(--espaco-5);"></div>
          <div id="area-cupons" style="margin-top: var(--espaco-7); text-align:left;"></div>
        </div>
      </div>
    </main>
  `;

  const areaRoleta = raiz.querySelector('#area-roleta');
  const areaResultado = raiz.querySelector('#area-resultado');
  const areaCupons = raiz.querySelector('#area-cupons');

  let premios = [];
  let fatiasInfo = [];
  let rotacaoAtual = 0;
  let girando = false;

  // Carregar prêmios
  try {
    premios = await listarPremiosRoleta();
  } catch (erro) {
    areaRoleta.innerHTML = `<div class="alerta alerta-erro">${erro.message}</div>`;
    return;
  }

  if (!premios.length) {
    areaRoleta.innerHTML = `<div class="estado-vazio"><h3>Roleta sem prêmios</h3><p>Configure prêmios no painel admin.</p></div>`;
    return;
  }

  const { svg, fatiasInfo: fi } = montarRoletaSvg(premios);
  fatiasInfo = fi;

  const estado = obterEstado();
  const pontos = estado.usuario?.pontos ?? 0;

  areaRoleta.innerHTML = `
    <div class="roleta-palco">
      <svg class="roleta-ponteiro" viewBox="0 0 28 36" width="28" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 36 L2 10 Q0 4 6 2 L14 0 L22 2 Q28 4 26 10 Z" fill="#d4af37" stroke="#0b0a08" stroke-width="1.5"/>
        <circle cx="14" cy="10" r="4" fill="#1a1408"/>
      </svg>
      <div class="roleta-svg-wrap" id="roleta-wrap">
        ${svg}
      </div>
      <button class="roleta-centro-btn" id="btn-girar" ${pontos < 100 ? 'disabled' : ''}>
        GIRAR
      </button>
    </div>
    <div class="roleta-custo">
      <span>★ Custo:</span>
      <strong style="color: var(--cor-dourado-claro);">100 pontos por giro</strong>
      <span style="margin-left: 12px;">Seus pontos: <strong style="color: var(--cor-dourado-claro);">${pontos}</strong></span>
    </div>
    ${pontos < 100 ? `<div class="alerta alerta-info" style="max-width:400px; margin: var(--espaco-4) auto 0;">
      Você precisa de 100 pontos para girar. Faça pedidos para acumular!
    </div>` : ''}
  `;

  const discEl = areaRoleta.querySelector('.roleta-disco');
  const btnGirar = areaRoleta.querySelector('#btn-girar');

  btnGirar?.addEventListener('click', async () => {
    if (girando) return;
    girando = true;
    btnGirar.disabled = true;
    btnGirar.textContent = '...';
    areaResultado.innerHTML = '';

    let resposta = null;
    try {
      resposta = await girarRoleta();
    } catch (erro) {
      toastErro(erro.message || 'Erro ao girar. Tente novamente.');
      girando = false;
      btnGirar.disabled = false;
      btnGirar.textContent = 'GIRAR';
      return;
    }

    // Animar a roleta até o prêmio vencedor
    const premioId = resposta.premio?.id ?? null;
    const anguloFinal = calcularAnguloParada(fatiasInfo, premioId, rotacaoAtual);
    rotacaoAtual = anguloFinal;

    discEl.style.transform = `rotate(${anguloFinal}deg)`;

    // Esperar animação terminar (4.2s = duração da transição CSS)
    setTimeout(async () => {
      girando = false;

      // Atualizar pontos do usuário
      try {
        const usuarioAtualizado = resposta.usuario || await buscarMeuPerfil();
        definirUsuario(usuarioAtualizado);
        const novospontos = usuarioAtualizado.pontos ?? 0;
        areaRoleta.querySelector('.roleta-custo').innerHTML = `
          <span>★ Custo:</span>
          <strong style="color: var(--cor-dourado-claro);">100 pontos por giro</strong>
          <span style="margin-left: 12px;">Seus pontos: <strong style="color: var(--cor-dourado-claro);">${novospontos}</strong></span>
        `;
        if (novospontos >= 100) {
          btnGirar.disabled = false;
          btnGirar.textContent = 'GIRAR';
        } else {
          btnGirar.textContent = 'SEM PONTOS';
        }
      } catch {}

      // Mostrar resultado
      if (resposta.cupom) {
        areaResultado.innerHTML = `
          <div class="alerta alerta-sucesso" style="max-width:440px; margin: 0 auto; text-align:center; padding: var(--espaco-5);">
            <div style="font-size:1.8rem; margin-bottom: var(--espaco-2);">🎉</div>
            <h3 style="color: var(--cor-sucesso); margin-bottom: var(--espaco-2);">Você ganhou!</h3>
            <p style="margin-bottom: var(--espaco-3);">${resposta.message}</p>
            <div style="font-family: var(--fonte-mono); font-size:1.2rem; font-weight:800; color: var(--cor-dourado-claro); letter-spacing: 0.05em; padding: var(--espaco-3); border: 1px dashed var(--cor-dourado-opaco); border-radius: var(--raio-md); background: var(--cor-dourado-fundo);">
              ${resposta.cupom.codigo}
            </div>
            <p style="font-size:0.8rem; margin-top: var(--espaco-3); margin-bottom:0; color: var(--cor-texto-fraco);">
              Use este cupom no carrinho. Válido por 30 dias.
            </p>
          </div>
        `;
      } else if (resposta.premio) {
        areaResultado.innerHTML = `
          <div class="alerta alerta-info" style="max-width:440px; margin: 0 auto; text-align:center;">
            <p style="margin:0;">${resposta.message}</p>
          </div>
        `;
      } else {
        areaResultado.innerHTML = `
          <div class="alerta" style="max-width:440px; margin: 0 auto; text-align:center; border-color: var(--cor-borda-forte); background: var(--cor-superficie-alta);">
            <p style="margin:0;">${resposta.message || 'Tente novamente!'}</p>
          </div>
        `;
      }

      // Recarregar cupons
      carregarCupons();
    }, 4400);
  });

  async function carregarCupons() {
    try {
      const cupons = await listarMeusCupons();
      if (!cupons.length) {
        areaCupons.innerHTML = '';
        return;
      }

      areaCupons.innerHTML = `
        <h2 style="margin-bottom: var(--espaco-4);">Meus cupons</h2>
        <div class="cupons-grade">
          ${cupons.map((c) => `
            <div class="cupom-card ${c.resgatado ? 'usado' : ''}">
              <div class="cupom-codigo">${c.codigo}</div>
              <div style="margin: var(--espaco-2) 0; font-size:1.1rem; font-weight:700; color: var(--cor-dourado-claro);">
                ${c.descontoPercentual}% de desconto
              </div>
              <div style="font-size:0.78rem; color: var(--cor-texto-fraco);">
                ${c.resgatado
                  ? '<span style="color: var(--cor-texto-fraco);">Cupom utilizado</span>'
                  : `Expira em ${formatarData(c.expiraEm)}`}
              </div>
              ${!c.resgatado ? `<a href="#/carrinho" class="btn btn-secundario btn-sm" style="margin-top: var(--espaco-3);">Usar no carrinho</a>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    } catch {}
  }

  carregarCupons();
}
