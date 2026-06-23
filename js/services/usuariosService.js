// =========================================================
// RODA & SABOR — Serviço de Usuários (admin)
// Espelha as rotas de /api/usuarios
// =========================================================
import { api } from './apiClient.js';

export async function listarUsuariosAdmin() {
  return api.get('/api/usuarios');
}

export async function buscarUsuarioAdmin(id) {
  return api.get(`/api/usuarios/${id}`);
}

export async function criarUsuarioAdmin(dados) {
  return api.post('/api/usuarios', dados);
}

export async function atualizarUsuarioAdmin(id, dados) {
  return api.put(`/api/usuarios/${id}`, dados);
}

export async function removerUsuarioAdmin(id) {
  return api.delete(`/api/usuarios/${id}`);
}
