// =========================================================
// RODA & SABOR — Serviço de Pontos
// Espelha as rotas de /api/pontos
// =========================================================
import { api } from './apiClient.js';

export async function buscarMeuExtrato() {
  return api.get('/api/pontos/extrato');
}

export async function listarExtratoAdmin() {
  return api.get('/api/pontos/admin/todos');
}
