// =========================================================
// RODA & SABOR — Componente: Rodapé
// =========================================================

export function montarRodape(containerEl) {
  const ano = new Date().getFullYear();
  containerEl.innerHTML = `
    <footer class="rodape">
      <div class="container">
        <p style="margin:0;">Roda &amp; Sabor — © ${ano}. Sabor de verdade, sorte de bônus.</p>
      </div>
    </footer>
  `;
}
