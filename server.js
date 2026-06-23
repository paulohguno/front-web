// =========================================================
// RODA & SABOR — Frontend dev server (Node.js puro)
// Rode: node server.js
// Acesse: http://localhost:5173
// =========================================================

import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORTA = process.env.PORT || 5173;

const TIPOS_MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
};

const servidor = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];

  // Se acessar "/", servir index.html
  if (urlPath === '/' || urlPath === '') {
    urlPath = '/index.html';
  }

  const caminhoArquivo = path.join(__dirname, urlPath);
  const ext = path.extname(caminhoArquivo).toLowerCase();

  fs.readFile(caminhoArquivo, (err, dados) => {
    if (err) {
      // Fallback SPA
      fs.readFile(path.join(__dirname, 'index.html'), (erroIndex, indexData) => {
        if (erroIndex) {
          res.writeHead(404, {
            'Content-Type': 'text/plain; charset=utf-8'
          });
          return res.end('Arquivo não encontrado');
        }

        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8'
        });

        res.end(indexData);
      });

      return;
    }

    const tipo = TIPOS_MIME[ext] || 'text/plain; charset=utf-8';

    res.writeHead(200, {
      'Content-Type': tipo
    });

    res.end(dados);
  });
});

servidor.listen(PORTA, () => {
  console.log(`\n🎡 Roda & Sabor Frontend`);
  console.log(`   Acesse: http://localhost:${PORTA}`);
  console.log(`   API Backend: http://localhost:3333`);
  console.log('');
});