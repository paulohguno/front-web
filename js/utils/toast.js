// =========================================================
// RODA & SABOR — Toasts (notificações flutuantes)
// =========================================================

function garantirArea() {
  let area = document.getElementById('toast-area');
  if (!area) {
    area = document.createElement('div');
    area.id = 'toast-area';
    area.setAttribute('aria-live', 'polite');
    document.body.appendChild(area);
  }
  return area;
}

export function mostrarToast(mensagem, tipo = 'padrao', duracaoMs = 4200) {
  const area = garantirArea();
  const toast = document.createElement('div');
  toast.className = `toast ${tipo === 'erro' ? 'toast-erro' : tipo === 'sucesso' ? 'toast-sucesso' : ''}`;
  toast.textContent = mensagem;
  area.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 200ms ease, transform 200ms ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(16px)';
    setTimeout(() => toast.remove(), 220);
  }, duracaoMs);
}

export const toastSucesso = (msg) => mostrarToast(msg, 'sucesso');
export const toastErro = (msg) => mostrarToast(msg, 'erro');
