// Capture des stories + mesure du contraste RÉEL du texte grisé.
import { readFileSync, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';

const ROOT = '/Users/louislemauff/Dev/arquos/design-system';
const VITRINE = join(ROOT, 'dist-vitrine');
const OUT = process.env.OUT;
const TYPES = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8', '.woff2':'font/woff2', '.svg':'image/svg+xml' };
const serveur = createServer((req,res)=>{ const c=join(VITRINE, decodeURIComponent(req.url.split('?')[0])); if(!c.startsWith(VITRINE)||!existsSync(c)) return res.writeHead(404).end(); res.writeHead(200,{'Content-Type':TYPES[extname(c)]??'application/octet-stream'}); res.end(readFileSync(c)); });
await new Promise(r=>serveur.listen(0,'127.0.0.1',r));
const port = serveur.address().port;
let nav; try { nav = await chromium.launch({ channel:'chrome' }); } catch { nav = await chromium.launch(); }
const page = await nav.newPage({ viewport:{ width:900, height:220 }, deviceScaleFactor:2 });

const lin=(c)=>{c/=255;return c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4};
const lum=(rgb)=>0.2126*lin(rgb[0])+0.7152*lin(rgb[1])+0.0722*lin(rgb[2]);
const ratio=(a,b)=>{const[x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return (x+0.05)/(y+0.05)};
const parse=(s)=>s.match(/[\d.]+/g).slice(0,3).map(Number);

for (const arg of process.argv.slice(2)) {
  const [id, nom, h] = arg.split(':');
  await page.setViewportSize({ width: 900, height: Number(h||160) });
  await page.goto(`http://127.0.0.1:${port}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`, { waitUntil:'networkidle' });
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({ path: join(OUT, nom + '.png') });

  // Mesure au rendu de chaque bouton : couleur du texte contre le fond peint.
  const mesures = await page.evaluate(() => {
    const fondPeint = (el) => {
      for (let n = el; n; n = n.parentElement) {
        const bg = getComputedStyle(n).backgroundColor;
        if (bg && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg)) return bg;
      }
      return 'rgb(255, 255, 255)';
    };
    return [...document.querySelectorAll('[data-arq="button"]')].map((b) => ({
      texte: b.textContent.trim(),
      etat: b.getAttribute('data-arq-state') ?? 'active',
      couleur: getComputedStyle(b).color,
      fond: fondPeint(b),
      opacite: getComputedStyle(b).opacity,
      focusable: !b.disabled,
    }));
  });
  for (const m of mesures) {
    const o = Number(m.opacite);
    // Le fondu s'applique au bouton ENTIER : texte et fond se composent chacun
    // sur la page blanche, puis se mesurent l'un contre l'autre.
    const surPage = (c) => c.map((v) => v * o + 255 * (1 - o));
    const c = parse(m.couleur), f = parse(m.fond);
    const r = ratio(surPage(o < 1 ? c : c), surPage(f));
    console.log(`${nom.padEnd(26)} ${m.etat.padEnd(9)} ${JSON.stringify(m.texte).padEnd(34)} opacité ${m.opacite}  focusable ${m.focusable ? 'oui' : 'non '}  ${r.toFixed(2)} pour 1`);
  }
}
await nav.close(); serveur.close();
