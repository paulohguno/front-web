// =========================================================
// RODA & SABOR — Serviço de Roleta
// Espelha as rotas de /api/roleta
// =========================================================
import { api } from './apiClient.js';

export async function listarPremiosRoleta() {
  return api.get('/api/roleta/premios', { autenticado: false });
}

export async function girarRoleta() {
  return api.post('/api/roleta/girar');
}

export async function listarMeusCupons() {
  return api.get('/api/roleta/cupons');
}

// --- Admin: prêmios da roleta ---
export async function listarPremiosAdmin() {
  return api.get('/api/roleta/premios/admin/todos');
}

export async function criarPremioAdmin(dados) {
  return api.post('/api/roleta/premios/admin', dados);
}

export async function atualizarPremioAdmin(id, dados) {
  return api.put(`/api/roleta/premios/admin/${id}`, dados);
}

export async function removerPremioAdmin(id) {
  return api.delete(`/api/roleta/premios/admin/${id}`);
}

// --- Admin: cupons de usuários ---
export async function listarCuponsAdmin() {
  return api.get('/api/roleta/cupons/admin/todos');
}
