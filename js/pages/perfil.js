// =========================================================
// RODA & SABOR — Página: Perfil do usuário
// =========================================================
import { buscarMeuPerfil, atualizarMeuPerfil, atualizarMinhaSenha } from '../services/authService.js';
import { listarMeusEnderecos, criarEndereco, removerEndereco } from '../services/perfilService.js';
import { listarMeusCartoes, criarCartao, removerCartao } from '../services/perfilService.js';
import { buscarMeuExtrato } from '../services/pontosService.js';
import { definirUsuario, obterEstado } from '../store/store.js';
import { formatarDataHora, iniciais, mascararCartao } from '../utils/formatters.js';
import { toastSucesso, toastErro } from '../utils/toast.js';
import { abrirModal } from '../components/modal.js';
import { ApiError } from '../services/apiClient.js';

export async function renderPerfil(raiz) {
  raiz.innerHTML = `
    <main>
      <div class="container" style="padding-top: var(--espaco-7); padding-bottom: var(--espaco-8);">
        <span class="eyebrow">Conta</span>
        <h1 style="margin-bottom: var(--espaco-6);">Meu perfil</h1>
        <div id="area-conteudo">
          <div class="carregando-bloco"><div class="spinner"></div></div>
        </div>
      </div>
    </main>
  `;

  const area = raiz.querySelector('#area-conteudo');

  let usuario, enderecos = [], cartoes = [], extrato = [];
  try {
    [usuario, enderecos, cartoes, extrato] = await Promise.all([
      buscarMeuPerfil(),
      listarMeusEnderecos().catch(() => []),
      listarMeusCartoes().catch(() => []),
      buscarMeuExtrato().catch(() => []),
    ]);
    definirUsuario(usuario);
  } catch (erro) {
    area.innerHTML = `<div class="alerta alerta-erro">${erro.message}</div>`;
    return;
  }

  function renderizarTudo() {
    area.innerHTML = `
      <div class="grade-perfil">
        <!-- Coluna lateral -->
        <aside>
          <div class="card card-destacado perfil-cartao-resumo" style="margin-bottom: var(--espaco-4);">
            <div class="perfil-avatar-grande">${iniciais(usuario.nome)}</div>
            <h3 style="margin-bottom: 4px;">${usuario.nome}</h3>
            <p style="font-size:0.84rem; margin-bottom: var(--espaco-3);">${usuario.email}</p>
            <div style="display:inline-flex; align-items:center; gap:8px; background: var(--cor-dourado-fundo); border: 1px solid rgba(212,175,55,0.3); border-radius: 999px; padding: 8px 16px;">
              <span style="font-size:1.1rem;">★</span>
              <span style="font-family: var(--fonte-mono); font-weight:700; color: var(--cor-dourado-claro);">${usuario.pontos} pontos</span>
            </div>
          </div>
        </aside>

        <!-- Coluna principal com abas -->
        <div>
          <div class="abas">
            <button class="aba-btn ativa" data-aba="dados">Dados pessoais</button>
            <button class="aba-btn" data-aba="enderecos">Endereços</button>
            <button class="aba-btn" data-aba="cartoes">Cartões</button>
            <button class="aba-btn" data-aba="extrato">Extrato de pontos</button>
            <button class="aba-btn" data-aba="senha">Senha</button>
          </div>

          <!-- Dados pessoais -->
          <div class="conteudo-aba" data-conteudo="dados">
            <form id="form-perfil" class="card">
              <h3 style="margin-bottom: var(--espaco-4);">Informações pessoais</h3>
              <div class="campo">
                <label>Nome completo</label>
                <input type="text" name="nome" value="${usuario.nome}" required />
              </div>
              <div class="campo-linha">
                <div class="campo">
                  <label>CPF</label>
                  <input type="text" name="cpf" value="${usuario.cpf || ''}" placeholder="Opcional" />
                </div>
                <div class="campo">
                  <label>Telefone</label>
                  <input type="text" name="telefone" value="${usuario.telefone || ''}" placeholder="Opcional" />
                </div>
              </div>
              <div id="perfil-erro"></div>
              <button type="submit" class="btn btn-primario">Salvar alterações</button>
            </form>
          </div>

          <!-- Endereços -->
          <div class="conteudo-aba" data-conteudo="enderecos" style="display:none;">
            <div class="admin-toolbar">
              <h3>Meus endereços</h3>
              <button class="btn btn-secundario btn-sm" id="btn-add-end">+ Adicionar</button>
            </div>
            <div class="lista-cadastros" id="lista-enderecos">
              ${enderecos.length ? enderecos.map((e) => `
                <div class="cadastro-item" data-id="${e.id}">
                  <div class="cadastro-item-info">
                    <strong>${e.logradouro}, ${e.numero}${e.complemento ? ' — ' + e.complemento : ''}</strong>
                    <span>${e.bairro}${e.referencia ? ' · ' + e.referencia : ''}</span>
                  </div>
                  <button class="btn btn-perigo btn-sm btn-del-end" data-id="${e.id}">Remover</button>
                </div>
              `).join('') : '<p style="color: var(--cor-texto-fraco);">Nenhum endereço cadastrado.</p>'}
            </div>
          </div>

          <!-- Cartões -->
          <div class="conteudo-aba" data-conteudo="cartoes" style="display:none;">
            <div class="admin-toolbar">
              <h3>Meus cartões</h3>
              <button class="btn btn-secundario btn-sm" id="btn-add-cart">+ Adicionar</button>
            </div>
            <div class="lista-cadastros" id="lista-cartoes">
              ${cartoes.length ? cartoes.map((c) => `
                <div class="cadastro-item" data-id="${c.id}">
                  <div class="cadastro-item-info">
                    <strong>${mascararCartao(c.numeroCartao)}</strong>
                    <span>${c.nomeCartao} · Validade: ${c.dataValidade}</span>
                  </div>
                  <button class="btn btn-perigo btn-sm btn-del-cart" data-id="${c.id}">Remover</button>
                </div>
              `).join('') : '<p style="color: var(--cor-texto-fraco);">Nenhum cartão cadastrado.</p>'}
            </div>
          </div>

          <!-- Extrato de pontos -->
          <div class="conteudo-aba" data-conteudo="extrato" style="display:none;">
            <h3 style="margin-bottom: var(--espaco-4);">Extrato de pontos</h3>
            ${extrato.length ? `
              <div class="card tabela-wrap">
                <table class="tabela-admin">
                  <thead>
                    <tr><th>Data</th><th>Descrição</th><th>Pontos</th></tr>
                  </thead>
                  <tbody>
                    ${extrato.map((t) => `
                      <tr>
                        <td style="color: var(--cor-texto-fraco);">${formatarDataHora(t.createdAt)}</td>
                        <td>${t.descricao}</td>
                        <td class="numero-mono" style="color: ${t.tipo === 'credito' ? 'var(--cor-sucesso)' : 'var(--cor-erro)'};">
                          ${t.tipo === 'credito' ? '+' : '−'}${t.valor}
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : '<p style="color: var(--cor-texto-fraco);">Nenhuma movimentação de pontos ainda.</p>'}
          </div>

          <!-- Senha -->
          <div class="conteudo-aba" data-conteudo="senha" style="display:none;">
            <form id="form-senha" class="card">
              <h3 style="margin-bottom: var(--espaco-4);">Alterar senha</h3>
              <div class="campo">
                <label>Senha atual</label>
                <input type="password" name="senha_atual" placeholder="••••••••" required />
              </div>
              <div class="campo">
                <label>Nova senha</label>
                <input type="password" name="nova_senha" placeholder="Mínimo 6 caracteres" required minlength="6" />
              </div>
              <div id="senha-erro"></div>
              <button type="submit" class="btn btn-primario">Alterar senha</button>
            </form>
          </div>
        </div>
      </div>
    `;

    // --- Lógica de abas ---
    area.querySelectorAll('.aba-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        area.querySelectorAll('.aba-btn').forEach((b) => b.classList.remove('ativa'));
        area.querySelectorAll('.conteudo-aba').forEach((el) => (el.style.display = 'none'));
        btn.classList.add('ativa');
        area.querySelector(`[data-conteudo="${btn.dataset.aba}"]`).style.display = '';
      });
    });

    // --- Form dados pessoais ---
    area.querySelector('#form-perfil')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Salvando...';
      try {
        const dados = {
          nome: e.target.nome.value.trim(),
          cpf: e.target.cpf.value.trim() || null,
          telefone: e.target.telefone.value.trim() || null,
        };
        usuario = await atualizarMeuPerfil(dados);
        definirUsuario(usuario);
        toastSucesso('Perfil atualizado com sucesso!');
        renderizarTudo();
      } catch (err) {
        area.querySelector('#perfil-erro').innerHTML = `<div class="alerta alerta-erro">${err.message}</div>`;
        btn.disabled = false;
        btn.textContent = 'Salvar alterações';
      }
    });

    // --- Form senha ---
    area.querySelector('#form-senha')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Alterando...';
      try {
        await atualizarMinhaSenha({
          senha_atual: e.target.senha_atual.value,
          nova_senha: e.target.nova_senha.value,
        });
        toastSucesso('Senha alterada com sucesso!');
        e.target.reset();
      } catch (err) {
        area.querySelector('#senha-erro').innerHTML = `<div class="alerta alerta-erro">${err.message}</div>`;
      } finally {
        btn.disabled = false;
        btn.textContent = 'Alterar senha';
      }
    });

    // --- Endereços ---
    area.querySelector('#btn-add-end')?.addEventListener('click', () => {
      abrirModal({
        titulo: 'Novo endereço',
        conteudoHtml: `
          <form id="form-end" novalidate>
            <div class="campo"><label>Logradouro</label><input type="text" name="logradouro" required /></div>
            <div class="campo-linha">
              <div class="campo"><label>Número</label><input type="text" name="numero" required /></div>
              <div class="campo"><label>Bairro</label><input type="text" name="bairro" required /></div>
            </div>
            <div class="campo"><label>Complemento</label><input type="text" name="complemento" /></div>
            <div class="campo"><label>Referência</label><input type="text" name="referencia" /></div>
            <div id="end-erro"></div>
            <button type="submit" class="btn btn-primario btn-bloco">Salvar endereço</button>
          </form>
        `,
        aoMontar: (el, fechar) => {
          el.querySelector('#form-end').addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
              const novo = await criarEndereco({
                logradouro: e.target.logradouro.value.trim(),
                numero: e.target.numero.value.trim(),
                bairro: e.target.bairro.value.trim(),
                complemento: e.target.complemento.value.trim() || null,
                referencia: e.target.referencia.value.trim() || null,
              });
              enderecos.push(novo);
              fechar();
              toastSucesso('Endereço adicionado!');
              renderizarTudo();
              setTimeout(() => area.querySelector('[data-aba="enderecos"]')?.click(), 50);
            } catch (err) {
              el.querySelector('#end-erro').innerHTML = `<div class="alerta alerta-erro">${err.message}</div>`;
            }
          });
        },
      });
    });

    area.querySelectorAll('.btn-del-end').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('Remover este endereço?')) return;
        try {
          await removerEndereco(Number(btn.dataset.id));
          enderecos = enderecos.filter((e) => e.id !== Number(btn.dataset.id));
          toastSucesso('Endereço removido.');
          renderizarTudo();
          setTimeout(() => area.querySelector('[data-aba="enderecos"]')?.click(), 50);
        } catch (err) {
          toastErro(err.message);
        }
      });
    });

    // --- Cartões ---
    area.querySelector('#btn-add-cart')?.addEventListener('click', () => {
      abrirModal({
        titulo: 'Novo cartão',
        conteudoHtml: `
          <form id="form-cart" novalidate>
            <div class="campo"><label>Número do cartão</label><input type="text" name="numero" placeholder="0000 0000 0000 0000" required maxlength="19" /></div>
            <div class="campo"><label>Nome no cartão</label><input type="text" name="nome" required /></div>
            <div class="campo-linha">
              <div class="campo"><label>Validade</label><input type="text" name="validade" placeholder="MM/AA" required maxlength="5" /></div>
              <div class="campo"><label>CVV</label><input type="text" name="cvv" placeholder="000" required maxlength="4" /></div>
            </div>
            <div id="cart-erro"></div>
            <button type="submit" class="btn btn-primario btn-bloco">Salvar cartão</button>
          </form>
        `,
        aoMontar: (el, fechar) => {
          el.querySelector('#form-cart').addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
              const novo = await criarCartao({
                numeroCartao: e.target.numero.value.replace(/\s/g, ''),
                nomeCartao: e.target.nome.value.trim(),
                dataValidade: e.target.validade.value.trim(),
                cvv: e.target.cvv.value.trim(),
              });
              cartoes.push(novo);
              fechar();
              toastSucesso('Cartão adicionado!');
              renderizarTudo();
              setTimeout(() => area.querySelector('[data-aba="cartoes"]')?.click(), 50);
            } catch (err) {
              el.querySelector('#cart-erro').innerHTML = `<div class="alerta alerta-erro">${err.message}</div>`;
            }
          });
        },
      });
    });

    area.querySelectorAll('.btn-del-cart').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('Remover este cartão?')) return;
        try {
          await removerCartao(Number(btn.dataset.id));
          cartoes = cartoes.filter((c) => c.id !== Number(btn.dataset.id));
          toastSucesso('Cartão removido.');
          renderizarTudo();
          setTimeout(() => area.querySelector('[data-aba="cartoes"]')?.click(), 50);
        } catch (err) {
          toastErro(err.message);
        }
      });
    });
  }

  renderizarTudo();
}
