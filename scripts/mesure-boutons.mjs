// Capture les stories demandées, et MESURE le contraste réel de chaque bouton
// qu'elles rendent.
//
//   npm run vitrine && node scripts/mesure-boutons.mjs <id-de-story>:<nom>:<hauteur> …
//
// Pourquoi ce script existe alors que `check-contraste-rendu.mjs` mesure déjà le
// rendu : **axe exempte du contraste tout ce qui porte `disabled` ou
// `aria-disabled`.** Un bouton indisponible est donc le seul texte de la vitrine
// qu'aucun des deux contrôles ne regarde — ni le lecteur de classes, qui ne sait
// pas fondre une opacité, ni axe, qui passe son chemin.
//
// C'est par là qu'est passé le défaut du 01/09/2026 : le libellé d'un bouton
// `disabled` était à 2,34 pour 1, et rendait vert.
//
// Ce script ne remplace aucun des deux — il n'est pas dans `npm run check`, il
// ne sait pas décider seul. Il sert à deux choses : rendre des captures à Louis,
// qui juge sur image, et poser un chiffre sur ce que les gardes ne voient pas.
//
// Il lit `opacity` et remonte l'arbre pour trouver le fond réellement peint,
// exactement comme axe le ferait s'il regardait.
import { readFileSync, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { chromium } from 'playwright';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const VITRINE = join(ROOT, 'dist-vitrine');
// Où déposer les PNG. Hors du dépôt par défaut : une capture est une pièce
// qu'on montre, pas une source qu'on versionne.
const OUT = process.env.OUT ?? tmpdir();
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
    const r = ratio(surPage(c), surPage(f));
    console.log(`${nom.padEnd(26)} ${m.etat.padEnd(9)} ${JSON.stringify(m.texte).padEnd(34)} opacité ${m.opacite}  focusable ${m.focusable ? 'oui' : 'non '}  ${r.toFixed(2)} pour 1`);
  }
}
await nav.close(); serveur.close();
