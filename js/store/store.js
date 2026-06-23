// =========================================================
// RODA & SABOR — Store de estado global
// Padrão pub/sub simples, sem dependências externas.
// Mantém: usuário autenticado e carrinho de compras.
// =========================================================
import { obterToken, definirToken } from '../services/apiClient.js';

const CHAVE_CARRINHO = 'roda_sabor_carrinho';

function lerCarrinhoSalvo() {
  try {
    const bruto = localStorage.getItem(CHAVE_CARRINHO);
    return bruto ? JSON.parse(bruto) : [];
  } catch {
    return [];
  }
}

const estado = {
  usuario: null,
  carregandoSessao: true,
  carrinho: lerCarrinhoSalvo(),
  cupomSelecionadoId: null,
};

const ouvintes = new Set();

function notificar() {
  ouvintes.forEach((fn) => fn(estado));
}

export function inscrever(fn) {
  ouvintes.add(fn);
  return () => ouvintes.delete(fn);
}

export function obterEstado() {
  return estado;
}

export function definirUsuario(usuario) {
  estado.usuario = usuario;
  estado.carregandoSessao = false;
  notificar();
}

export function definirCarregandoSessao(valor) {
  estado.carregandoSessao = valor;
  notificar();
}

export function estaAutenticado() {
  return Boolean(obterToken()) && Boolean(estado.usuario);
}

export function ehAdmin() {
  return Number(estado.usuario?.idFuncao) === 2;
}

export function fazerLogout() {
  definirToken(null);
  estado.usuario = null;
  estado.cupomSelecionadoId = null;
  notificar();
}

// --- Carrinho ---
function persistirCarrinho() {
  localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(estado.carrinho));
}

export function obterCarrinho() {
  return estado.carrinho;
}

export function adicionarAoCarrinho(itemMenu, quantidade = 1) {
  const existente = estado.carrinho.find((linha) => linha.itemMenuId === itemMenu.id);
  if (existente) {
    existente.quantidade += quantidade;
  } else {
    estado.carrinho.push({
      itemMenuId: itemMenu.id,
      nome: itemMenu.nome,
      preco: Number(itemMenu.preco),
      urlImagem: itemMenu.urlImagem || itemMenu.url_imagem || null,
      quantidade,
    });
  }
  persistirCarrinho();
  notificar();
}

export function alterarQuantidadeCarrinho(itemMenuId, delta) {
  const linha = estado.carrinho.find((l) => l.itemMenuId === itemMenuId);
  if (!linha) return;
  linha.quantidade += delta;
  if (linha.quantidade <= 0) {
    estado.carrinho = estado.carrinho.filter((l) => l.itemMenuId !== itemMenuId);
  }
  persistirCarrinho();
  notificar();
}

export function removerDoCarrinho(itemMenuId) {
  estado.carrinho = estado.carrinho.filter((l) => l.itemMenuId !== itemMenuId);
  persistirCarrinho();
  notificar();
}

export function limparCarrinho() {
  estado.carrinho = [];
  estado.cupomSelecionadoId = null;
  persistirCarrinho();
  notificar();
}

export function totalItensCarrinho() {
  return estado.carrinho.reduce((soma, l) => soma + l.quantidade, 0);
}

export function subtotalCarrinho() {
  return estado.carrinho.reduce((soma, l) => soma + l.quantidade * l.preco, 0);
}

export function definirCupomSelecionado(cupomId) {
  estado.cupomSelecionadoId = cupomId;
  notificar();
}

export function obterCupomSelecionado() {
  return estado.cupomSelecionadoId;
}
