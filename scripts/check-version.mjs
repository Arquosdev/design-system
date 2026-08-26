// Refuse un numéro de version déjà publié sous un tag.
//
//   node scripts/check-version.mjs
//
// Deux fois le 25/08/2026, deux branches ont bumpé vers le même numéro : le tag
// s'est posé sur la première fusionnée, et l'app qui l'épinglait recevait un
// design system amputé.
//
// La règle : une PR propose un numéro qui n'a pas encore de tag. Le tag se pose
// ensuite sur `main`.

import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const { version } = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const tag = `v${version}`;

function git(...args) {
  try {
    // `stderr` ignoré : l'absence d'un tag est une réponse, pas une panne, et
    // git l'annonce bruyamment sur la sortie d'erreur.
    return execFileSync('git', args, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

// Sans historique de tags — un clone superficiel — le contrôle ne peut rien
// affirmer. Il le dit et passe, plutôt que de bloquer sur une ignorance.
if (!git('tag', '--list', 'v*')) {
  console.log(`· version : ${tag} — aucun tag récupéré, contrôle sauté`);
  process.exit(0);
}

const cible = git('rev-list', '-n', '1', tag);

if (!cible) {
  console.log(`✓ version : ${tag} est libre`);
  process.exit(0);
}

const tete = git('rev-parse', 'HEAD');

// Le tag existe déjà et pointe ailleurs : le numéro est pris.
if (cible !== tete) {
  console.error(`\n✗ la version ${version} est déjà publiée\n`);
  console.error(`  Le tag ${tag} existe et pointe sur ${cible.slice(0, 7)}.`);
  console.error(`  Deux contenus différents sous un même numéro, c'est une app`);
  console.error(`  qui épingle ${tag} et reçoit autre chose que ce qu'elle croit.\n`);
  console.error(`  Prendre le numéro suivant dans package.json. Si une autre`);
  console.error(`  branche a bumpé en parallèle, c'est exactement ce qui vient`);
  console.error(`  d'arriver — rebaser d'abord, renuméroter ensuite.\n`);
  process.exit(1);
}

console.log(`✓ version : ${tag} correspond à ce commit`);
