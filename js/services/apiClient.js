// =========================================================
// RODA & SABOR — Cliente de API
// Camada única de comunicação com o backend Express.
// =========================================================

const API_BASE_URL = window.RODA_SABOR_CONFIG?.API_BASE_URL || 'http://localhost:3333';

class ApiError extends Error {
  constructor(mensagem, status, dados) {
    super(mensagem);
    this.name = 'ApiError';
    this.status = status;
    this.dados = dados;
  }
}

function obterToken() {
  return localStorage.getItem('roda_sabor_token');
}

function definirToken(token) {
  if (token) localStorage.setItem('roda_sabor_token', token);
  else localStorage.removeItem('roda_sabor_token');
}

async function requisitar(caminho, { method = 'GET', body, autenticado = true, query } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = obterToken();

  if (autenticado && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let url = `${API_BASE_URL}${caminho}`;
  if (query && Object.keys(query).length) {
    const params = new URLSearchParams(
      Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== ''),
    );
    url += `?${params.toString()}`;
  }

  let resposta;
  try {
    resposta = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (erroRede) {
    throw new ApiError(
      'Não foi possível conectar à API. Verifique se o backend está rodando em ' + API_BASE_URL,
      0,
      null,
    );
  }

  let dados = null;
  const tipoConteudo = resposta.headers.get('content-type') || '';
  if (tipoConteudo.includes('application/json')) {
    dados = await resposta.json().catch(() => null);
  }

  if (!resposta.ok) {
    const mensagem = dados?.mensagem || `Erro ${resposta.status} ao acessar ${caminho}`;
    if (resposta.status === 401 && autenticado) {
      definirToken(null);
    }
    throw new ApiError(mensagem, resposta.status, dados);
  }

  return dados;
}

export const api = {
  get: (caminho, opcoes) => requisitar(caminho, { ...opcoes, method: 'GET' }),
  post: (caminho, body, opcoes) => requisitar(caminho, { ...opcoes, method: 'POST', body }),
  put: (caminho, body, opcoes) => requisitar(caminho, { ...opcoes, method: 'PUT', body }),
  delete: (caminho, opcoes) => requisitar(caminho, { ...opcoes, method: 'DELETE' }),
};

export { ApiError, obterToken, definirToken, API_BASE_URL };
