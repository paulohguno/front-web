// =========================================================
// RODA & SABOR — Componente: Cabeçalho / Navegação
// =========================================================
import { obterEstado, inscrever, estaAutenticado, ehAdmin, fazerLogout, totalItensCarrinho } from '../store/store.js';
import { navegarPara, rotaAtual } from '../router/router.js';
import { iniciais } from '../utils/formatters.js';
import { toastSucesso } from '../utils/toast.js';

const SVG_RODA = `
<svg class="marca-roda" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="16" r="14" stroke="#d4af37" stroke-width="2"/>
  <circle cx="16" cy="16" r="2.4" fill="#d4af37"/>
  <path d="M16 2V12M16 20V30M30 16H20M12 16H2M25.9 6.1L18.8 13.2M13.2 18.8L6.1 25.9M25.9 25.9L18.8 18.8M13.2 13.2L6.1 6.1" stroke="#d4af37" stroke-width="1.4" stroke-linecap="round"/>
</svg>`;

const ICONE_CARRINHO = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`;
const ICONE_CHEVRON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;

function itensNavCliente() {
  return [
    { caminho: '/menu', rotulo: 'Cardápio' },
    { caminho: '/pedidos', rotulo: 'Meus Pedidos' },
    { caminho: '/roleta', rotulo: 'Roleta' },
  ];
}

export function montarCabecalho(containerEl) {
  function renderizar() {
    const estado = obterEstado();
    const autenticado = estaAutenticado();
    const atual = rotaAtual();
    const admin = ehAdmin();

    const linksNav = autenticado
      ? itensNavCliente().map((item) => `
          <a href="#${item.caminho}" class="nav-link ${atual.startsWith(item.caminho) ? 'ativo' : ''}">${item.rotulo}</a>
        `).join('')
      : '';

    const linkAdmin = admin ? `<a href="#/admin" class="nav-link ${atual.startsWith('/admin') ? 'ativo' : ''}">Admin</a>` : '';

    containerEl.innerHTML = `
      <header class="cabecalho">
        <div class="cabecalho-inner container" style="padding-left:0; padding-right:0;">
          <a href="#/" class="marca">
            ${SVG_RODA}
            Roda <span class="destaque">&amp; Sabor</span>
          </a>

          <button class="nav-mobile-toggle" id="btn-menu-mobile" aria-label="Abrir menu" aria-expanded="false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>

          <nav class="nav-principal-links nav-principal" id="nav-links">
            ${linksNav}
            ${linkAdmin}
          </nav>

          <div class="nav-principal">
            ${autenticado ? `
              <a href="#/menu" class="nav-pontos" title="Seus pontos acumulados">
                ★ ${estado.usuario?.pontos ?? 0} pts
              </a>
              <a href="#/carrinho" class="btn btn-fantasma btn-sm" style="position:relative;" title="Carrinho">
                ${ICONE_CARRINHO}
                ${totalItensCarrinho() > 0 ? `<span style="position:absolute; top:-2px; right:-2px; background:var(--cor-dourado); color:#1a1408; font-size:0.62rem; font-weight:800; border-radius:999px; min-width:16px; height:16px; display:flex; align-items:center; justify-content:center; padding:0 3px;">${totalItensCarrinho()}</span>` : ''}
              </a>
              <div class="nav-usuario-menu" id="nav-usuario-menu">
                <button class="nav-usuario-btn" id="btn-usuario">
                  <span class="avatar-iniciais">${iniciais(estado.usuario?.nome)}</span>
                  ${ICONE_CHEVRON}
                </button>
                <div class="nav-dropdown" id="nav-dropdown">
                  <a href="#/perfil">Meu perfil</a>
                  <a href="#/pedidos">Meus pedidos</a>
                  <button id="btn-sair" type="button">Sair</button>
                </div>
              </div>
            ` : `
              <a href="#/login" class="btn btn-fantasma btn-sm">Entrar</a>
              <a href="#/cadastro" class="btn btn-primario btn-sm">Criar conta</a>
            `}
          </div>
        </div>
      </header>
    `;

    const btnMenuMobile = containerEl.querySelector('#btn-menu-mobile');
    const navLinks = containerEl.querySelector('#nav-links');
    btnMenuMobile?.addEventListener('click', () => {
      const aberto = navLinks.classList.toggle('aberto');
      btnMenuMobile.setAttribute('aria-expanded', String(aberto));
    });

    const btnUsuario = containerEl.querySelector('#btn-usuario');
    const dropdown = containerEl.querySelector('#nav-dropdown');
    btnUsuario?.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('aberto');
    });

    containerEl.querySelector('#btn-sair')?.addEventListener('click', () => {
      fazerLogout();
      toastSucesso('Você saiu da sua conta.');
      navegarPara('/login');
    });

    document.addEventListener('click', (e) => {
      if (dropdown && !dropdown.contains(e.target) && !btnUsuario?.contains(e.target)) {
        dropdown.classList.remove('aberto');
      }
    });
  }

  renderizar();
  inscrever(renderizar);
  window.addEventListener('hashchange', renderizar);
}
