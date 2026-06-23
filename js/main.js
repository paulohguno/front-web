// =========================================================
// RODA & SABOR — Entry point principal
// Inicializa store, router, header, rodapé e rotas.
// =========================================================
import { montarCabecalho } from './components/cabecalho.js';
import { montarRodape } from './components/rodape.js';
import { registrarRota, inicializarRouter, reRenderizarRotaAtual } from './router/router.js';
import { definirUsuario, definirCarregandoSessao } from './store/store.js';
import { buscarMeuPerfil } from './services/authService.js';
import { obterToken } from './services/apiClient.js';

import { renderHome }     from './pages/home.js';
import { renderLogin }    from './pages/login.js';
import { renderCadastro } from './pages/cadastro.js';
import { renderMenu }     from './pages/menu.js';
import { renderCarrinho } from './pages/carrinho.js';
import { renderPedidos }  from './pages/pedidos.js';
import { renderRoleta }   from './pages/roleta.js';
import { renderPerfil }   from './pages/perfil.js';
import { renderAdmin }    from './pages/admin.js';

// ─── Registrar rotas ──────────────────────────────────────
registrarRota('/', { render: renderHome });
registrarRota('/login', { render: renderLogin });
registrarRota('/cadastro', { render: renderCadastro });
registrarRota('/menu', { render: renderMenu });
registrarRota('/carrinho', { render: renderCarrinho, exigeAuth: true });
registrarRota('/pedidos', { render: renderPedidos, exigeAuth: true });
registrarRota('/roleta', { render: renderRoleta, exigeAuth: true });
registrarRota('/perfil', { render: renderPerfil, exigeAuth: true });
registrarRota('/admin', { render: renderAdmin, exigeAuth: true, exigeAdmin: true });

// ─── Montar shell da aplicação ────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  const appEl = document.getElementById('app');

  // Header e rodapé persistem entre rotas
  const headerEl = document.createElement('div');
  const mainEl = document.createElement('div');
  mainEl.id = 'pagina';
  const footerEl = document.createElement('div');

  appEl.appendChild(headerEl);
  appEl.appendChild(mainEl);
  appEl.appendChild(footerEl);

  montarCabecalho(headerEl);
  montarRodape(footerEl);

  // ─── Restaurar sessão do token salvo ─────────────────────
  definirCarregandoSessao(true);

  if (obterToken()) {
    try {
      const usuario = await buscarMeuPerfil();
      definirUsuario(usuario); // sets carregandoSessao = false
    } catch {
      definirCarregandoSessao(false);
    }
  } else {
    definirCarregandoSessao(false);
  }

  // Inicializa router depois de restaurar sessão para que a
  // guarda de autenticação funcione corretamente.
  inicializarRouter(mainEl);
});
