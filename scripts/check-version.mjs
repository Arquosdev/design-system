// Refuse une version déjà publiée sous un tag.
//
//   node scripts/check-version.mjs
//
// Pourquoi ce script existe : deux fois en une journée, deux sessions ont
// bumpé la version en parallèle vers le même numéro. Le tag s'est retrouvé posé
// sur le premier commit arrivé, `main` a gardé le même numéro avec un contenu
// différent, et une app qui épinglait ce tag recevait un design system amputé
// du travail de l'autre — sans que rien ne le signale.
//
// C'est arrivé à v1.15.0, puis à v1.18.0. Le coût est invisible et différé :
// on ne s'en aperçoit qu'en cherchant pourquoi un correctif « déjà livré »
// n'est pas là.
//
// La règle : une PR qui touche le dépôt propose un numéro **qui n'a pas encore
// de tag**. Le tag se pose ensuite sur `main`, une fois fusionné.

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
