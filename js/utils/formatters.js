// =========================================================
// RODA & SABOR — Utilitários de formatação
// =========================================================

export function formatarMoeda(valor) {
  const numero = Number(valor || 0);
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatarData(data) {
  if (!data) return '—';
  const d = new Date(data);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatarDataHora(data) {
  if (!data) return '—';
  const d = new Date(data);
  return d.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function iniciais(nome) {
  if (!nome) return '?';
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] || '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

export function rotuloSituacaoPedido(situacao) {
  const mapa = {
    pendente: 'Pendente',
    pago: 'Pago',
    preparando: 'Preparando',
    entregue: 'Entregue',
    cancelado: 'Cancelado',
  };
  return mapa[situacao] || situacao;
}

export function escaparHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

export function mascararCartao(numero) {
  if (!numero) return '';
  const limpo = String(numero).replace(/\s+/g, '');
  const ultimos4 = limpo.slice(-4);
  return `•••• •••• •••• ${ultimos4}`;
}

export function debounce(fn, atraso = 300) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), atraso);
  };
}
