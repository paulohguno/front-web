// =========================================================
// RODA & SABOR — Serviço de Pedidos
// Espelha as rotas de /api/pedidos
// =========================================================
import { api } from './apiClient.js';

export async function listarMeusPedidos() {
  return api.get('/api/pedidos');
}

export async function criarPedido({ itens, cupomId }) {
  return api.post('/api/pedidos', { itens, cupomId });
}

export async function listarTodosPedidos() {
  return api.get('/api/pedidos/admin/todos');
}

export async function buscarPedidoAdmin(id) {
  return api.get(`/api/pedidos/admin/${id}`);
}

export async function atualizarPedidoAdmin(id, dados) {
  return api.put(`/api/pedidos/admin/${id}`, dados);
}

export async function removerPedidoAdmin(id) {
  return api.delete(`/api/pedidos/admin/${id}`);
}
