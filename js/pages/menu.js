// =========================================================
// RODA & SABOR — Página: Menu / Cardápio
// =========================================================
import { listarMenu } from '../services/menuService.js';
import { adicionarAoCarrinho } from '../store/store.js';
import { toastSucesso } from '../utils/toast.js';
import { formatarMoeda } from '../utils/formatters.js';

const ICONE_PRATO = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`;

export async function renderMenu(raiz) {
  raiz.innerHTML = `
    <main>
      <div class="container">
        <div class="menu-cabecalho">
          <span class="eyebrow">Cardápio</span>
          <h1>O que vai pedir hoje?</h1>
        </div>
        <div id="menu-filtros" class="menu-filtros"></div>
        <div id="grade-menu" class="grade-menu"></div>
      </div>
    </main>
  `;

  const gradEl = raiz.querySelector('#grade-menu');
  const filtrosEl = raiz.querySelector('#menu-filtros');

  let itens = [];
  let categoriaAtiva = 'Todos';

  try {
    itens = await listarMenu();
    itens = itens.filter((i) => i.ativo !== false);
  } catch (erro) {
    gradEl.innerHTML = `<div class="alerta alerta-erro">${erro.message}</div>`;
    return;
  }

  if (!itens.length) {
    gradEl.innerHTML = `<div class="estado-vazio"><h3>Cardápio vazio</h3><p>Nenhum item disponível no momento.</p></div>`;
    return;
  }

  const categorias = ['Todos', ...new Set(itens.map((i) => i.categoria).filter(Boolean))];

  function renderFiltros() {
    filtrosEl.innerHTML = categorias.map((cat) => `
      <button class="filtro-chip ${cat === categoriaAtiva ? 'ativo' : ''}" data-cat="${cat}">${cat}</button>
    `).join('');
    filtrosEl.querySelectorAll('.filtro-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        categoriaAtiva = btn.dataset.cat;
        renderFiltros();
        renderItens();
      });
    });
  }

  function renderItens() {
    const filtrados = categoriaAtiva === 'Todos' ? itens : itens.filter((i) => i.categoria === categoriaAtiva);

    if (!filtrados.length) {
      gradEl.innerHTML = `<div class="estado-vazio" style="grid-column:1/-1;"><h3>Nenhum item nesta categoria</h3></div>`;
      return;
    }

    gradEl.innerHTML = filtrados.map((item) => `
      <article class="item-menu-card" data-id="${item.id}">
        <div class="item-menu-imagem">
          ${item.urlImagem || item.url_imagem
            ? `<img src="${item.urlImagem || item.url_imagem}" alt="${item.nome}" loading="lazy" />`
            : ICONE_PRATO}
        </div>
        <div class="item-menu-corpo">
          <span class="item-menu-categoria">${item.categoria || 'Prato'}</span>
          <h3 class="item-menu-nome">${item.nome}</h3>
          <p class="item-menu-desc">${item.descricao || ''}</p>
          <div class="item-menu-rodape">
            <span class="item-menu-preco numero-mono">${formatarMoeda(item.preco)}</span>
            <button class="btn btn-primario btn-sm btn-adicionar" data-id="${item.id}">+ Carrinho</button>
          </div>
        </div>
      </article>
    `).join('');

    gradEl.querySelectorAll('.btn-adicionar').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = Number(btn.dataset.id);
        const item = itens.find((i) => i.id === id);
        if (item) {
          adicionarAoCarrinho(item);
          toastSucesso(`${item.nome} adicionado ao carrinho.`);
        }
      });
    });
  }

  renderFiltros();
  renderItens();
}
