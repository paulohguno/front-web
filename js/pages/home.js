// =========================================================
// RODA & SABOR — Página: Início (landing)
// =========================================================
import { estaAutenticado } from '../store/store.js';
import { montarRoletaSvg } from '../components/roletaSvg.js';

const PREMIOS_DECORATIVOS = [
  { nome: '5% OFF', probabilidade_vitoria: 30, cor: '#1c1814' },
  { nome: '10% OFF', probabilidade_vitoria: 25, cor: '#d4af37' },
  { nome: 'Quase lá', probabilidade_vitoria: 20, cor: '#151310' },
  { nome: '15% OFF', probabilidade_vitoria: 15, cor: '#8a7a4f' },
  { nome: '20% OFF', probabilidade_vitoria: 10, cor: '#f2d680' },
];

export function renderHome(raiz) {
  const autenticado = estaAutenticado();
  const { svg } = montarRoletaSvg(PREMIOS_DECORATIVOS);

  raiz.innerHTML = `
    <section class="hero">
      <div class="container">
        <div class="hero-grade">
          <div>
            <span class="eyebrow hero-eyebrow">Restaurante &amp; sorte premiada</span>
            <h1>Cada pedido gira a roda a seu favor.</h1>
            <p style="font-size:1.05rem; max-width:480px;">
              Peça seus pratos favoritos, acumule pontos automaticamente e troque-os por giros
              na roleta de prêmios. Descontos reais, direto no seu próximo pedido.
            </p>
            <div class="hero-acoes">
              ${autenticado ? `
                <a href="#/menu" class="btn btn-primario">Ver cardápio</a>
                <a href="#/roleta" class="btn btn-secundario">Girar a roleta</a>
              ` : `
                <a href="#/cadastro" class="btn btn-primario">Criar conta grátis</a>
                <a href="#/login" class="btn btn-secundario">Já tenho conta</a>
              `}
            </div>
          </div>
          <div class="hero-roleta-mini">
            <div class="roleta-svg-wrap" style="width:min(320px, 80vw);">
              ${svg}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="secao-faixa">
      <div class="container">
        <div style="text-align:center; margin-bottom: var(--espaco-6);">
          <span class="eyebrow">Como funciona</span>
          <h2>Três passos até o próximo desconto</h2>
        </div>
        <div class="grade-3">
          <div class="card como-funciona-card">
            <div class="como-funciona-num">01</div>
            <h3>Peça no cardápio</h3>
            <p>Monte seu pedido com pratos e acompanhamentos do nosso cardápio.</p>
          </div>
          <div class="card como-funciona-card">
            <div class="como-funciona-num">02</div>
            <h3>Acumule pontos</h3>
            <p>Cada real gasto vira pontos automaticamente na sua conta.</p>
          </div>
          <div class="card como-funciona-card">
            <div class="como-funciona-num">03</div>
            <h3>Gire e economize</h3>
            <p>Troque 100 pontos por um giro e ganhe cupons de desconto reais.</p>
          </div>
        </div>
      </div>
    </section>
  `;
}
