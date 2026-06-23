// =========================================================
// RODA & SABOR — Serviço de Menu (Cardápio)
// Espelha as rotas de /api/menu
// =========================================================
import { api } from './apiClient.js';

export async function listarMenu() {
  const itens = await api.get('/api/menu', { autenticado: false });
  return itens;
}

export async function buscarItemMenu(id) {
  return api.get(`/api/menu/${id}`, { autenticado: false });
}

export async function criarItemMenu(dados) {
  return api.post('/api/menu', dados);
}

export async function atualizarItemMenu(id, dados) {
  return api.put(`/api/menu/${id}`, dados);
}

export async function removerItemMenu(id) {
  return api.delete(`/api/menu/${id}`);
}
