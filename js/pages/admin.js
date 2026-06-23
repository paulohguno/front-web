// =========================================================
// RODA & SABOR — Página: Admin (painel administrativo)
// Abas: Dashboard | Cardápio | Pedidos | Roleta | Usuários
// =========================================================
import { listarMenu, criarItemMenu, atualizarItemMenu, removerItemMenu } from '../services/menuService.js';
import { listarTodosPedidos, atualizarPedidoAdmin } from '../services/pedidoService.js';
import { listarPremiosAdmin, criarPremioAdmin, atualizarPremioAdmin, removerPremioAdmin } from '../services/roletaService.js';
import { listarUsuariosAdmin } from '../services/usuariosService.js';
import { formatarMoeda, formatarDataHora, rotuloSituacaoPedido } from '../utils/formatters.js';
import { toastSucesso, toastErro } from '../utils/toast.js';
import { abrirModal } from '../components/modal.js';

const SITUACOES_PEDIDO = ['pendente','pago','preparando','entregue','cancelado'];

export async function renderAdmin(raiz) {
  raiz.innerHTML = `
    <main>
      <div class="container" style="padding-top: var(--espaco-6); padding-bottom: var(--espaco-8);">
        <span class="eyebrow">Painel</span>
        <h1 style="margin-bottom: var(--espaco-5);">Administração</h1>
        <div class="abas" id="abas-admin">
          <button class="aba-btn ativa" data-aba="dashboard">Dashboard</button>
          <button class="aba-btn" data-aba="cardapio">Cardápio</button>
          <button class="aba-btn" data-aba="pedidos">Pedidos</button>
          <button class="aba-btn" data-aba="roleta">Roleta</button>
          <button class="aba-btn" data-aba="usuarios">Usuários</button>
        </div>
        <div id="conteudo-admin">
          <div class="carregando-bloco"><div class="spinner"></div></div>
        </div>
      </div>
    </main>
  `;

  const conteudoEl = raiz.querySelector('#conteudo-admin');

  // Carregamento paralelo dos dados iniciais
  let [itensMenu, pedidos, premios, usuarios] = [[], [], [], []];
  try {
    [itensMenu, pedidos, premios, usuarios] = await Promise.all([
      listarMenu().catch(() => []),
      listarTodosPedidos().catch(() => []),
      listarPremiosAdmin().catch(() => []),
      listarUsuariosAdmin().catch(() => []),
    ]);
  } catch {}

  // ─── Roteamento de abas ──────────────────────────────────
  const abas = raiz.querySelectorAll('.aba-btn');
  abas.forEach((btn) => {
    btn.addEventListener('click', () => {
      abas.forEach((b) => b.classList.remove('ativa'));
      btn.classList.add('ativa');
      renderAba(btn.dataset.aba);
    });
  });

  function renderAba(aba) {
    switch (aba) {
      case 'dashboard': renderDashboard(); break;
      case 'cardapio':  renderCardapio();  break;
      case 'pedidos':   renderPedidos();   break;
      case 'roleta':    renderRoleta();    break;
      case 'usuarios':  renderUsuarios();  break;
    }
  }

  // ─── Dashboard ───────────────────────────────────────────
  function renderDashboard() {
    const receitaTotal = pedidos
      .filter((p) => p.situacao !== 'cancelado')
      .reduce((s, p) => s + Number(p.precoTotal || 0), 0);

    conteudoEl.innerHTML = `
      <div class="admin-grade-stats">
        <div class="card stat-card">
          <div class="valor numero-mono">${pedidos.length}</div>
          <div class="rotulo">Total de pedidos</div>
        </div>
        <div class="card stat-card">
          <div class="valor numero-mono">${formatarMoeda(receitaTotal)}</div>
          <div class="rotulo">Receita total</div>
        </div>
        <div class="card stat-card">
          <div class="valor numero-mono">${itensMenu.length}</div>
          <div class="rotulo">Itens no cardápio</div>
        </div>
        <div class="card stat-card">
          <div class="valor numero-mono">${usuarios.length}</div>
          <div class="rotulo">Usuários</div>
        </div>
      </div>

      <div class="card">
        <h3 style="margin-bottom: var(--espaco-4);">Pedidos recentes</h3>
        <div class="tabela-wrap">
          <table class="tabela-admin">
            <thead><tr><th>ID</th><th>Usuário</th><th>Total</th><th>Situação</th><th>Data</th></tr></thead>
            <tbody>
              ${pedidos.slice(0, 10).map((p) => `
                <tr>
                  <td class="numero-mono">#${p.id}</td>
                  <td>${p.usuarioId}</td>
                  <td class="numero-mono">${formatarMoeda(p.precoTotal)}</td>
                  <td><span class="badge badge-${p.situacao}">${rotuloSituacaoPedido(p.situacao)}</span></td>
                  <td style="color: var(--cor-texto-fraco);">${formatarDataHora(p.createdAt)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ─── Cardápio ────────────────────────────────────────────
  function renderCardapio() {
    conteudoEl.innerHTML = `
      <div class="admin-toolbar">
        <h2 style="margin:0;">Cardápio</h2>
        <button class="btn btn-primario btn-sm" id="btn-novo-item">+ Novo item</button>
      </div>
      <div class="card tabela-wrap">
        <table class="tabela-admin" id="tabela-cardapio">
          <thead><tr><th>ID</th><th>Nome</th><th>Categoria</th><th>Preço</th><th>Ativo</th><th>Ações</th></tr></thead>
          <tbody>
            ${itensMenu.map((item) => `
              <tr data-id="${item.id}">
                <td class="numero-mono">${item.id}</td>
                <td>${item.nome}</td>
                <td>${item.categoria || '—'}</td>
                <td class="numero-mono">${formatarMoeda(item.preco)}</td>
                <td>${item.ativo ? '✅' : '❌'}</td>
                <td>
                  <div class="acoes-tabela">
                    <button class="btn btn-secundario btn-sm btn-editar-item" data-id="${item.id}">Editar</button>
                    <button class="btn btn-perigo btn-sm btn-del-item" data-id="${item.id}">Remover</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    conteudoEl.querySelector('#btn-novo-item').addEventListener('click', () => abrirFormItem(null));

    conteudoEl.querySelectorAll('.btn-editar-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = itensMenu.find((i) => i.id === Number(btn.dataset.id));
        if (item) abrirFormItem(item);
      });
    });

    conteudoEl.querySelectorAll('.btn-del-item').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('Remover este item do cardápio?')) return;
        try {
          await removerItemMenu(Number(btn.dataset.id));
          itensMenu = itensMenu.filter((i) => i.id !== Number(btn.dataset.id));
          toastSucesso('Item removido.');
          renderCardapio();
        } catch (err) { toastErro(err.message); }
      });
    });
  }

  function abrirFormItem(item) {
    abrirModal({
      titulo: item ? 'Editar item' : 'Novo item',
      conteudoHtml: `
        <form id="form-item" novalidate>
          <div class="campo"><label>Nome</label><input type="text" name="nome" value="${item?.nome || ''}" required /></div>
          <div class="campo"><label>Categoria</label><input type="text" name="categoria" value="${item?.categoria || ''}" placeholder="Ex: Lanche, Bebida" /></div>
          <div class="campo"><label>Preço (R$)</label><input type="number" name="preco" value="${item?.preco || ''}" min="0" step="0.01" required /></div>
          <div class="campo"><label>Descrição</label><textarea name="descricao" rows="3">${item?.descricao || ''}</textarea></div>
          <div class="campo"><label>URL da imagem</label><input type="url" name="url_imagem" value="${item?.urlImagem || item?.url_imagem || ''}" placeholder="https://..." /></div>
          <div class="campo" style="flex-direction:row; align-items:center; gap:10px;">
            <input type="checkbox" name="ativo" id="chk-ativo" ${!item || item.ativo ? 'checked' : ''} style="width:18px; height:18px; accent-color: var(--cor-dourado);" />
            <label for="chk-ativo" style="margin:0;">Item ativo (visível no cardápio)</label>
          </div>
          <div id="item-erro"></div>
          <button type="submit" class="btn btn-primario btn-bloco" style="margin-top: var(--espaco-3);">${item ? 'Salvar alterações' : 'Criar item'}</button>
        </form>
      `,
      aoMontar: (el, fechar) => {
        el.querySelector('#form-item').addEventListener('submit', async (e) => {
          e.preventDefault();
          const dados = {
            nome: e.target.nome.value.trim(),
            categoria: e.target.categoria.value.trim(),
            preco: Number(e.target.preco.value),
            descricao: e.target.descricao.value.trim() || null,
            url_imagem: e.target.url_imagem.value.trim() || null,
            ativo: e.target.ativo.checked,
          };
          try {
            if (item) {
              const atualizado = await atualizarItemMenu(item.id, dados);
              itensMenu = itensMenu.map((i) => (i.id === item.id ? atualizado : i));
              toastSucesso('Item atualizado!');
            } else {
              const novo = await criarItemMenu(dados);
              itensMenu.push(novo);
              toastSucesso('Item criado!');
            }
            fechar();
            renderCardapio();
          } catch (err) {
            el.querySelector('#item-erro').innerHTML = `<div class="alerta alerta-erro">${err.message}</div>`;
          }
        });
      },
    });
  }

  // ─── Pedidos ─────────────────────────────────────────────
  function renderPedidos() {
    conteudoEl.innerHTML = `
      <h2 style="margin-bottom: var(--espaco-5);">Todos os pedidos</h2>
      <div class="card tabela-wrap">
        <table class="tabela-admin">
          <thead><tr><th>ID</th><th>Usuário</th><th>Itens</th><th>Total</th><th>Situação</th><th>Data</th><th>Ações</th></tr></thead>
          <tbody>
            ${pedidos.map((p) => {
              const itens = p.itens || [];
              const resumo = itens.map((i) => `${i.quantidade}× ${i.item_menu?.nome || 'Item'}`).join(', ') || '—';
              return `
                <tr>
                  <td class="numero-mono">#${p.id}</td>
                  <td>${p.usuarioId}</td>
                  <td style="font-size:0.82rem; max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${resumo}">${resumo}</td>
                  <td class="numero-mono">${formatarMoeda(p.precoTotal)}</td>
                  <td>
                    <select class="sel-situacao" data-id="${p.id}" style="background: var(--cor-superficie-alta); border: 1px solid var(--cor-borda); border-radius: var(--raio-sm); padding: 4px 8px; color: var(--cor-texto); font-size:0.8rem;">
                      ${SITUACOES_PEDIDO.map((s) => `<option value="${s}" ${s===p.situacao?'selected':''}>${rotuloSituacaoPedido(s)}</option>`).join('')}
                    </select>
                  </td>
                  <td style="color: var(--cor-texto-fraco); font-size:0.8rem;">${formatarDataHora(p.createdAt)}</td>
                  <td>
                    <button class="btn btn-secundario btn-sm btn-salvar-sit" data-id="${p.id}">Salvar</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    conteudoEl.querySelectorAll('.btn-salvar-sit').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const sel = conteudoEl.querySelector(`.sel-situacao[data-id="${btn.dataset.id}"]`);
        try {
          await atualizarPedidoAdmin(Number(btn.dataset.id), { situacao: sel.value });
          pedidos = pedidos.map((p) => p.id === Number(btn.dataset.id) ? { ...p, situacao: sel.value } : p);
          toastSucesso('Situação atualizada.');
        } catch (err) { toastErro(err.message); }
      });
    });
  }

  // ─── Roleta ──────────────────────────────────────────────
  function renderRoleta() {
    conteudoEl.innerHTML = `
      <div class="admin-toolbar">
        <h2 style="margin:0;">Prêmios da roleta</h2>
        <button class="btn btn-primario btn-sm" id="btn-novo-premio">+ Novo prêmio</button>
      </div>
      <div class="card tabela-wrap">
        <table class="tabela-admin">
          <thead><tr><th>ID</th><th>Nome</th><th>Desconto</th><th>Probabilidade</th><th>Cor</th><th>Ativo</th><th>Ações</th></tr></thead>
          <tbody>
            ${premios.map((p) => `
              <tr data-id="${p.id}">
                <td>${p.id}</td>
                <td>${p.nome || p.label}</td>
                <td class="numero-mono">${p.desconto_percentual ?? p.descontoPercentual}%</td>
                <td class="numero-mono">${p.probabilidade_vitoria ?? p.probabilidadeVitoria}</td>
                <td><span style="display:inline-block; width:20px; height:20px; border-radius:50%; background:${p.color || p.cor}; border: 1px solid var(--cor-borda-forte);"></span> ${p.color || p.cor}</td>
                <td>${p.ativo !== false ? '✅' : '❌'}</td>
                <td>
                  <div class="acoes-tabela">
                    <button class="btn btn-secundario btn-sm btn-editar-premio" data-id="${p.id}">Editar</button>
                    <button class="btn btn-perigo btn-sm btn-del-premio" data-id="${p.id}">Remover</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    conteudoEl.querySelector('#btn-novo-premio').addEventListener('click', () => abrirFormPremio(null));

    conteudoEl.querySelectorAll('.btn-editar-premio').forEach((btn) => {
      btn.addEventListener('click', () => {
        const premio = premios.find((p) => p.id === Number(btn.dataset.id));
        if (premio) abrirFormPremio(premio);
      });
    });

    conteudoEl.querySelectorAll('.btn-del-premio').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('Remover este prêmio?')) return;
        try {
          await removerPremioAdmin(Number(btn.dataset.id));
          premios = premios.filter((p) => p.id !== Number(btn.dataset.id));
          toastSucesso('Prêmio removido.');
          renderRoleta();
        } catch (err) { toastErro(err.message); }
      });
    });
  }

  function abrirFormPremio(premio) {
    abrirModal({
      titulo: premio ? 'Editar prêmio' : 'Novo prêmio',
      conteudoHtml: `
        <form id="form-premio" novalidate>
          <div class="campo"><label>Nome</label><input type="text" name="nome" value="${premio?.nome || premio?.label || ''}" required /></div>
          <div class="campo"><label>Descrição</label><input type="text" name="descricao" value="${premio?.descricao || ''}" /></div>
          <div class="campo-linha">
            <div class="campo"><label>Desconto (%)</label><input type="number" name="desconto" value="${premio?.desconto_percentual ?? premio?.descontoPercentual ?? 0}" min="0" max="100" required /></div>
            <div class="campo"><label>Probabilidade</label><input type="number" name="prob" value="${premio?.probabilidade_vitoria ?? premio?.probabilidadeVitoria ?? 10}" min="0.01" step="0.01" required /></div>
          </div>
          <div class="campo"><label>Cor (hex)</label><input type="color" name="cor" value="${premio?.color || premio?.cor || '#d4af37'}" style="height:42px; cursor:pointer;" /></div>
          <div class="campo" style="flex-direction:row; align-items:center; gap:10px;">
            <input type="checkbox" name="ativo" id="chk-prem-ativo" ${!premio || premio.ativo !== false ? 'checked' : ''} style="width:18px; height:18px; accent-color: var(--cor-dourado);" />
            <label for="chk-prem-ativo" style="margin:0;">Prêmio ativo na roleta</label>
          </div>
          <div id="premio-erro"></div>
          <button type="submit" class="btn btn-primario btn-bloco" style="margin-top: var(--espaco-3);">${premio ? 'Salvar' : 'Criar prêmio'}</button>
        </form>
      `,
      aoMontar: (el, fechar) => {
        el.querySelector('#form-premio').addEventListener('submit', async (e) => {
          e.preventDefault();
          const dados = {
            nome: e.target.nome.value.trim(),
            descricao: e.target.descricao.value.trim() || null,
            descontoPercentual: Number(e.target.desconto.value),
            probabilidadeVitoria: Number(e.target.prob.value),
            cor: e.target.cor.value,
            ativo: e.target.ativo.checked,
          };
          try {
            if (premio) {
              const atualizado = await atualizarPremioAdmin(premio.id, dados);
              premios = premios.map((p) => (p.id === premio.id ? atualizado : p));
              toastSucesso('Prêmio atualizado!');
            } else {
              const novo = await criarPremioAdmin(dados);
              premios.push(novo);
              toastSucesso('Prêmio criado!');
            }
            fechar();
            renderRoleta();
          } catch (err) {
            el.querySelector('#premio-erro').innerHTML = `<div class="alerta alerta-erro">${err.message}</div>`;
          }
        });
      },
    });
  }

  // ─── Usuários ────────────────────────────────────────────
  function renderUsuarios() {
    conteudoEl.innerHTML = `
      <h2 style="margin-bottom: var(--espaco-5);">Usuários</h2>
      <div class="card tabela-wrap">
        <table class="tabela-admin">
          <thead><tr><th>ID</th><th>Nome</th><th>E-mail</th><th>Pontos</th><th>Função</th><th>Cadastro</th></tr></thead>
          <tbody>
            ${usuarios.map((u) => `
              <tr>
                <td class="numero-mono">${u.id}</td>
                <td>${u.nome}</td>
                <td style="color: var(--cor-texto-suave);">${u.email}</td>
                <td class="numero-mono">${u.pontos}</td>
                <td><span class="badge ${u.idFuncao === 2 ? 'badge-pago' : ''}">${u.idFuncao === 2 ? 'Admin' : 'Cliente'}</span></td>
                <td style="color: var(--cor-texto-fraco); font-size:0.8rem;">${formatarDataHora(u.createdAt)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // Renderizar aba inicial
  renderDashboard();
}
