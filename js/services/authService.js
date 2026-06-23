// =========================================================
// RODA & SABOR — Serviço de Autenticação
// Espelha as rotas de /api/auth
// =========================================================
import { api, definirToken } from './apiClient.js';

export async function cadastrar({ nome, email, senha, cpf, telefone }) {
  const resposta = await api.post('/api/auth/cadastro', { nome, email, senha, cpf, telefone }, { autenticado: false });
  definirToken(resposta.token);
  return resposta.usuario;
}

export async function login({ email, senha }) {
  const resposta = await api.post('/api/auth/login', { email, senha }, { autenticado: false });
  definirToken(resposta.token);
  return resposta.usuario;
}

export async function buscarMeuPerfil() {
  const resposta = await api.get('/api/auth/me');
  return resposta.usuario;
}

export async function atualizarMeuPerfil(dados) {
  const resposta = await api.put('/api/auth/me', dados);
  return resposta.usuario;
}

export async function atualizarMinhaSenha({ senha_atual, nova_senha }) {
  return api.put('/api/auth/me/senha', { senha_atual, nova_senha });
}

export async function removerMinhaConta() {
  const resultado = await api.delete('/api/auth/me');
  definirToken(null);
  return resultado;
}

export function sair() {
  definirToken(null);
}
