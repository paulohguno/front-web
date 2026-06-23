// =========================================================
// RODA & SABOR — Página: Login
// =========================================================
import * as authService from '../services/authService.js';
import { definirUsuario } from '../store/store.js';
import { navegarPara } from '../router/router.js';
import { toastSucesso } from '../utils/toast.js';
import { ApiError } from '../services/apiClient.js';

export function renderLogin(raiz) {
  raiz.innerHTML = `
    <div class="tela-auth">
      <div class="auth-caixa">
        <div class="card card-destacado">
          <div class="auth-cabecalho">
            <span class="eyebrow">Bem-vindo de volta</span>
            <h1>Entrar na conta</h1>
            <p>Acesse para pedir, acumular pontos e girar a roleta.</p>
          </div>

          <div id="area-erro"></div>

          <form id="form-login" novalidate>
            <div class="campo">
              <label for="email">E-mail</label>
              <input type="email" id="email" name="email" placeholder="voce@exemplo.com" required autocomplete="email" />
            </div>
            <div class="campo">
              <label for="senha">Senha</label>
              <input type="password" id="senha" name="senha" placeholder="••••••••" required autocomplete="current-password" />
            </div>
            <button type="submit" class="btn btn-primario btn-bloco" id="btn-entrar">Entrar</button>
          </form>

          <p class="auth-rodape-link">
            Ainda não tem conta? <a href="#/cadastro">Criar conta</a>
          </p>
        </div>
      </div>
    </div>
  `;

  const form = raiz.querySelector('#form-login');
  const areaErro = raiz.querySelector('#area-erro');
  const btnEntrar = raiz.querySelector('#btn-entrar');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    areaErro.innerHTML = '';

    const email = form.email.value.trim();
    const senha = form.senha.value;

    btnEntrar.disabled = true;
    btnEntrar.textContent = 'Entrando...';

    try {
      const usuario = await authService.login({ email, senha });
      definirUsuario(usuario);
      toastSucesso(`Bem-vindo, ${usuario.nome.split(' ')[0]}!`);
      navegarPara('/menu');
    } catch (erro) {
      const mensagem = erro instanceof ApiError ? erro.message : 'Não foi possível entrar. Tente novamente.';
      areaErro.innerHTML = `<div class="alerta alerta-erro">${mensagem}</div>`;
    } finally {
      btnEntrar.disabled = false;
      btnEntrar.textContent = 'Entrar';
    }
  });
}
