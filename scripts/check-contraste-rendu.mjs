// Mesure le contraste sur le RENDU, story par story.
//
//   npm run vitrine && node scripts/check-contraste-rendu.mjs
//
// Pourquoi ce second contrôle, alors que `check-contraste.mjs` existe déjà :
// celui-là lit les classes Tailwind, et n'apparie donc que ce qui vit dans la
// MÊME chaîne de classes. Un fond posé sur le parent et une couleur sur
// l'enfant lui échappent entièrement.
//
// Ce n'était pas théorique. En une seule journée, le 25/08/2026, trois défauts
// sont passés par là :
//
//   • l'icône d'EmptyState, 2,93 pour 1 sur son carré gris
//   • le compteur de la ligne courante du rail, 4,47 sur son fond bleu
//   • le bandeau de relevé de la fiche, une paire répartie sur deux éléments
//
// Les trois ont été trouvés à l'œil, parce que quelqu'un regardait. Ce script
// remplace ce quelqu'un.
//
// Il ouvre chaque story dans un vrai navigateur et y lance la règle
// `color-contrast` d'axe, qui remonte l'arbre pour trouver le fond réellement
// peint. C'est exactement ce que le contrôle statique ne sait pas faire.
//
// Une seule règle est activée, et c'est délibéré : axe en signale des dizaines
// d'autres qui n'ont pas de sens sur un composant isolé — pas de repère de
// page, pas de titre de niveau 1. Un contrôle qui crie pour rien finit
// désactivé.

import { readFileSync, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const VITRINE = join(ROOT, 'dist-vitrine');
const AXE = join(ROOT, 'node_modules/axe-core/axe.min.js');

if (!existsSync(join(VITRINE, 'index.json'))) {
  console.error('✗ dist-vitrine absent — lancer `npm run vitrine` d’abord.');
  process.exit(1);
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
};

/** Un serveur de fichiers minimal : Playwright ne lit pas `file://` sans heurts. */
function servir() {
  return new Promise((resolve) => {
    const serveur = createServer((req, res) => {
      const chemin = join(VITRINE, decodeURIComponent(req.url.split('?')[0]));
      if (!chemin.startsWith(VITRINE) || !existsSync(chemin)) {
        res.writeHead(404).end();
        return;
      }
      res.writeHead(200, { 'Content-Type': TYPES[extname(chemin)] ?? 'application/octet-stream' });
      res.end(readFileSync(chemin));
    });
    serveur.listen(0, '127.0.0.1', () => resolve({ serveur, port: serveur.address().port }));
  });
}

const index = JSON.parse(readFileSync(join(VITRINE, 'index.json'), 'utf8'));
const stories = Object.values(index.entries).filter((e) => e.type === 'story');

const { serveur, port } = await servir();
const axeSource = readFileSync(AXE, 'utf8');

// `channel: 'chrome'` prend le Chrome déjà présent — sur un poste comme sur un
// runner GitHub — plutôt que de télécharger 150 Mo de chromium à chaque CI.
let navigateur;
try {
  navigateur = await chromium.launch({ channel: 'chrome' });
} catch {
  navigateur = await chromium.launch();
}

const page = await navigateur.newPage({ viewport: { width: 1280, height: 900 } });
const echecs = [];

for (const story of stories) {
  const url = `http://127.0.0.1:${port}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`;
  await page.goto(url, { waitUntil: 'networkidle' });
  // Laisser les polices se poser : un texte mesuré avant leur chargement peut
  // porter une autre couleur, et produire un faux positif comme un faux négatif.
  await page.evaluate(() => document.fonts.ready);

  await page.evaluate(axeSource);
  const resultat = await page.evaluate(async () =>
    // eslint-disable-next-line no-undef
    window.axe.run(document.body, {
      runOnly: { type: 'rule', values: ['color-contrast'] },
      resultTypes: ['violations'],
    }),
  );

  for (const violation of resultat.violations) {
    for (const noeud of violation.nodes) {
      echecs.push({
        story: story.title + ' › ' + story.name,
        cible: noeud.target.join(' '),
        // axe met le ratio mesuré et les couleurs dans son message.
        details: (noeud.any[0]?.message ?? '').replace(/\s+/g, ' ').trim(),
      });
    }
  }
}

await navigateur.close();
serveur.close();

if (echecs.length) {
  console.error(`\n✗ ${echecs.length} texte(s) illisible(s) au rendu :\n`);
  for (const e of echecs) {
    console.error(`  ${e.story}`);
    console.error(`    ${e.cible}`);
    console.error(`    ${e.details}\n`);
  }
  console.error(
    '  Ce contrôle mesure le fond RÉELLEMENT peint, en remontant l’arbre.\n' +
      '  Un fond sur le parent et une couleur sur l’enfant sont donc vus ici,\n' +
      '  là où `npm run contraste` ne peut pas les voir.\n',
  );
  process.exit(1);
}

console.log(`✓ contraste au rendu : ${stories.length} stories, aucun texte illisible`);
