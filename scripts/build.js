// scripts/build.js
// Script executado antes do deploy no Vercel.
// Injeta a variável VITE_API_URL (definida no painel do Vercel)
// dentro do index.html, substituindo o placeholder.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const API_URL = process.env.VITE_API_URL || '';

if (!API_URL) {
  console.warn(
    '\x1b[33m⚠️  VITE_API_URL não definido. O frontend usará localhost:3333.\x1b[0m\n' +
    '   Defina a variável no painel do Vercel: Settings → Environment Variables'
  );
}

// Lê o index.html
const indexPath = path.join(ROOT, 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// Injeta a URL do backend no window.__ENV__
const envScript = `<script>window.__ENV__ = { VITE_API_URL: "${API_URL}" };</script>`;

// Insere logo antes do </head>
html = html.replace('</head>', `  ${envScript}\n</head>`);

fs.writeFileSync(indexPath, html);
console.log(`✅ API_BASE_URL configurada: ${API_URL || 'http://localhost:3333 (padrão)'}`);
