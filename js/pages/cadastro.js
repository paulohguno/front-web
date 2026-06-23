// =========================================================
// RODA & SABOR — Página: Cadastro
// =========================================================
import * as authService from '../services/authService.js';
import { definirUsuario } from '../store/store.js';
import { navegarPara } from '../router/router.js';
import { toastSucesso } from '../utils/toast.js';
import { ApiError } from '../services/apiClient.js';

export function renderCadastro(raiz) {
  raiz.innerHTML = `
    <div class="tela-auth">
      <div class="auth-caixa">
        <div class="card card-destacado">
          <div class="auth-cabecalho">
            <span class="eyebrow">Junte-se a nós</span>
            <h1>Criar sua conta</h1>
            <p>Cadastre-se para começar a pedir e acumular pontos.</p>
          </div>

          <div id="area-erro"></div>

          <form id="form-cadastro" novalidate>
            <div class="campo">
              <label for="nome">Nome completo</label>
              <input type="text" id="nome" name="nome" placeholder="Seu nome" required autocomplete="name" />
            </div>
            <div class="campo">
              <label for="email">E-mail</label>
              <input type="email" id="email" name="email" placeholder="voce@exemplo.com" required autocomplete="email" />
            </div>
            <div class="campo-linha">
              <div class="campo">
                <label for="cpf">CPF (opcional)</label>
                <input type="text" id="cpf" name="cpf" placeholder="000.000.000-00" autocomplete="off" />
              </div>
              <div class="campo">
                <label for="telefone">Telefone (opcional)</label>
                <input type="text" id="telefone" name="telefone" placeholder="(00) 00000-0000" autocomplete="tel" />
              </div>
            </div>
            <div class="campo">
              <label for="senha">Senha</label>
              <input type="password" id="senha" name="senha" placeholder="Mínimo 6 caracteres" required autocomplete="new-password" minlength="6" />
            </div>
            <button type="submit" class="btn btn-primario btn-bloco" id="btn-criar">Criar conta</button>
          </form>

          <p class="auth-rodape-link">
            Já tem conta? <a href="#/login">Entrar</a>
          </p>
        </div>
      </div>
    </div>
  `;

  const form = raiz.querySelector('#form-cadastro');
  const areaErro = raiz.querySelector('#area-erro');
  const btnCriar = raiz.querySelector('#btn-criar');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    areaErro.innerHTML = '';

    const dados = {
      nome: form.nome.value.trim(),
      email: form.email.value.trim(),
      senha: form.senha.value,
      cpf: form.cpf.value.trim() || null,
      telefone: form.telefone.value.trim() || null,
    };

    btnCriar.disabled = true;
    btnCriar.textContent = 'Criando conta...';

    try {
      const usuario = await authService.cadastrar(dados);
      definirUsuario(usuario);
      toastSucesso(`Conta criada com sucesso, ${usuario.nome.split(' ')[0]}!`);
      navegarPara('/menu');
    } catch (erro) {
      const mensagem = erro instanceof ApiError ? erro.message : 'Não foi possível criar a conta. Tente novamente.';
      areaErro.innerHTML = `<div class="alerta alerta-erro">${mensagem}</div>`;
    } finally {
      btnCriar.disabled = false;
      btnCriar.textContent = 'Criar conta';
    }
  });
}
