// =========================================================
// RODA & SABOR — Página: Carrinho + Checkout
// =========================================================
import {
  obterCarrinho, obterCupomSelecionado, definirCupomSelecionado,
  alterarQuantidadeCarrinho, removerDoCarrinho, limparCarrinho,
  subtotalCarrinho, inscrever, obterEstado
} from '../store/store.js';
import { listarMeusCupons } from '../services/roletaService.js';
import { criarPedido } from '../services/pedidoService.js';
import { definirUsuario } from '../store/store.js';
import { buscarMeuPerfil } from '../services/authService.js';
import { formatarMoeda, formatarData } from '../utils/formatters.js';
import { toastSucesso, toastErro } from '../utils/toast.js';
import { navegarPara } from '../router/router.js';
import { ApiError } from '../services/apiClient.js';

export async function renderCarrinho(raiz) {
  let cupons = [];
  let carregandoCupons = true;

  try {
    cupons = await listarMeusCupons();
    cupons = cupons.filter((c) => !c.resgatado);
    carregandoCupons = false;
  } catch {
    carregandoCupons = false;
  }

  function calcularDesconto(subtotal) {
    const cupomId = obterCupomSelecionado();
    if (!cupomId) return 0;
    const cupom = cupons.find((c) => c.id === Number(cupomId));
    if (!cupom) return 0;
    return Number(((subtotal * Number(cupom.descontoPercentual)) / 100).toFixed(2));
  }

  function renderPagina() {
    const carrinho = obterCarrinho();
    const vazio = carrinho.length === 0;
    const subtotal = subtotalCarrinho();
    const desconto = calcularDesconto(subtotal);
    const total = subtotal - desconto;
    const cupomId = obterCupomSelecionado();

    raiz.innerHTML = `
      <main>
        <div class="container" style="padding-top: var(--espaco-7);">
          <div style="margin-bottom: var(--espaco-5);">
            <span class="eyebrow">Revisão</span>
            <h1>Seu carrinho</h1>
          </div>

          ${vazio ? `
            <div class="estado-vazio card">
              <h3>Carrinho vazio</h3>
              <p>Adicione itens do cardápio para começar seu pedido.</p>
              <a href="#/menu" class="btn btn-primario" style="margin-top: var(--espaco-4);">Ver cardápio</a>
            </div>
          ` : `
            <div class="layout-com-carrinho">
              <div>
                <div class="card card-destacado" style="margin-bottom: var(--espaco-4);">
                  <h3 style="margin-bottom: var(--espaco-4);">Itens do pedido</h3>
                  <div id="lista-carrinho">
                    ${carrinho.map((linha) => `
                      <div class="carrinho-item" data-id="${linha.itemMenuId}">
                        <div class="carrinho-item-info">
                          <p class="carrinho-item-nome">${linha.nome}</p>
                          <p class="carrinho-item-preco">${formatarMoeda(linha.preco)} × ${linha.quantidade} = ${formatarMoeda(linha.preco * linha.quantidade)}</p>
                        </div>
                        <div class="qtd-control">
                          <button class="btn-qtd" data-id="${linha.itemMenuId}" data-delta="-1" aria-label="Diminuir">−</button>
                          <span>${linha.quantidade}</span>
                          <button class="btn-qtd" data-id="${linha.itemMenuId}" data-delta="1" aria-label="Aumentar">+</button>
                        </div>
                        <button class="btn btn-perigo btn-sm btn-remover" data-id="${linha.itemMenuId}" title="Remover item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                        </button>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <div class="card" style="margin-bottom: var(--espaco-4);">
                  <h3 style="margin-bottom: var(--espaco-3);">Cupom de desconto</h3>
                  ${cupons.length === 0 ? `
                    <p style="color: var(--cor-texto-fraco); font-size: 0.88rem;">
                      Você não tem cupons disponíveis. Acumule pontos e gire a roleta!
                    </p>
                  ` : `
                    <select id="sel-cupom" style="width:100%; background: var(--cor-superficie-alta); border: 1px solid var(--cor-borda); border-radius: var(--raio-sm); padding: 11px 14px; color: var(--cor-texto);">
                      <option value="">Sem cupom</option>
                      ${cupons.map((c) => `
                        <option value="${c.id}" ${String(c.id) === String(cupomId) ? 'selected' : ''}>
                          ${c.codigo} — ${c.descontoPercentual}% OFF (expira ${formatarData(c.expiraEm)})
                        </option>
                      `).join('')}
                    </select>
                  `}
                </div>

                <div class="card" id="card-pagamento">
                  <h3 style="margin-bottom: var(--espaco-3);">Forma de pagamento</h3>
                  <div id="opcoes-pagamento" style="display:flex; gap: var(--espaco-3); flex-wrap:wrap; margin-bottom: var(--espaco-4);">
                    ${['pix','dinheiro','cartao_credito'].map((m) => `
                      <label style="display:flex; align-items:center; gap:8px; cursor:pointer; padding: 10px 14px; border: 1px solid var(--cor-borda); border-radius: var(--raio-sm); flex:1; min-width:120px;" data-metodo="${m}">
                        <input type="radio" name="metodo-pag" value="${m}" style="accent-color: var(--cor-dourado);" ${m==='pix'?'checked':''} />
                        <span style="font-size:0.9rem; font-weight:600;">${m==='pix'?'PIX':m==='dinheiro'?'Dinheiro':'Cartão de crédito'}</span>
                      </label>
                    `).join('')}
                  </div>
                  <div id="area-erro-pedido"></div>
                  <button id="btn-confirmar" class="btn btn-primario btn-bloco" style="margin-top: var(--espaco-3);">
                    Confirmar pedido — ${formatarMoeda(total)}
                  </button>
                </div>
              </div>

              <aside class="carrinho-painel">
                <div class="card card-destacado">
                  <h3 style="margin-bottom: var(--espaco-4);">Resumo</h3>
                  <div class="resumo-linha">
                    <span>Subtotal</span><span class="valor">${formatarMoeda(subtotal)}</span>
                  </div>
                  ${desconto > 0 ? `
                    <div class="resumo-linha desconto">
                      <span>Desconto</span><span class="valor">−${formatarMoeda(desconto)}</span>
                    </div>
                  ` : ''}
                  <div class="resumo-linha total">
                    <span>Total</span><span class="valor">${formatarMoeda(total)}</span>
                  </div>
                  <p style="font-size:0.78rem; color: var(--cor-texto-fraco); margin-top: var(--espaco-3);">
                    ★ Você vai ganhar aproximadamente <strong style="color: var(--cor-dourado-claro);">${Math.floor(total)} pontos</strong> neste pedido.
                  </p>
                </div>
                <button class="btn btn-fantasma btn-sm" id="btn-limpar" style="align-self:flex-end;">Limpar carrinho</button>
              </aside>
            </div>
          `}
        </div>
      </main>
    `;

    // Eventos de quantidade
    raiz.querySelectorAll('.btn-qtd').forEach((btn) => {
      btn.addEventListener('click', () => {
        alterarQuantidadeCarrinho(Number(btn.dataset.id), Number(btn.dataset.delta));
        renderPagina();
      });
    });

    raiz.querySelectorAll('.btn-remover').forEach((btn) => {
      btn.addEventListener('click', () => {
        removerDoCarrinho(Number(btn.dataset.id));
        renderPagina();
      });
    });

    raiz.querySelector('#btn-limpar')?.addEventListener('click', () => {
      limparCarrinho();
      renderPagina();
    });

    // Cupom
    const selCupom = raiz.querySelector('#sel-cupom');
    selCupom?.addEventListener('change', () => {
      definirCupomSelecionado(selCupom.value ? Number(selCupom.value) : null);
      renderPagina();
    });

    // Confirmar pedido
    const btnConfirmar = raiz.querySelector('#btn-confirmar');
    btnConfirmar?.addEventListener('click', async () => {
      const metodoEl = raiz.querySelector('input[name="metodo-pag"]:checked');
      const metodo = metodoEl?.value || 'pix';
      const areaErro = raiz.querySelector('#area-erro-pedido');
      areaErro.innerHTML = '';
      btnConfirmar.disabled = true;
      btnConfirmar.textContent = 'Confirmando...';

      try {
        const itens = obterCarrinho().map((l) => ({ itemMenuId: l.itemMenuId, quantidade: l.quantidade }));
        const cupomIdFinal = obterCupomSelecionado() || null;
        const resposta = await criarPedido({ itens, cupomId: cupomIdFinal });

        // Atualiza pontos do usuário no store
        if (resposta.usuario) {
          definirUsuario(resposta.usuario);
        } else {
          try {
            const usuarioAtualizado = await buscarMeuPerfil();
            definirUsuario(usuarioAtualizado);
          } catch {}
        }

        limparCarrinho();
        toastSucesso(resposta.message || 'Pedido realizado com sucesso!');
        navegarPara('/pedidos');
      } catch (erro) {
        const msg = erro instanceof ApiError ? erro.message : 'Não foi possível finalizar o pedido.';
        areaErro.innerHTML = `<div class="alerta alerta-erro">${msg}</div>`;
        btnConfirmar.disabled = false;
        btnConfirmar.textContent = `Confirmar pedido — ${formatarMoeda(subtotalCarrinho() - calcularDesconto(subtotalCarrinho()))}`;
      }
    });
  }

  renderPagina();
}
