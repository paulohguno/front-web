// =========================================================
// RODA & SABOR — Roteador SPA (hash-based)
// Simples, sem dependências, com guarda de autenticação.
// =========================================================
import { estaAutenticado, ehAdmin, obterEstado } from '../store/store.js';
import { toastErro } from '../utils/toast.js';

const rotas = [];
let elementoRaiz = null;
let cancelarPaginaAtual = null;

export function registrarRota(padrao, opcoes) {
  const partes = padrao.split('/').filter(Boolean);
  rotas.push({ padrao, partes, ...opcoes });
}

export function inicializarRouter(raiz) {
  elementoRaiz = raiz;
  window.addEventListener('hashchange', renderizarRotaAtual);
  renderizarRotaAtual();
}

export function navegarPara(caminho) {
  if (window.location.hash.slice(1) === caminho) {
    renderizarRotaAtual();
    return;
  }
  window.location.hash = caminho;
}

function corresponderRota(caminhoAtual) {
  const partesAtuais = caminhoAtual.split('/').filter(Boolean);

  for (const rota of rotas) {
    if (rota.partes.length !== partesAtuais.length) continue;
    const params = {};
    let ok = true;

    for (let i = 0; i < rota.partes.length; i += 1) {
      const parteRota = rota.partes[i];
      const parteAtual = partesAtuais[i];
      if (parteRota.startsWith(':')) {
        params[parteRota.slice(1)] = decodeURIComponent(parteAtual);
      } else if (parteRota !== parteAtual) {
        ok = false;
        break;
      }
    }

    if (ok) return { rota, params };
  }

  return null;
}

async function renderizarRotaAtual() {
  const caminho = (window.location.hash.slice(1) || '/').split('?')[0];
  const correspondencia = corresponderRota(caminho === '/' ? '/' : caminho);

  if (typeof cancelarPaginaAtual === 'function') {
    try { cancelarPaginaAtual(); } catch { /* noop */ }
    cancelarPaginaAtual = null;
  }

  if (!correspondencia) {
    elementoRaiz.innerHTML = `
      <div class="container">
        <div class="estado-vazio">
          <h3>Página não encontrada</h3>
          <p>O endereço acessado não existe.</p>
          <a href="#/" class="btn btn-secundario">Voltar para o início</a>
        </div>
      </div>`;
    return;
  }

  const { rota, params } = correspondencia;

  if (rota.exigeAuth && !estaAutenticado()) {
    if (obterEstado().carregandoSessao) {
      return;
    }
    toastErro('Faça login para continuar.');
    navegarPara('/login');
    return;
  }

  if (rota.exigeAdmin && !ehAdmin()) {
    toastErro('Acesso restrito a administradores.');
    navegarPara('/');
    return;
  }

  elementoRaiz.innerHTML = '<div class="carregando-bloco"><div class="spinner"></div></div>';
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

  try {
    const resultado = await rota.render(elementoRaiz, params);
    if (typeof resultado === 'function') {
      cancelarPaginaAtual = resultado;
    }
  } catch (erro) {
    console.error(erro);
    elementoRaiz.innerHTML = `
      <div class="container">
        <div class="estado-vazio">
          <h3>Algo deu errado</h3>
          <p>${erro?.message || 'Não foi possível carregar esta página.'}</p>
        </div>
      </div>`;
  }
}

export function reRenderizarRotaAtual() {
  renderizarRotaAtual();
}

export function rotaAtual() {
  return (window.location.hash.slice(1) || '/').split('?')[0];
}
