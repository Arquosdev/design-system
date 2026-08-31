import { test } from 'node:test';
import assert from 'node:assert/strict';

import { passwordToggleLabel, passwordToggleLabels } from './password-input.logic.ts';

test('le libellé nomme l’action, pas l’état', () => {
  // En clair, le bouton va MASQUER. Le piège serait de rendre « Afficher »
  // parce que c'est l'état courant.
  assert.equal(passwordToggleLabel(true), 'Masquer le mot de passe');
  assert.equal(passwordToggleLabel(false), 'Afficher le mot de passe');
});

test('les deux libellés disent de quoi il s’agit', () => {
  // Le bouton n'a qu'une icône : « Afficher » seul ne dit pas quoi afficher.
  for (const mot of Object.values(passwordToggleLabels)) {
    assert.match(mot, /mot de passe/);
  }
});
