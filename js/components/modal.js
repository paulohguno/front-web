// =========================================================
// RODA & SABOR — Componente: Modal
// =========================================================

export function abrirModal({ titulo, conteudoHtml, aoMontar, aoFechar }) {
  const fundo = document.createElement('div');
  fundo.className = 'modal-fundo';
  fundo.innerHTML = `
    <div class="modal-caixa" role="dialog" aria-modal="true" aria-label="${titulo || ''}">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:16px;">
        <h3 style="margin:0;">${titulo || ''}</h3>
        <button id="modal-fechar" class="btn-fantasma btn-sm" aria-label="Fechar" style="padding:6px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div id="modal-conteudo"></div>
    </div>
  `;

  document.body.appendChild(fundo);
  document.body.classList.add('scroll-trava');

  const conteudoEl = fundo.querySelector('#modal-conteudo');
  if (typeof conteudoHtml === 'string') {
    conteudoEl.innerHTML = conteudoHtml;
  } else if (conteudoHtml instanceof HTMLElement) {
    conteudoEl.appendChild(conteudoHtml);
  }

  function fechar() {
    fundo.remove();
    document.body.classList.remove('scroll-trava');
    document.removeEventListener('keydown', aoEsc);
    if (typeof aoFechar === 'function') aoFechar();
  }

  function aoEsc(e) {
    if (e.key === 'Escape') fechar();
  }

  fundo.querySelector('#modal-fechar').addEventListener('click', fechar);
  fundo.addEventListener('click', (e) => {
    if (e.target === fundo) fechar();
  });
  document.addEventListener('keydown', aoEsc);

  if (typeof aoMontar === 'function') aoMontar(conteudoEl, fechar);

  return fechar;
}
