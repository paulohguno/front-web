// =========================================================
// RODA & SABOR — Serviço de Endereços e Cartões
// Espelha as rotas de /api/enderecos e /api/cartoes
// =========================================================
import { api } from './apiClient.js';

// --- Endereços ---
export async function listarMeusEnderecos() {
  return api.get('/api/enderecos');
}

export async function criarEndereco(dados) {
  return api.post('/api/enderecos', dados);
}

export async function atualizarEndereco(id, dados) {
  return api.put(`/api/enderecos/${id}`, dados);
}

export async function removerEndereco(id) {
  return api.delete(`/api/enderecos/${id}`);
}

// --- Cartões ---
export async function listarMeusCartoes() {
  return api.get('/api/cartoes');
}

export async function criarCartao(dados) {
  return api.post('/api/cartoes', dados);
}

export async function atualizarCartao(id, dados) {
  return api.put(`/api/cartoes/${id}`, dados);
}

export async function removerCartao(id) {
  return api.delete(`/api/cartoes/${id}`);
}
