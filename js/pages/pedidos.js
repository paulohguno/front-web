// =========================================================
// RODA & SABOR — Página: Meus Pedidos
// =========================================================
import { listarMeusPedidos } from '../services/pedidoService.js';
import { formatarMoeda, formatarDataHora, rotuloSituacaoPedido } from '../utils/formatters.js';

function badgeSituacao(situacao) {
  return `<span class="badge badge-${situacao}">${rotuloSituacaoPedido(situacao)}</span>`;
}

export async function renderPedidos(raiz) {
  raiz.innerHTML = `
    <main>
      <div class="container" style="padding-top: var(--espaco-7); padding-bottom: var(--espaco-8);">
        <div style="margin-bottom: var(--espaco-5);">
          <span class="eyebrow">Histórico</span>
          <h1>Meus pedidos</h1>
        </div>
        <div id="area-pedidos">
          <div class="carregando-bloco"><div class="spinner"></div></div>
        </div>
      </div>
    </main>
  `;

  const area = raiz.querySelector('#area-pedidos');

  let pedidos = [];
  try {
    pedidos = await listarMeusPedidos();
  } catch (erro) {
    area.innerHTML = `<div class="alerta alerta-erro">${erro.message}</div>`;
    return;
  }

  if (!pedidos.length) {
    area.innerHTML = `
      <div class="estado-vazio card">
        <h3>Nenhum pedido ainda</h3>
        <p>Seu histórico de pedidos aparece aqui.</p>
        <a href="#/menu" class="btn btn-primario" style="margin-top: var(--espaco-4);">Fazer meu primeiro pedido</a>
      </div>`;
    return;
  }

  area.innerHTML = `<div class="lista-pedidos">${pedidos.map((pedido) => {
    const itens = pedido.itens || [];
    return `
      <div class="card pedido-card card-destacado">
        <div class="pedido-cabecalho">
          <div>
            <h3 style="margin-bottom: 4px;">Pedido #${pedido.id}</h3>
            <span style="font-size:0.82rem; color: var(--cor-texto-fraco);">${formatarDataHora(pedido.createdAt || pedido.created_at)}</span>
          </div>
          ${badgeSituacao(pedido.situacao)}
        </div>

        ${itens.length ? `
          <ul class="pedido-itens-lista">
            ${itens.map((it) => {
              const nome = it.item_menu?.nome || it.itemMenu?.nome || `Item #${it.itemMenuId}`;
              return `<li>${it.quantidade}× ${nome} — ${formatarMoeda(it.subtotal)}</li>`;
            }).join('')}
          </ul>
        ` : ''}

        <hr class="divisor" style="margin: var(--espaco-3) 0;">

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap: var(--espaco-3);">
          <div style="font-size:0.86rem; color: var(--cor-texto-suave);">
            ${Number(pedido.valorDesconto) > 0 ? `
              <span>Subtotal: ${formatarMoeda(pedido.valorBruto)}</span>
              &nbsp;·&nbsp;
              <span style="color: var(--cor-sucesso);">Desconto: −${formatarMoeda(pedido.valorDesconto)}</span>
              &nbsp;·&nbsp;
            ` : ''}
            <strong style="color: var(--cor-texto);">Total: ${formatarMoeda(pedido.precoTotal)}</strong>
          </div>
          <div style="display:flex; align-items:center; gap: var(--espaco-2);">
            <span style="font-size:0.82rem; color: var(--cor-dourado-opaco);">★ +${pedido.pontosGerados} pontos</span>
          </div>
        </div>
      </div>
    `;
  }).join('')}</div>`;
}
