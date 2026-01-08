// File: server.js
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express(); 
app.use(cors()); 
app.use(express.json({limit:'2mb'})); 

// Serve only the public directory and specific allowed files from root
// This prevents exposing sensitive files like .env, .git, etc.
app.use(express.static('public', { dotfiles: 'deny' }));
app.use('/src', express.static('src', { dotfiles: 'deny' }));
app.use('/docs', express.static('docs', { dotfiles: 'deny' }));

// Serve specific HTML files from root
const allowedRootFiles = [
  'index.html', 
  'mrw-animated-terminal.html', 
  'test-unified-system.html',
  'rogers-ai-console.html',
  'mario-jukebox.html',
  'pewpi-integration-test.html'
];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve only whitelisted HTML files from root
allowedRootFiles.forEach(file => {
  app.get(`/${file}`, (req, res) => {
    res.sendFile(path.join(__dirname, file));
  });
});

const root = process.cwd();
const dirs = ['tokens','search','logs'];

async function ensure(){ 
  for(const d of dirs) await fsp.mkdir(path.join(root,d), {recursive:true}); 
}

function sh(cmd){ 
  // Security: Validate command to prevent command injection
  // Only allow git commands with specific patterns
  if (!cmd.startsWith('git add ') && !cmd.startsWith('git commit ')) {
    return Promise.reject(new Error('Invalid command: only git add and git commit are allowed'));
  }
  return new Promise((res,rej)=> exec(cmd,{cwd:root},(e,so,se)=> e ? rej(new Error((so||'')+(se||''))) : res((so||'')+(se||'')))); 
}

app.post('/api/tokens', async (req,res)=> {
  try { 
    await ensure(); 
    const t = req.body||{}; 
    // Validate token name to prevent path traversal
    const tokenName = (t.name||'Token').replace(/[^a-zA-Z0-9_-]/g, '');
    const fname = `${tokenName}-${Date.now()}.json`;
    await fsp.writeFile(path.join(root,'tokens',fname), JSON.stringify(t,null,2));
    let log=''; try { log += await sh(`git add tokens/${fname}`); log += await sh(`git commit -m "token:${fname}"`); } catch(e){ log += `WARN ${e.message}`; }
    res.json({ ok:true, path:`tokens/${fname}`, log });
  } catch(e){ res.status(500).json({ error:e.message }); }
});

app.post('/api/search', async (req,res)=> {
  try { await ensure(); const a = req.body||{}; const fname = `search-${Date.now()}.json`;
    await fsp.writeFile(path.join(root,'search',fname), JSON.stringify(a,null,2));
    let log=''; try { log += await sh(`git add search/${fname}`); log += await sh(`git commit -m "search:${fname}"`); } catch(e){ log += `WARN ${e.message}`; }
    res.json({ ok:true, path:`search/${fname}`, log });
  } catch(e){ res.status(500).json({ error:e.message }); }
});

app.post('/api/logs', async (req,res)=> {
  try { await ensure(); const msg = req.body?.msg || ''; const fname = `log-${Date.now()}.txt`;
    await fsp.writeFile(path.join(root,'logs',fname), `${new Date().toISOString()} :: ${msg}\n`);
    let log=''; try { log += await sh(`git add logs/${fname}`); log += await sh(`git commit -m "log:${fname}"`); } catch(e){ log += `WARN ${e.message}`; }
    res.json({ ok:true, path:`logs/${fname}`, log });
  } catch(e){ res.status(500).json({ error:e.message }); }
});

const PORT = process.env.PORT || 3000;
ensure().then(()=> app.listen(PORT, ()=> console.log(`Backend on http://localhost:${PORT}`)));