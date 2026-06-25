(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const u of s.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&n(u)}).observe(document,{childList:!0,subtree:!0});function o(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=o(r);fetch(r.href,s)}})();var ca;const oa=((ca=window.RODA_SABOR_CONFIG)==null?void 0:ca.API_BASE_URL)||"http://localhost:3333";class H extends Error{constructor(t,o,n){super(t),this.name="ApiError",this.status=o,this.dados=n}}function W(){return localStorage.getItem("roda_sabor_token")}function O(a){a?localStorage.setItem("roda_sabor_token",a):localStorage.removeItem("roda_sabor_token")}async function _(a,{method:t="GET",body:o,autenticado:n=!0,query:r}={}){const s={"Content-Type":"application/json"},u=W();n&&u&&(s.Authorization=`Bearer ${u}`);let p=`${oa}${a}`;if(r&&Object.keys(r).length){const i=new URLSearchParams(Object.entries(r).filter(([,d])=>d!=null&&d!==""));p+=`?${i.toString()}`}let c;try{c=await fetch(p,{method:t,headers:s,body:o!==void 0?JSON.stringify(o):void 0})}catch{throw new H("Não foi possível conectar à API. Verifique se o backend está rodando em "+oa,0,null)}let b=null;if((c.headers.get("content-type")||"").includes("application/json")&&(b=await c.json().catch(()=>null)),!c.ok){const i=(b==null?void 0:b.mensagem)||`Erro ${c.status} ao acessar ${a}`;throw c.status===401&&n&&O(null),new H(i,c.status,b)}return b}const $={get:(a,t)=>_(a,{...t,method:"GET"}),post:(a,t,o)=>_(a,{...o,method:"POST",body:t}),put:(a,t,o)=>_(a,{...o,method:"PUT",body:t}),delete:(a,t)=>_(a,{...t,method:"DELETE"})},la="roda_sabor_carrinho";function $a(){try{const a=localStorage.getItem(la);return a?JSON.parse(a):[]}catch{return[]}}const x={usuario:null,carregandoSessao:!0,carrinho:$a(),cupomSelecionadoId:null},J=new Set;function k(){J.forEach(a=>a(x))}function xa(a){return J.add(a),()=>J.delete(a)}function X(){return x}function q(a){x.usuario=a,x.carregandoSessao=!1,k()}function V(a){x.carregandoSessao=a,k()}function Y(){return!!W()&&!!x.usuario}function ua(){var a;return Number((a=x.usuario)==null?void 0:a.idFuncao)===2}function wa(){O(null),x.usuario=null,x.cupomSelecionadoId=null,k()}function z(){localStorage.setItem(la,JSON.stringify(x.carrinho))}function ra(){return x.carrinho}function Sa(a,t=1){const o=x.carrinho.find(n=>n.itemMenuId===a.id);o?o.quantidade+=t:x.carrinho.push({itemMenuId:a.id,nome:a.nome,preco:Number(a.preco),urlImagem:a.urlImagem||a.url_imagem||null,quantidade:t}),z(),k()}function La(a,t){const o=x.carrinho.find(n=>n.itemMenuId===a);o&&(o.quantidade+=t,o.quantidade<=0&&(x.carrinho=x.carrinho.filter(n=>n.itemMenuId!==a)),z(),k())}function Ea(a){x.carrinho=x.carrinho.filter(t=>t.itemMenuId!==a),z(),k()}function na(){x.carrinho=[],x.cupomSelecionadoId=null,z(),k()}function ia(){return x.carrinho.reduce((a,t)=>a+t.quantidade,0)}function U(){return x.carrinho.reduce((a,t)=>a+t.quantidade*t.preco,0)}function Ca(a){x.cupomSelecionadoId=a,k()}function G(){return x.cupomSelecionadoId}function Ma(){let a=document.getElementById("toast-area");return a||(a=document.createElement("div"),a.id="toast-area",a.setAttribute("aria-live","polite"),document.body.appendChild(a)),a}function ma(a,t="padrao",o=4200){const n=Ma(),r=document.createElement("div");r.className=`toast ${t==="erro"?"toast-erro":t==="sucesso"?"toast-sucesso":""}`,r.textContent=a,n.appendChild(r),setTimeout(()=>{r.style.transition="opacity 200ms ease, transform 200ms ease",r.style.opacity="0",r.style.transform="translateX(16px)",setTimeout(()=>r.remove(),220)},o)}const S=a=>ma(a,"sucesso"),M=a=>ma(a,"erro"),pa=[];let P=null,D=null;function C(a,t){const o=a.split("/").filter(Boolean);pa.push({padrao:a,partes:o,...t})}function qa(a){P=a,window.addEventListener("hashchange",Z),Z()}function N(a){if(window.location.hash.slice(1)===a){Z();return}window.location.hash=a}function ka(a){const t=a.split("/").filter(Boolean);for(const o of pa){if(o.partes.length!==t.length)continue;const n={};let r=!0;for(let s=0;s<o.partes.length;s+=1){const u=o.partes[s],p=t[s];if(u.startsWith(":"))n[u.slice(1)]=decodeURIComponent(p);else if(u!==p){r=!1;break}}if(r)return{rota:o,params:n}}return null}async function Z(){const a=(window.location.hash.slice(1)||"/").split("?")[0],t=ka(a==="/"?"/":a);if(typeof D=="function"){try{D()}catch{}D=null}if(!t){P.innerHTML=`
      <div class="container">
        <div class="estado-vazio">
          <h3>Página não encontrada</h3>
          <p>O endereço acessado não existe.</p>
          <a href="#/" class="btn btn-secundario">Voltar para o início</a>
        </div>
      </div>`;return}const{rota:o,params:n}=t;if(o.exigeAuth&&!Y()){if(X().carregandoSessao)return;M("Faça login para continuar."),N("/login");return}if(o.exigeAdmin&&!ua()){M("Acesso restrito a administradores."),N("/");return}P.innerHTML='<div class="carregando-bloco"><div class="spinner"></div></div>',window.scrollTo({top:0,behavior:"instant"in window?"instant":"auto"});try{const r=await o.render(P,n);typeof r=="function"&&(D=r)}catch(r){console.error(r),P.innerHTML=`
      <div class="container">
        <div class="estado-vazio">
          <h3>Algo deu errado</h3>
          <p>${(r==null?void 0:r.message)||"Não foi possível carregar esta página."}</p>
        </div>
      </div>`}}function Aa(){return(window.location.hash.slice(1)||"/").split("?")[0]}function E(a){return Number(a||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}function va(a){return a?new Date(a).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"}):"—"}function I(a){return a?new Date(a).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}):"—"}function ba(a){var r;if(!a)return"?";const t=a.trim().split(/\s+/),o=((r=t[0])==null?void 0:r[0])||"",n=t.length>1?t[t.length-1][0]:"";return(o+n).toUpperCase()}function Q(a){return{pendente:"Pendente",pago:"Pago",preparando:"Preparando",entregue:"Entregue",cancelado:"Cancelado"}[a]||a}function Ta(a){return a?`•••• •••• •••• ${String(a).replace(/\s+/g,"").slice(-4)}`:""}const Na=`
<svg class="marca-roda" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="16" r="14" stroke="#d4af37" stroke-width="2"/>
  <circle cx="16" cy="16" r="2.4" fill="#d4af37"/>
  <path d="M16 2V12M16 20V30M30 16H20M12 16H2M25.9 6.1L18.8 13.2M13.2 18.8L6.1 25.9M25.9 25.9L18.8 18.8M13.2 13.2L6.1 6.1" stroke="#d4af37" stroke-width="1.4" stroke-linecap="round"/>
</svg>`,Pa='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',Ia='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';function Ha(){return[{caminho:"/menu",rotulo:"Cardápio"},{caminho:"/pedidos",rotulo:"Meus Pedidos"},{caminho:"/roleta",rotulo:"Roleta"}]}function Ra(a){function t(){var d,h,m;const o=X(),n=Y(),r=Aa(),s=ua(),u=n?Ha().map(e=>`
          <a href="#${e.caminho}" class="nav-link ${r.startsWith(e.caminho)?"ativo":""}">${e.rotulo}</a>
        `).join(""):"",p=s?`<a href="#/admin" class="nav-link ${r.startsWith("/admin")?"ativo":""}">Admin</a>`:"";a.innerHTML=`
      <header class="cabecalho">
        <div class="cabecalho-inner container" style="padding-left:0; padding-right:0;">
          <a href="#/" class="marca">
            ${Na}
            Roda <span class="destaque">&amp; Sabor</span>
          </a>

          <button class="nav-mobile-toggle" id="btn-menu-mobile" aria-label="Abrir menu" aria-expanded="false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>

          <nav class="nav-principal-links nav-principal" id="nav-links">
            ${u}
            ${p}
          </nav>

          <div class="nav-principal">
            ${n?`
              <a href="#/menu" class="nav-pontos" title="Seus pontos acumulados">
                ★ ${((d=o.usuario)==null?void 0:d.pontos)??0} pts
              </a>
              <a href="#/carrinho" class="btn btn-fantasma btn-sm" style="position:relative;" title="Carrinho">
                ${Pa}
                ${ia()>0?`<span style="position:absolute; top:-2px; right:-2px; background:var(--cor-dourado); color:#1a1408; font-size:0.62rem; font-weight:800; border-radius:999px; min-width:16px; height:16px; display:flex; align-items:center; justify-content:center; padding:0 3px;">${ia()}</span>`:""}
              </a>
              <div class="nav-usuario-menu" id="nav-usuario-menu">
                <button class="nav-usuario-btn" id="btn-usuario">
                  <span class="avatar-iniciais">${ba((h=o.usuario)==null?void 0:h.nome)}</span>
                  ${Ia}
                </button>
                <div class="nav-dropdown" id="nav-dropdown">
                  <a href="#/perfil">Meu perfil</a>
                  <a href="#/pedidos">Meus pedidos</a>
                  <button id="btn-sair" type="button">Sair</button>
                </div>
              </div>
            `:`
              <a href="#/login" class="btn btn-fantasma btn-sm">Entrar</a>
              <a href="#/cadastro" class="btn btn-primario btn-sm">Criar conta</a>
            `}
          </div>
        </div>
      </header>
    `;const c=a.querySelector("#btn-menu-mobile"),b=a.querySelector("#nav-links");c==null||c.addEventListener("click",()=>{const e=b.classList.toggle("aberto");c.setAttribute("aria-expanded",String(e))});const w=a.querySelector("#btn-usuario"),i=a.querySelector("#nav-dropdown");w==null||w.addEventListener("click",e=>{e.stopPropagation(),i.classList.toggle("aberto")}),(m=a.querySelector("#btn-sair"))==null||m.addEventListener("click",()=>{wa(),S("Você saiu da sua conta."),N("/login")}),document.addEventListener("click",e=>{i&&!i.contains(e.target)&&!(w!=null&&w.contains(e.target))&&i.classList.remove("aberto")})}t(),xa(t),window.addEventListener("hashchange",t)}function _a(a){const t=new Date().getFullYear();a.innerHTML=`
    <footer class="rodape">
      <div class="container">
        <p style="margin:0;">Roda &amp; Sabor — © ${t}. Sabor de verdade, sorte de bônus.</p>
      </div>
    </footer>
  `}async function Da({nome:a,email:t,senha:o,cpf:n,telefone:r}){const s=await $.post("/api/auth/cadastro",{nome:a,email:t,senha:o,cpf:n,telefone:r},{autenticado:!1});return O(s.token),s.usuario}async function Fa({email:a,senha:t}){const o=await $.post("/api/auth/login",{email:a,senha:t},{autenticado:!1});return O(o.token),o.usuario}async function j(){return(await $.get("/api/auth/me")).usuario}async function Oa(a){return(await $.put("/api/auth/me",a)).usuario}async function za({senha_atual:a,nova_senha:t}){return $.put("/api/auth/me/senha",{senha_atual:a,nova_senha:t})}const sa=["#2a2218","#1c1814","#8a7a4f","#d4af37","#b8960c","#c9a227","#4a7c59","#f2d680","#e8c547","#ff9d00"];function K(a,t,o,n){const r=(n-90)*Math.PI/180;return{x:a+o*Math.cos(r),y:t+o*Math.sin(r)}}function ja(a,t,o,n,r){const s=K(a,t,o,r),u=K(a,t,o,n),p=r-n<=180?"0":"1";return`
    M${a} ${t}
    L${s.x.toFixed(2)} ${s.y.toFixed(2)}
    A${o} ${o} 0 ${p} 0 ${u.x.toFixed(2)} ${u.y.toFixed(2)}
    Z
  `}function Ba(a){const t=(a||"").replace("#","");if(t.length<6)return 0;const o=parseInt(t.slice(0,2),16),n=parseInt(t.slice(2,4),16),r=parseInt(t.slice(4,6),16);return(.299*o+.587*n+.114*r)/255}function Va(a){return String(a||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Ua(a){return a?a.replace("Desconto de ","").replace("Desconto ","").replace("% de desconto","% OFF").replace("% desconto","% OFF").replace("Não foi dessa vez","Sem Prêmio").replace("Tente outra vez","Tente Nov.").trim():""}function ha(a){const s=a.map(i=>Math.max(Number(i.probabilidade_vitoria??i.probabilidadeVitoria)||0,.001)),u=s.reduce((i,d)=>i+d,0);let p=0,c="";const b=[];return a.forEach((i,d)=>{const h=s[d]/u*360,m=p,e=p+h,v=m+h/2,y=i.cor||i.color||sa[d%sa.length];b.push({...i,anguloInicial:m,anguloFinal:e,anguloMeio:v});const g=Ba(y)>.55?"#15130f":"#f5efe0",l=K(200,200,195*.72,v);let f=Ua(i.label||i.nome||"");f.length>10&&(f=f.substring(0,10)+"...");let L=12;h<40&&(L=10),h<25&&(L=8),h<15&&(L=7);let A=v+90;A>180&&(A+=180),c+=`
      <path
        d="${ja(200,200,195,m,e)}"
        fill="${y}"
        stroke="#0b0a08"
        stroke-width="1.2"
      />

      <text
        x="${l.x.toFixed(2)}"
        y="${l.y.toFixed(2)}"
        fill="${g}"
        font-size="${L}"
        font-weight="700"
        font-family="Inter,sans-serif"
        text-anchor="middle"
        dominant-baseline="middle"
        transform="rotate(
          ${A},
          ${l.x.toFixed(2)},
          ${l.y.toFixed(2)}
        )"
      >
        ${Va(f)}
      </text>
    `,p=e}),{svg:`
    <svg
      class="roleta-disco"
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Roleta de prêmios"
    >

      <circle
        cx="200"
        cy="200"
        r="195"
        fill="#151310"
      />

      ${c}

      <circle
        cx="200"
        cy="200"
        r="195"
        fill="none"
        stroke="#34291a"
        stroke-width="1"
      />

    </svg>
  `,fatiasInfo:b}}function Ga(a,t,o){var b;const n=t?a.find(w=>w.id===t):null,r=n?n.anguloMeio:((b=a[0])==null?void 0:b.anguloMeio)||0,s=5+Math.floor(Math.random()*2),u=o%360,c=((360-r+360)%360-u+360)%360;return o+s*360+c}const Ja=[{nome:"5% OFF",probabilidade_vitoria:30,cor:"#1c1814"},{nome:"10% OFF",probabilidade_vitoria:25,cor:"#d4af37"},{nome:"Quase lá",probabilidade_vitoria:20,cor:"#151310"},{nome:"15% OFF",probabilidade_vitoria:15,cor:"#8a7a4f"},{nome:"20% OFF",probabilidade_vitoria:10,cor:"#f2d680"}];function Za(a){const t=Y(),{svg:o}=ha(Ja);a.innerHTML=`
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
              ${t?`
                <a href="#/menu" class="btn btn-primario">Ver cardápio</a>
                <a href="#/roleta" class="btn btn-secundario">Girar a roleta</a>
              `:`
                <a href="#/cadastro" class="btn btn-primario">Criar conta grátis</a>
                <a href="#/login" class="btn btn-secundario">Já tenho conta</a>
              `}
            </div>
          </div>
          <div class="hero-roleta-mini">
            <div class="roleta-svg-wrap" style="width:min(320px, 80vw);">
              ${o}
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
  `}function Qa(a){a.innerHTML=`
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
  `;const t=a.querySelector("#form-login"),o=a.querySelector("#area-erro"),n=a.querySelector("#btn-entrar");t.addEventListener("submit",async r=>{r.preventDefault(),o.innerHTML="";const s=t.email.value.trim(),u=t.senha.value;n.disabled=!0,n.textContent="Entrando...";try{const p=await Fa({email:s,senha:u});q(p),S(`Bem-vindo, ${p.nome.split(" ")[0]}!`),N("/menu")}catch(p){const c=p instanceof H?p.message:"Não foi possível entrar. Tente novamente.";o.innerHTML=`<div class="alerta alerta-erro">${c}</div>`}finally{n.disabled=!1,n.textContent="Entrar"}})}function Ka(a){a.innerHTML=`
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
  `;const t=a.querySelector("#form-cadastro"),o=a.querySelector("#area-erro"),n=a.querySelector("#btn-criar");t.addEventListener("submit",async r=>{r.preventDefault(),o.innerHTML="";const s={nome:t.nome.value.trim(),email:t.email.value.trim(),senha:t.senha.value,cpf:t.cpf.value.trim()||null,telefone:t.telefone.value.trim()||null};n.disabled=!0,n.textContent="Criando conta...";try{const u=await Da(s);q(u),S(`Conta criada com sucesso, ${u.nome.split(" ")[0]}!`),N("/menu")}catch(u){const p=u instanceof H?u.message:"Não foi possível criar a conta. Tente novamente.";o.innerHTML=`<div class="alerta alerta-erro">${p}</div>`}finally{n.disabled=!1,n.textContent="Criar conta"}})}async function fa(){return await $.get("/api/menu",{autenticado:!1})}async function Wa(a){return $.post("/api/menu",a)}async function Xa(a,t){return $.put(`/api/menu/${a}`,t)}async function Ya(a){return $.delete(`/api/menu/${a}`)}const ae='<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';async function ee(a){a.innerHTML=`
    <main>
      <div class="container">
        <div class="menu-cabecalho">
          <span class="eyebrow">Cardápio</span>
          <h1>O que vai pedir hoje?</h1>
        </div>
        <div id="menu-filtros" class="menu-filtros"></div>
        <div id="grade-menu" class="grade-menu"></div>
      </div>
    </main>
  `;const t=a.querySelector("#grade-menu"),o=a.querySelector("#menu-filtros");let n=[],r="Todos";try{n=await fa(),n=n.filter(c=>c.ativo!==!1)}catch(c){t.innerHTML=`<div class="alerta alerta-erro">${c.message}</div>`;return}if(!n.length){t.innerHTML='<div class="estado-vazio"><h3>Cardápio vazio</h3><p>Nenhum item disponível no momento.</p></div>';return}const s=["Todos",...new Set(n.map(c=>c.categoria).filter(Boolean))];function u(){o.innerHTML=s.map(c=>`
      <button class="filtro-chip ${c===r?"ativo":""}" data-cat="${c}">${c}</button>
    `).join(""),o.querySelectorAll(".filtro-chip").forEach(c=>{c.addEventListener("click",()=>{r=c.dataset.cat,u(),p()})})}function p(){const c=r==="Todos"?n:n.filter(b=>b.categoria===r);if(!c.length){t.innerHTML='<div class="estado-vazio" style="grid-column:1/-1;"><h3>Nenhum item nesta categoria</h3></div>';return}t.innerHTML=c.map(b=>`
      <article class="item-menu-card" data-id="${b.id}">
        <div class="item-menu-imagem">
          ${b.urlImagem||b.url_imagem?`<img src="${b.urlImagem||b.url_imagem}" alt="${b.nome}" loading="lazy" />`:ae}
        </div>
        <div class="item-menu-corpo">
          <span class="item-menu-categoria">${b.categoria||"Prato"}</span>
          <h3 class="item-menu-nome">${b.nome}</h3>
          <p class="item-menu-desc">${b.descricao||""}</p>
          <div class="item-menu-rodape">
            <span class="item-menu-preco numero-mono">${E(b.preco)}</span>
            <button class="btn btn-primario btn-sm btn-adicionar" data-id="${b.id}">+ Carrinho</button>
          </div>
        </div>
      </article>
    `).join(""),t.querySelectorAll(".btn-adicionar").forEach(b=>{b.addEventListener("click",w=>{w.stopPropagation();const i=Number(b.dataset.id),d=n.find(h=>h.id===i);d&&(Sa(d),S(`${d.nome} adicionado ao carrinho.`))})})}u(),p()}async function te(){return $.get("/api/roleta/premios",{autenticado:!1})}async function oe(){return $.post("/api/roleta/girar")}async function ga(){return $.get("/api/roleta/cupons")}async function re(){return $.get("/api/roleta/premios/admin/todos")}async function ne(a){return $.post("/api/roleta/premios/admin",a)}async function ie(a,t){return $.put(`/api/roleta/premios/admin/${a}`,t)}async function se(a){return $.delete(`/api/roleta/premios/admin/${a}`)}async function de(){return $.get("/api/pedidos")}async function ce({itens:a,cupomId:t}){return $.post("/api/pedidos",{itens:a,cupomId:t})}async function le(){return $.get("/api/pedidos/admin/todos")}async function ue(a,t){return $.put(`/api/pedidos/admin/${a}`,t)}async function me(a){let t=[],o=!0;try{t=await ga(),t=t.filter(s=>!s.resgatado),o=!1}catch{o=!1}function n(s){const u=G();if(!u)return 0;const p=t.find(c=>c.id===Number(u));return p?Number((s*Number(p.descontoPercentual)/100).toFixed(2)):0}function r(){var h;const s=ra(),u=s.length===0,p=U(),c=n(p),b=p-c,w=G();a.innerHTML=`
      <main>
        <div class="container" style="padding-top: var(--espaco-7);">
          <div style="margin-bottom: var(--espaco-5);">
            <span class="eyebrow">Revisão</span>
            <h1>Seu carrinho</h1>
          </div>

          ${u?`
            <div class="estado-vazio card">
              <h3>Carrinho vazio</h3>
              <p>Adicione itens do cardápio para começar seu pedido.</p>
              <a href="#/menu" class="btn btn-primario" style="margin-top: var(--espaco-4);">Ver cardápio</a>
            </div>
          `:`
            <div class="layout-com-carrinho">
              <div>
                <div class="card card-destacado" style="margin-bottom: var(--espaco-4);">
                  <h3 style="margin-bottom: var(--espaco-4);">Itens do pedido</h3>
                  <div id="lista-carrinho">
                    ${s.map(m=>`
                      <div class="carrinho-item" data-id="${m.itemMenuId}">
                        <div class="carrinho-item-info">
                          <p class="carrinho-item-nome">${m.nome}</p>
                          <p class="carrinho-item-preco">${E(m.preco)} × ${m.quantidade} = ${E(m.preco*m.quantidade)}</p>
                        </div>
                        <div class="qtd-control">
                          <button class="btn-qtd" data-id="${m.itemMenuId}" data-delta="-1" aria-label="Diminuir">−</button>
                          <span>${m.quantidade}</span>
                          <button class="btn-qtd" data-id="${m.itemMenuId}" data-delta="1" aria-label="Aumentar">+</button>
                        </div>
                        <button class="btn btn-perigo btn-sm btn-remover" data-id="${m.itemMenuId}" title="Remover item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                        </button>
                      </div>
                    `).join("")}
                  </div>
                </div>

                <div class="card" style="margin-bottom: var(--espaco-4);">
                  <h3 style="margin-bottom: var(--espaco-3);">Cupom de desconto</h3>
                  ${t.length===0?`
                    <p style="color: var(--cor-texto-fraco); font-size: 0.88rem;">
                      Você não tem cupons disponíveis. Acumule pontos e gire a roleta!
                    </p>
                  `:`
                    <select id="sel-cupom" style="width:100%; background: var(--cor-superficie-alta); border: 1px solid var(--cor-borda); border-radius: var(--raio-sm); padding: 11px 14px; color: var(--cor-texto);">
                      <option value="">Sem cupom</option>
                      ${t.map(m=>`
                        <option value="${m.id}" ${String(m.id)===String(w)?"selected":""}>
                          ${m.codigo} — ${m.descontoPercentual}% OFF (expira ${va(m.expiraEm)})
                        </option>
                      `).join("")}
                    </select>
                  `}
                </div>

                <div class="card" id="card-pagamento">
                  <h3 style="margin-bottom: var(--espaco-3);">Forma de pagamento</h3>
                  <div id="opcoes-pagamento" style="display:flex; gap: var(--espaco-3); flex-wrap:wrap; margin-bottom: var(--espaco-4);">
                    ${["pix","dinheiro","cartao_credito"].map(m=>`
                      <label style="display:flex; align-items:center; gap:8px; cursor:pointer; padding: 10px 14px; border: 1px solid var(--cor-borda); border-radius: var(--raio-sm); flex:1; min-width:120px;" data-metodo="${m}">
                        <input type="radio" name="metodo-pag" value="${m}" style="accent-color: var(--cor-dourado);" ${m==="pix"?"checked":""} />
                        <span style="font-size:0.9rem; font-weight:600;">${m==="pix"?"PIX":m==="dinheiro"?"Dinheiro":"Cartão de crédito"}</span>
                      </label>
                    `).join("")}
                  </div>
                  <div id="area-erro-pedido"></div>
                  <button id="btn-confirmar" class="btn btn-primario btn-bloco" style="margin-top: var(--espaco-3);">
                    Confirmar pedido — ${E(b)}
                  </button>
                </div>
              </div>

              <aside class="carrinho-painel">
                <div class="card card-destacado">
                  <h3 style="margin-bottom: var(--espaco-4);">Resumo</h3>
                  <div class="resumo-linha">
                    <span>Subtotal</span><span class="valor">${E(p)}</span>
                  </div>
                  ${c>0?`
                    <div class="resumo-linha desconto">
                      <span>Desconto</span><span class="valor">−${E(c)}</span>
                    </div>
                  `:""}
                  <div class="resumo-linha total">
                    <span>Total</span><span class="valor">${E(b)}</span>
                  </div>
                  <p style="font-size:0.78rem; color: var(--cor-texto-fraco); margin-top: var(--espaco-3);">
                    ★ Você vai ganhar aproximadamente <strong style="color: var(--cor-dourado-claro);">${Math.floor(b)} pontos</strong> neste pedido.
                  </p>
                </div>
                <button class="btn btn-fantasma btn-sm" id="btn-limpar" style="align-self:flex-end;">Limpar carrinho</button>
              </aside>
            </div>
          `}
        </div>
      </main>
    `,a.querySelectorAll(".btn-qtd").forEach(m=>{m.addEventListener("click",()=>{La(Number(m.dataset.id),Number(m.dataset.delta)),r()})}),a.querySelectorAll(".btn-remover").forEach(m=>{m.addEventListener("click",()=>{Ea(Number(m.dataset.id)),r()})}),(h=a.querySelector("#btn-limpar"))==null||h.addEventListener("click",()=>{na(),r()});const i=a.querySelector("#sel-cupom");i==null||i.addEventListener("change",()=>{Ca(i.value?Number(i.value):null),r()});const d=a.querySelector("#btn-confirmar");d==null||d.addEventListener("click",async()=>{const m=a.querySelector('input[name="metodo-pag"]:checked');m!=null&&m.value;const e=a.querySelector("#area-erro-pedido");e.innerHTML="",d.disabled=!0,d.textContent="Confirmando...";try{const v=ra().map(l=>({itemMenuId:l.itemMenuId,quantidade:l.quantidade})),y=G()||null,g=await ce({itens:v,cupomId:y});if(g.usuario)q(g.usuario);else try{const l=await j();q(l)}catch{}na(),S(g.message||"Pedido realizado com sucesso!"),N("/pedidos")}catch(v){const y=v instanceof H?v.message:"Não foi possível finalizar o pedido.";e.innerHTML=`<div class="alerta alerta-erro">${y}</div>`,d.disabled=!1,d.textContent=`Confirmar pedido — ${E(U()-n(U()))}`}})}r()}function pe(a){return`<span class="badge badge-${a}">${Q(a)}</span>`}async function ve(a){a.innerHTML=`
    <main>
      <div class="container" style="padding-top: var(--espaco-7); padding-bottom: var(--espaco-8);">
        <div style="margin-bottom: var(--espaco-5);">
          <span class="eyebrow">Histórico</span>
          <h1>Meus pedidos</h1>
        </div>
        <div id="area-pedidos">
          <div class="carregando-bloco"><div class="spinner"></div></div>
        </div>
      </div>
    </main>
  `;const t=a.querySelector("#area-pedidos");let o=[];try{o=await de()}catch(n){t.innerHTML=`<div class="alerta alerta-erro">${n.message}</div>`;return}if(!o.length){t.innerHTML=`
      <div class="estado-vazio card">
        <h3>Nenhum pedido ainda</h3>
        <p>Seu histórico de pedidos aparece aqui.</p>
        <a href="#/menu" class="btn btn-primario" style="margin-top: var(--espaco-4);">Fazer meu primeiro pedido</a>
      </div>`;return}t.innerHTML=`<div class="lista-pedidos">${o.map(n=>{const r=n.itens||[];return`
      <div class="card pedido-card card-destacado">
        <div class="pedido-cabecalho">
          <div>
            <h3 style="margin-bottom: 4px;">Pedido #${n.id}</h3>
            <span style="font-size:0.82rem; color: var(--cor-texto-fraco);">${I(n.createdAt||n.created_at)}</span>
          </div>
          ${pe(n.situacao)}
        </div>

        ${r.length?`
          <ul class="pedido-itens-lista">
            ${r.map(s=>{var p,c;const u=((p=s.item_menu)==null?void 0:p.nome)||((c=s.itemMenu)==null?void 0:c.nome)||`Item #${s.itemMenuId}`;return`<li>${s.quantidade}× ${u} — ${E(s.subtotal)}</li>`}).join("")}
          </ul>
        `:""}

        <hr class="divisor" style="margin: var(--espaco-3) 0;">

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap: var(--espaco-3);">
          <div style="font-size:0.86rem; color: var(--cor-texto-suave);">
            ${Number(n.valorDesconto)>0?`
              <span>Subtotal: ${E(n.valorBruto)}</span>
              &nbsp;·&nbsp;
              <span style="color: var(--cor-sucesso);">Desconto: −${E(n.valorDesconto)}</span>
              &nbsp;·&nbsp;
            `:""}
            <strong style="color: var(--cor-texto);">Total: ${E(n.precoTotal)}</strong>
          </div>
          <div style="display:flex; align-items:center; gap: var(--espaco-2);">
            <span style="font-size:0.82rem; color: var(--cor-dourado-opaco);">★ +${n.pontosGerados} pontos</span>
          </div>
        </div>
      </div>
    `}).join("")}</div>`}const da=["#2a2218","#1c1814","#8a7a4f","#d4af37","#b8960c","#c9a227","#4a7c59","#f2d680","#e8c547","#ff9d00"];async function be(a){var g;a.innerHTML=`
    <main>
      <div class="container">
        <div class="tela-roleta">
          <span class="eyebrow">Sorte premiada</span>
          <h1>Roleta Roda &amp; Sabor</h1>
          <p style="max-width:480px;margin:0 auto var(--espaco-3);color:var(--cor-texto-suave);">
            Troque <strong style="color:var(--cor-dourado-claro)">100 pontos</strong> por um giro.
            Chances reais de ganhar de 5% a 50% de desconto — ou perder e tentar de novo!
          </p>
          <div id="area-roleta"><div class="carregando-bloco"><div class="spinner"></div></div></div>
          <div id="area-resultado" style="margin-top:var(--espaco-5);"></div>
          <div id="area-tabela-chances" style="margin-top:var(--espaco-6);text-align:left;"></div>
          <div id="area-cupons" style="margin-top:var(--espaco-6);text-align:left;"></div>
        </div>
      </div>
    </main>`;const t=a.querySelector("#area-roleta"),o=a.querySelector("#area-resultado"),n=a.querySelector("#area-cupons"),r=a.querySelector("#area-tabela-chances");let s=[],u=[],p=0,c=!1;try{s=await te()}catch(l){t.innerHTML=`<div class="alerta alerta-erro">${l.message}</div>`;return}if(!s.length){t.innerHTML='<div class="estado-vazio"><h3>Roleta sem prêmios</h3></div>';return}s.forEach((l,f)=>{l.cor=l.color||l.cor||da[f%da.length]});const{svg:b,fatiasInfo:w}=ha(s);u=w;const d=((g=X().usuario)==null?void 0:g.pontos)??0;t.innerHTML=`
    <div class="roleta-palco">
      <svg class="roleta-ponteiro" viewBox="0 0 28 36" width="26" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 36 L2 10 Q0 4 6 2 L14 0 L22 2 Q28 4 26 10 Z" fill="#d4af37" stroke="#0b0a08" stroke-width="1.5"/>
        <circle cx="14" cy="10" r="4" fill="#1a1408"/>
      </svg>
      <div class="roleta-svg-wrap" id="roleta-wrap">${b}</div>
      <button class="roleta-centro-btn" id="btn-girar" ${d<100?"disabled":""}>GIRAR</button>
    </div>
    <div class="roleta-custo">
      <span>★ Custo: <strong style="color:var(--cor-dourado-claro)">100 pts</strong></span>
      <span style="margin-left:14px;">Seus pontos: <strong id="exibir-pontos" style="color:var(--cor-dourado-claro)">${d}</strong></span>
    </div>
    ${d<100?`<div class="alerta alerta-info" style="max-width:420px;margin:var(--espaco-3) auto 0;">
      Você precisa de 100 pontos para girar. Faça pedidos para acumular!
    </div>`:""}
  `;const h=s.reduce((l,f)=>l+Number(f.probabilidade_vitoria||0),0);r.innerHTML=`
    <div class="card" style="max-width:560px;margin:0 auto;">
      <h3 style="margin-bottom:var(--espaco-4);">Chances de cada prêmio</h3>
      <div class="tabela-wrap">
        <table class="tabela-admin">
          <thead><tr><th>Cor</th><th>Prêmio</th><th>Probabilidade</th></tr></thead>
          <tbody>
            ${s.map(l=>{const f=h>0?(Number(l.probabilidade_vitoria)/h*100).toFixed(1):0,L=Number(l.desconto_percentual||0)===0&&!String(l.nome).toLowerCase().includes("frete");return`
                <tr>
                  <td><span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:${l.cor};border:1px solid var(--cor-borda-forte);"></span></td>
                  <td style="font-weight:600;color:${L?"var(--cor-texto-fraco)":"var(--cor-texto)"};">${l.nome||l.label}</td>
                  <td class="numero-mono" style="color:${L?"var(--cor-erro)":"var(--cor-dourado-claro)"};">${f}%</td>
                </tr>`}).join("")}
          </tbody>
        </table>
      </div>
      <p style="font-size:0.76rem;color:var(--cor-texto-fraco);margin-top:var(--espaco-3);margin-bottom:0;">
        Chance de perder (sem prêmio): <strong style="color:var(--cor-erro);">
          ${(s.filter(l=>!Number(l.desconto_percentual)).reduce((l,f)=>l+Number(f.probabilidade_vitoria||0),0)/h*100).toFixed(1)}%
        </strong>
        &nbsp;·&nbsp; Chance de ganhar qualquer desconto: <strong style="color:var(--cor-sucesso);">
          ${(s.filter(l=>Number(l.desconto_percentual)>0).reduce((l,f)=>l+Number(f.probabilidade_vitoria||0),0)/h*100).toFixed(1)}%
        </strong>
      </p>
    </div>`;const m=t.querySelector(".roleta-disco"),e=t.querySelector("#btn-girar"),v=t.querySelector("#exibir-pontos");e==null||e.addEventListener("click",async()=>{var A;if(c)return;c=!0,e.disabled=!0,e.textContent="...",o.innerHTML="";let l=null;try{l=await oe()}catch(R){M(R.message||"Erro ao girar."),c=!1,e.disabled=!1,e.textContent="GIRAR";return}const f=((A=l.premio)==null?void 0:A.id)??null,L=Ga(u,f,p);p=L,m.style.transform=`rotate(${L}deg)`,setTimeout(async()=>{var aa,ea,ta;c=!1;try{const T=l.usuario||await j();q(T);const B=T.pontos??0;v&&(v.textContent=B),e.disabled=B<100,e.textContent=B>=100?"GIRAR":"SEM PONTOS"}catch{}const R=((aa=l.premio)==null?void 0:aa.label)||((ea=l.premio)==null?void 0:ea.nome)||"",ya=!l.cupom&&(!l.premio||Number(l.premio.desconto_percentual||0)===0);if(l.cupom){const T=Number(((ta=l.premio)==null?void 0:ta.desconto_percentual)||0)>=50;o.innerHTML=`
          <div class="alerta alerta-sucesso" style="max-width:460px;margin:0 auto;text-align:center;padding:var(--espaco-5);">
            <div style="font-size:${T?"2.4rem":"1.8rem"};margin-bottom:var(--espaco-2);">${T?"🎰🎉🎰":"🎉"}</div>
            <h3 style="color:var(--cor-sucesso);margin-bottom:var(--espaco-2);">
              ${T?"JACKPOT! ":""}Você ganhou ${R}!
            </h3>
            <p style="margin-bottom:var(--espaco-3);">${l.message}</p>
            <div style="font-family:var(--fonte-mono);font-size:1.15rem;font-weight:800;color:var(--cor-dourado-claro);letter-spacing:0.05em;padding:var(--espaco-3);border:1px dashed var(--cor-dourado-opaco);border-radius:var(--raio-md);background:var(--cor-dourado-fundo);">
              ${l.cupom.codigo}
            </div>
            <p style="font-size:0.78rem;margin-top:var(--espaco-3);margin-bottom:0;color:var(--cor-texto-fraco);">
              Use este cupom no carrinho. Válido por 30 dias.
            </p>
            <a href="#/carrinho" class="btn btn-primario btn-sm" style="margin-top:var(--espaco-4);display:inline-flex;">Usar no carrinho</a>
          </div>`}else ya?o.innerHTML=`
          <div style="max-width:460px;margin:0 auto;text-align:center;">
            <div style="font-size:2.2rem;margin-bottom:var(--espaco-2);">😅</div>
            <h3 style="color:var(--cor-texto-suave);margin-bottom:var(--espaco-2);">${R||"Não foi dessa vez!"}</h3>
            <p style="color:var(--cor-texto-fraco);">${l.message}</p>
            <a href="#/menu" class="btn btn-secundario btn-sm" style="margin-top:var(--espaco-3);display:inline-flex;">Fazer pedido e ganhar pontos</a>
          </div>`:o.innerHTML=`
          <div class="alerta alerta-info" style="max-width:460px;margin:0 auto;text-align:center;">
            <p style="margin:0;">${l.message}</p>
          </div>`;y()},4400)});async function y(){try{const l=await ga();if(!l.length){n.innerHTML="";return}n.innerHTML=`
        <h2 style="margin-bottom:var(--espaco-4);">Meus cupons</h2>
        <div class="cupons-grade">
          ${l.map(f=>`
            <div class="cupom-card ${f.resgatado?"usado":""}">
              <div class="cupom-codigo">${f.codigo}</div>
              <div style="margin:var(--espaco-2) 0;font-size:1.05rem;font-weight:700;color:var(--cor-dourado-claro);">
                ${Number(f.descontoPercentual)>0?f.descontoPercentual+"% de desconto":"Prêmio especial"}
              </div>
              <div style="font-size:0.76rem;color:var(--cor-texto-fraco);">
                ${f.resgatado?'<span style="color:var(--cor-texto-fraco);">✓ Utilizado</span>':`Expira em ${va(f.expiraEm)}`}
              </div>
              ${f.resgatado?"":'<a href="#/carrinho" class="btn btn-secundario btn-sm" style="margin-top:var(--espaco-3);">Usar no carrinho</a>'}
            </div>`).join("")}
        </div>`}catch{}}y()}async function he(){return $.get("/api/enderecos")}async function fe(a){return $.post("/api/enderecos",a)}async function ge(a){return $.delete(`/api/enderecos/${a}`)}async function ye(){return $.get("/api/cartoes")}async function $e(a){return $.post("/api/cartoes",a)}async function xe(a){return $.delete(`/api/cartoes/${a}`)}async function we(){return $.get("/api/pontos/extrato")}function F({titulo:a,conteudoHtml:t,aoMontar:o,aoFechar:n}){const r=document.createElement("div");r.className="modal-fundo",r.innerHTML=`
    <div class="modal-caixa" role="dialog" aria-modal="true" aria-label="${a||""}">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:16px;">
        <h3 style="margin:0;">${a||""}</h3>
        <button id="modal-fechar" class="btn-fantasma btn-sm" aria-label="Fechar" style="padding:6px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div id="modal-conteudo"></div>
    </div>
  `,document.body.appendChild(r),document.body.classList.add("scroll-trava");const s=r.querySelector("#modal-conteudo");typeof t=="string"?s.innerHTML=t:t instanceof HTMLElement&&s.appendChild(t);function u(){r.remove(),document.body.classList.remove("scroll-trava"),document.removeEventListener("keydown",p),typeof n=="function"&&n()}function p(c){c.key==="Escape"&&u()}return r.querySelector("#modal-fechar").addEventListener("click",u),r.addEventListener("click",c=>{c.target===r&&u()}),document.addEventListener("keydown",p),typeof o=="function"&&o(s,u),u}async function Se(a){a.innerHTML=`
    <main>
      <div class="container" style="padding-top: var(--espaco-7); padding-bottom: var(--espaco-8);">
        <span class="eyebrow">Conta</span>
        <h1 style="margin-bottom: var(--espaco-6);">Meu perfil</h1>
        <div id="area-conteudo">
          <div class="carregando-bloco"><div class="spinner"></div></div>
        </div>
      </div>
    </main>
  `;const t=a.querySelector("#area-conteudo");let o,n=[],r=[],s=[];try{[o,n,r,s]=await Promise.all([j(),he().catch(()=>[]),ye().catch(()=>[]),we().catch(()=>[])]),q(o)}catch(p){t.innerHTML=`<div class="alerta alerta-erro">${p.message}</div>`;return}function u(){var p,c,b,w;t.innerHTML=`
      <div class="grade-perfil">
        <!-- Coluna lateral -->
        <aside>
          <div class="card card-destacado perfil-cartao-resumo" style="margin-bottom: var(--espaco-4);">
            <div class="perfil-avatar-grande">${ba(o.nome)}</div>
            <h3 style="margin-bottom: 4px;">${o.nome}</h3>
            <p style="font-size:0.84rem; margin-bottom: var(--espaco-3);">${o.email}</p>
            <div style="display:inline-flex; align-items:center; gap:8px; background: var(--cor-dourado-fundo); border: 1px solid rgba(212,175,55,0.3); border-radius: 999px; padding: 8px 16px;">
              <span style="font-size:1.1rem;">★</span>
              <span style="font-family: var(--fonte-mono); font-weight:700; color: var(--cor-dourado-claro);">${o.pontos} pontos</span>
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
                <input type="text" name="nome" value="${o.nome}" required />
              </div>
              <div class="campo-linha">
                <div class="campo">
                  <label>CPF</label>
                  <input type="text" name="cpf" value="${o.cpf||""}" placeholder="Opcional" />
                </div>
                <div class="campo">
                  <label>Telefone</label>
                  <input type="text" name="telefone" value="${o.telefone||""}" placeholder="Opcional" />
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
              ${n.length?n.map(i=>`
                <div class="cadastro-item" data-id="${i.id}">
                  <div class="cadastro-item-info">
                    <strong>${i.logradouro}, ${i.numero}${i.complemento?" — "+i.complemento:""}</strong>
                    <span>${i.bairro}${i.referencia?" · "+i.referencia:""}</span>
                  </div>
                  <button class="btn btn-perigo btn-sm btn-del-end" data-id="${i.id}">Remover</button>
                </div>
              `).join(""):'<p style="color: var(--cor-texto-fraco);">Nenhum endereço cadastrado.</p>'}
            </div>
          </div>

          <!-- Cartões -->
          <div class="conteudo-aba" data-conteudo="cartoes" style="display:none;">
            <div class="admin-toolbar">
              <h3>Meus cartões</h3>
              <button class="btn btn-secundario btn-sm" id="btn-add-cart">+ Adicionar</button>
            </div>
            <div class="lista-cadastros" id="lista-cartoes">
              ${r.length?r.map(i=>`
                <div class="cadastro-item" data-id="${i.id}">
                  <div class="cadastro-item-info">
                    <strong>${Ta(i.numeroCartao)}</strong>
                    <span>${i.nomeCartao} · Validade: ${i.dataValidade}</span>
                  </div>
                  <button class="btn btn-perigo btn-sm btn-del-cart" data-id="${i.id}">Remover</button>
                </div>
              `).join(""):'<p style="color: var(--cor-texto-fraco);">Nenhum cartão cadastrado.</p>'}
            </div>
          </div>

          <!-- Extrato de pontos -->
          <div class="conteudo-aba" data-conteudo="extrato" style="display:none;">
            <h3 style="margin-bottom: var(--espaco-4);">Extrato de pontos</h3>
            ${s.length?`
              <div class="card tabela-wrap">
                <table class="tabela-admin">
                  <thead>
                    <tr><th>Data</th><th>Descrição</th><th>Pontos</th></tr>
                  </thead>
                  <tbody>
                    ${s.map(i=>`
                      <tr>
                        <td style="color: var(--cor-texto-fraco);">${I(i.createdAt)}</td>
                        <td>${i.descricao}</td>
                        <td class="numero-mono" style="color: ${i.tipo==="credito"?"var(--cor-sucesso)":"var(--cor-erro)"};">
                          ${i.tipo==="credito"?"+":"−"}${i.valor}
                        </td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            `:'<p style="color: var(--cor-texto-fraco);">Nenhuma movimentação de pontos ainda.</p>'}
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
    `,t.querySelectorAll(".aba-btn").forEach(i=>{i.addEventListener("click",()=>{t.querySelectorAll(".aba-btn").forEach(d=>d.classList.remove("ativa")),t.querySelectorAll(".conteudo-aba").forEach(d=>d.style.display="none"),i.classList.add("ativa"),t.querySelector(`[data-conteudo="${i.dataset.aba}"]`).style.display=""})}),(p=t.querySelector("#form-perfil"))==null||p.addEventListener("submit",async i=>{i.preventDefault();const d=i.target.querySelector('button[type="submit"]');d.disabled=!0,d.textContent="Salvando...";try{const h={nome:i.target.nome.value.trim(),cpf:i.target.cpf.value.trim()||null,telefone:i.target.telefone.value.trim()||null};o=await Oa(h),q(o),S("Perfil atualizado com sucesso!"),u()}catch(h){t.querySelector("#perfil-erro").innerHTML=`<div class="alerta alerta-erro">${h.message}</div>`,d.disabled=!1,d.textContent="Salvar alterações"}}),(c=t.querySelector("#form-senha"))==null||c.addEventListener("submit",async i=>{i.preventDefault();const d=i.target.querySelector('button[type="submit"]');d.disabled=!0,d.textContent="Alterando...";try{await za({senha_atual:i.target.senha_atual.value,nova_senha:i.target.nova_senha.value}),S("Senha alterada com sucesso!"),i.target.reset()}catch(h){t.querySelector("#senha-erro").innerHTML=`<div class="alerta alerta-erro">${h.message}</div>`}finally{d.disabled=!1,d.textContent="Alterar senha"}}),(b=t.querySelector("#btn-add-end"))==null||b.addEventListener("click",()=>{F({titulo:"Novo endereço",conteudoHtml:`
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
        `,aoMontar:(i,d)=>{i.querySelector("#form-end").addEventListener("submit",async h=>{h.preventDefault();try{const m=await fe({logradouro:h.target.logradouro.value.trim(),numero:h.target.numero.value.trim(),bairro:h.target.bairro.value.trim(),complemento:h.target.complemento.value.trim()||null,referencia:h.target.referencia.value.trim()||null});n.push(m),d(),S("Endereço adicionado!"),u(),setTimeout(()=>{var e;return(e=t.querySelector('[data-aba="enderecos"]'))==null?void 0:e.click()},50)}catch(m){i.querySelector("#end-erro").innerHTML=`<div class="alerta alerta-erro">${m.message}</div>`}})}})}),t.querySelectorAll(".btn-del-end").forEach(i=>{i.addEventListener("click",async()=>{if(confirm("Remover este endereço?"))try{await ge(Number(i.dataset.id)),n=n.filter(d=>d.id!==Number(i.dataset.id)),S("Endereço removido."),u(),setTimeout(()=>{var d;return(d=t.querySelector('[data-aba="enderecos"]'))==null?void 0:d.click()},50)}catch(d){M(d.message)}})}),(w=t.querySelector("#btn-add-cart"))==null||w.addEventListener("click",()=>{F({titulo:"Novo cartão",conteudoHtml:`
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
        `,aoMontar:(i,d)=>{i.querySelector("#form-cart").addEventListener("submit",async h=>{h.preventDefault();try{const m=await $e({numeroCartao:h.target.numero.value.replace(/\s/g,""),nomeCartao:h.target.nome.value.trim(),dataValidade:h.target.validade.value.trim(),cvv:h.target.cvv.value.trim()});r.push(m),d(),S("Cartão adicionado!"),u(),setTimeout(()=>{var e;return(e=t.querySelector('[data-aba="cartoes"]'))==null?void 0:e.click()},50)}catch(m){i.querySelector("#cart-erro").innerHTML=`<div class="alerta alerta-erro">${m.message}</div>`}})}})}),t.querySelectorAll(".btn-del-cart").forEach(i=>{i.addEventListener("click",async()=>{if(confirm("Remover este cartão?"))try{await xe(Number(i.dataset.id)),r=r.filter(d=>d.id!==Number(i.dataset.id)),S("Cartão removido."),u(),setTimeout(()=>{var d;return(d=t.querySelector('[data-aba="cartoes"]'))==null?void 0:d.click()},50)}catch(d){M(d.message)}})})}u()}async function Le(){return $.get("/api/usuarios")}const Ee=["pendente","pago","preparando","entregue","cancelado"];async function Ce(a){a.innerHTML=`
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
  `;const t=a.querySelector("#conteudo-admin");let[o,n,r,s]=[[],[],[],[]];try{[o,n,r,s]=await Promise.all([fa().catch(()=>[]),le().catch(()=>[]),re().catch(()=>[]),Le().catch(()=>[])])}catch{}const u=a.querySelectorAll(".aba-btn");u.forEach(e=>{e.addEventListener("click",()=>{u.forEach(v=>v.classList.remove("ativa")),e.classList.add("ativa"),p(e.dataset.aba)})});function p(e){switch(e){case"dashboard":c();break;case"cardapio":b();break;case"pedidos":i();break;case"roleta":d();break;case"usuarios":m();break}}function c(){const e=n.filter(v=>v.situacao!=="cancelado").reduce((v,y)=>v+Number(y.precoTotal||0),0);t.innerHTML=`
      <div class="admin-grade-stats">
        <div class="card stat-card">
          <div class="valor numero-mono">${n.length}</div>
          <div class="rotulo">Total de pedidos</div>
        </div>
        <div class="card stat-card">
          <div class="valor numero-mono">${E(e)}</div>
          <div class="rotulo">Receita total</div>
        </div>
        <div class="card stat-card">
          <div class="valor numero-mono">${o.length}</div>
          <div class="rotulo">Itens no cardápio</div>
        </div>
        <div class="card stat-card">
          <div class="valor numero-mono">${s.length}</div>
          <div class="rotulo">Usuários</div>
        </div>
      </div>

      <div class="card">
        <h3 style="margin-bottom: var(--espaco-4);">Pedidos recentes</h3>
        <div class="tabela-wrap">
          <table class="tabela-admin">
            <thead><tr><th>ID</th><th>Usuário</th><th>Total</th><th>Situação</th><th>Data</th></tr></thead>
            <tbody>
              ${n.slice(0,10).map(v=>`
                <tr>
                  <td class="numero-mono">#${v.id}</td>
                  <td>${v.usuarioId}</td>
                  <td class="numero-mono">${E(v.precoTotal)}</td>
                  <td><span class="badge badge-${v.situacao}">${Q(v.situacao)}</span></td>
                  <td style="color: var(--cor-texto-fraco);">${I(v.createdAt)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `}function b(){t.innerHTML=`
      <div class="admin-toolbar">
        <h2 style="margin:0;">Cardápio</h2>
        <button class="btn btn-primario btn-sm" id="btn-novo-item">+ Novo item</button>
      </div>
      <div class="card tabela-wrap">
        <table class="tabela-admin" id="tabela-cardapio">
          <thead><tr><th>ID</th><th>Nome</th><th>Categoria</th><th>Preço</th><th>Ativo</th><th>Ações</th></tr></thead>
          <tbody>
            ${o.map(e=>`
              <tr data-id="${e.id}">
                <td class="numero-mono">${e.id}</td>
                <td>${e.nome}</td>
                <td>${e.categoria||"—"}</td>
                <td class="numero-mono">${E(e.preco)}</td>
                <td>${e.ativo?"✅":"❌"}</td>
                <td>
                  <div class="acoes-tabela">
                    <button class="btn btn-secundario btn-sm btn-editar-item" data-id="${e.id}">Editar</button>
                    <button class="btn btn-perigo btn-sm btn-del-item" data-id="${e.id}">Remover</button>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,t.querySelector("#btn-novo-item").addEventListener("click",()=>w(null)),t.querySelectorAll(".btn-editar-item").forEach(e=>{e.addEventListener("click",()=>{const v=o.find(y=>y.id===Number(e.dataset.id));v&&w(v)})}),t.querySelectorAll(".btn-del-item").forEach(e=>{e.addEventListener("click",async()=>{if(confirm("Remover este item do cardápio?"))try{await Ya(Number(e.dataset.id)),o=o.filter(v=>v.id!==Number(e.dataset.id)),S("Item removido."),b()}catch(v){M(v.message)}})})}function w(e){F({titulo:e?"Editar item":"Novo item",conteudoHtml:`
        <form id="form-item" novalidate>
          <div class="campo"><label>Nome</label><input type="text" name="nome" value="${(e==null?void 0:e.nome)||""}" required /></div>
          <div class="campo"><label>Categoria</label><input type="text" name="categoria" value="${(e==null?void 0:e.categoria)||""}" placeholder="Ex: Lanche, Bebida" /></div>
          <div class="campo"><label>Preço (R$)</label><input type="number" name="preco" value="${(e==null?void 0:e.preco)||""}" min="0" step="0.01" required /></div>
          <div class="campo"><label>Descrição</label><textarea name="descricao" rows="3">${(e==null?void 0:e.descricao)||""}</textarea></div>
          <div class="campo"><label>URL da imagem</label><input type="url" name="url_imagem" value="${(e==null?void 0:e.urlImagem)||(e==null?void 0:e.url_imagem)||""}" placeholder="https://..." /></div>
          <div class="campo" style="flex-direction:row; align-items:center; gap:10px;">
            <input type="checkbox" name="ativo" id="chk-ativo" ${!e||e.ativo?"checked":""} style="width:18px; height:18px; accent-color: var(--cor-dourado);" />
            <label for="chk-ativo" style="margin:0;">Item ativo (visível no cardápio)</label>
          </div>
          <div id="item-erro"></div>
          <button type="submit" class="btn btn-primario btn-bloco" style="margin-top: var(--espaco-3);">${e?"Salvar alterações":"Criar item"}</button>
        </form>
      `,aoMontar:(v,y)=>{v.querySelector("#form-item").addEventListener("submit",async g=>{g.preventDefault();const l={nome:g.target.nome.value.trim(),categoria:g.target.categoria.value.trim(),preco:Number(g.target.preco.value),descricao:g.target.descricao.value.trim()||null,url_imagem:g.target.url_imagem.value.trim()||null,ativo:g.target.ativo.checked};try{if(e){const f=await Xa(e.id,l);o=o.map(L=>L.id===e.id?f:L),S("Item atualizado!")}else{const f=await Wa(l);o.push(f),S("Item criado!")}y(),b()}catch(f){v.querySelector("#item-erro").innerHTML=`<div class="alerta alerta-erro">${f.message}</div>`}})}})}function i(){t.innerHTML=`
      <h2 style="margin-bottom: var(--espaco-5);">Todos os pedidos</h2>
      <div class="card tabela-wrap">
        <table class="tabela-admin">
          <thead><tr><th>ID</th><th>Usuário</th><th>Itens</th><th>Total</th><th>Situação</th><th>Data</th><th>Ações</th></tr></thead>
          <tbody>
            ${n.map(e=>{const y=(e.itens||[]).map(g=>{var l;return`${g.quantidade}× ${((l=g.item_menu)==null?void 0:l.nome)||"Item"}`}).join(", ")||"—";return`
                <tr>
                  <td class="numero-mono">#${e.id}</td>
                  <td>${e.usuarioId}</td>
                  <td style="font-size:0.82rem; max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${y}">${y}</td>
                  <td class="numero-mono">${E(e.precoTotal)}</td>
                  <td>
                    <select class="sel-situacao" data-id="${e.id}" style="background: var(--cor-superficie-alta); border: 1px solid var(--cor-borda); border-radius: var(--raio-sm); padding: 4px 8px; color: var(--cor-texto); font-size:0.8rem;">
                      ${Ee.map(g=>`<option value="${g}" ${g===e.situacao?"selected":""}>${Q(g)}</option>`).join("")}
                    </select>
                  </td>
                  <td style="color: var(--cor-texto-fraco); font-size:0.8rem;">${I(e.createdAt)}</td>
                  <td>
                    <button class="btn btn-secundario btn-sm btn-salvar-sit" data-id="${e.id}">Salvar</button>
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      </div>
    `,t.querySelectorAll(".btn-salvar-sit").forEach(e=>{e.addEventListener("click",async()=>{const v=t.querySelector(`.sel-situacao[data-id="${e.dataset.id}"]`);try{await ue(Number(e.dataset.id),{situacao:v.value}),n=n.map(y=>y.id===Number(e.dataset.id)?{...y,situacao:v.value}:y),S("Situação atualizada.")}catch(y){M(y.message)}})})}function d(){t.innerHTML=`
      <div class="admin-toolbar">
        <h2 style="margin:0;">Prêmios da roleta</h2>
        <button class="btn btn-primario btn-sm" id="btn-novo-premio">+ Novo prêmio</button>
      </div>
      <div class="card tabela-wrap">
        <table class="tabela-admin">
          <thead><tr><th>ID</th><th>Nome</th><th>Desconto</th><th>Probabilidade</th><th>Cor</th><th>Ativo</th><th>Ações</th></tr></thead>
          <tbody>
            ${r.map(e=>`
              <tr data-id="${e.id}">
                <td>${e.id}</td>
                <td>${e.nome||e.label}</td>
                <td class="numero-mono">${e.desconto_percentual??e.descontoPercentual}%</td>
                <td class="numero-mono">${e.probabilidade_vitoria??e.probabilidadeVitoria}</td>
                <td><span style="display:inline-block; width:20px; height:20px; border-radius:50%; background:${e.color||e.cor}; border: 1px solid var(--cor-borda-forte);"></span> ${e.color||e.cor}</td>
                <td>${e.ativo!==!1?"✅":"❌"}</td>
                <td>
                  <div class="acoes-tabela">
                    <button class="btn btn-secundario btn-sm btn-editar-premio" data-id="${e.id}">Editar</button>
                    <button class="btn btn-perigo btn-sm btn-del-premio" data-id="${e.id}">Remover</button>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,t.querySelector("#btn-novo-premio").addEventListener("click",()=>h(null)),t.querySelectorAll(".btn-editar-premio").forEach(e=>{e.addEventListener("click",()=>{const v=r.find(y=>y.id===Number(e.dataset.id));v&&h(v)})}),t.querySelectorAll(".btn-del-premio").forEach(e=>{e.addEventListener("click",async()=>{if(confirm("Remover este prêmio?"))try{await se(Number(e.dataset.id)),r=r.filter(v=>v.id!==Number(e.dataset.id)),S("Prêmio removido."),d()}catch(v){M(v.message)}})})}function h(e){F({titulo:e?"Editar prêmio":"Novo prêmio",conteudoHtml:`
        <form id="form-premio" novalidate>
          <div class="campo"><label>Nome</label><input type="text" name="nome" value="${(e==null?void 0:e.nome)||(e==null?void 0:e.label)||""}" required /></div>
          <div class="campo"><label>Descrição</label><input type="text" name="descricao" value="${(e==null?void 0:e.descricao)||""}" /></div>
          <div class="campo-linha">
            <div class="campo"><label>Desconto (%)</label><input type="number" name="desconto" value="${(e==null?void 0:e.desconto_percentual)??(e==null?void 0:e.descontoPercentual)??0}" min="0" max="100" required /></div>
            <div class="campo"><label>Probabilidade</label><input type="number" name="prob" value="${(e==null?void 0:e.probabilidade_vitoria)??(e==null?void 0:e.probabilidadeVitoria)??10}" min="0.01" step="0.01" required /></div>
          </div>
          <div class="campo"><label>Cor (hex)</label><input type="color" name="cor" value="${(e==null?void 0:e.color)||(e==null?void 0:e.cor)||"#d4af37"}" style="height:42px; cursor:pointer;" /></div>
          <div class="campo" style="flex-direction:row; align-items:center; gap:10px;">
            <input type="checkbox" name="ativo" id="chk-prem-ativo" ${!e||e.ativo!==!1?"checked":""} style="width:18px; height:18px; accent-color: var(--cor-dourado);" />
            <label for="chk-prem-ativo" style="margin:0;">Prêmio ativo na roleta</label>
          </div>
          <div id="premio-erro"></div>
          <button type="submit" class="btn btn-primario btn-bloco" style="margin-top: var(--espaco-3);">${e?"Salvar":"Criar prêmio"}</button>
        </form>
      `,aoMontar:(v,y)=>{v.querySelector("#form-premio").addEventListener("submit",async g=>{g.preventDefault();const l={nome:g.target.nome.value.trim(),descricao:g.target.descricao.value.trim()||null,descontoPercentual:Number(g.target.desconto.value),probabilidadeVitoria:Number(g.target.prob.value),cor:g.target.cor.value,ativo:g.target.ativo.checked};try{if(e){const f=await ie(e.id,l);r=r.map(L=>L.id===e.id?f:L),S("Prêmio atualizado!")}else{const f=await ne(l);r.push(f),S("Prêmio criado!")}y(),d()}catch(f){v.querySelector("#premio-erro").innerHTML=`<div class="alerta alerta-erro">${f.message}</div>`}})}})}function m(){t.innerHTML=`
      <h2 style="margin-bottom: var(--espaco-5);">Usuários</h2>
      <div class="card tabela-wrap">
        <table class="tabela-admin">
          <thead><tr><th>ID</th><th>Nome</th><th>E-mail</th><th>Pontos</th><th>Função</th><th>Cadastro</th></tr></thead>
          <tbody>
            ${s.map(e=>`
              <tr>
                <td class="numero-mono">${e.id}</td>
                <td>${e.nome}</td>
                <td style="color: var(--cor-texto-suave);">${e.email}</td>
                <td class="numero-mono">${e.pontos}</td>
                <td><span class="badge ${e.idFuncao===2?"badge-pago":""}">${e.idFuncao===2?"Admin":"Cliente"}</span></td>
                <td style="color: var(--cor-texto-fraco); font-size:0.8rem;">${I(e.createdAt)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `}c()}C("/",{render:Za});C("/login",{render:Qa});C("/cadastro",{render:Ka});C("/menu",{render:ee});C("/carrinho",{render:me,exigeAuth:!0});C("/pedidos",{render:ve,exigeAuth:!0});C("/roleta",{render:be,exigeAuth:!0});C("/perfil",{render:Se,exigeAuth:!0});C("/admin",{render:Ce,exigeAuth:!0,exigeAdmin:!0});document.addEventListener("DOMContentLoaded",async()=>{const a=document.getElementById("app"),t=document.createElement("div"),o=document.createElement("div");o.id="pagina";const n=document.createElement("div");if(a.appendChild(t),a.appendChild(o),a.appendChild(n),Ra(t),_a(n),V(!0),W())try{const r=await j();q(r)}catch{V(!1)}else V(!1);qa(o)});
