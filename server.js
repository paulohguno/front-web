import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Prioriza a porta da Vercel/Render, caso contrário usa 5173
const PORTA = process.env.PORT || 5173;

const TIPOS_MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const servidor = http.createServer((req, res) => {
  let urlPath = req.url === '/' ? '/index.html' : req.url;
  
  // Tenta localizar o arquivo na raiz. 
  // SE O SEU PROJETO USA VITE/REACT, MUDE ABAIXO PARA: path.join(__dirname, 'dist', urlPath)
  let caminhoArquivo = path.join(__dirname, urlPath);

  fs.readFile(caminhoArquivo, (err, dados) => {
    if (err) {
      // Se não achar o arquivo, serve o index.html (essencial para SPA)
      fs.readFile(path.join(__dirname, 'index.html'), (errIndex, indexData) => {
        if (errIndex) {
          res.writeHead(404);
          res.end('Arquivo não encontrado');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(indexData);
        }
      });
    } else {
      const ext = path.extname(caminhoArquivo).toLowerCase();
      res.writeHead(200, { 'Content-Type': TIPOS_MIME[ext] || 'text/plain' });
      res.end(dados);
    }
  });
});

servidor.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});