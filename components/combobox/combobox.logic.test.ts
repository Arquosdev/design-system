import { deepStrictEqual, strictEqual } from 'node:assert/strict';
import { describe, it } from 'node:test';

import { realChoices, displayedText, displayedPlaceholder, matchScore } from './combobox.logic.ts';

/* Ce que `menuDeChoix` fabrique pour un champ vide : la sentinelle du `Select`
   en tête, puis les vraies marques. */
const AVEC_SENTINELLE = [
  { value: '', label: '— choisir —' },
  { value: 'SEMATIC', label: 'SEMATIC' },
  { value: 'FERMATOR', label: 'FERMATOR' },
];

describe('choixReels', () => {
  it('écarte la sentinelle du Select', () => {
    deepStrictEqual(
      realChoices(AVEC_SENTINELLE).map((o) => o.value),
      ['SEMATIC', 'FERMATOR'],
    );
  });

  it('ne touche à rien quand il n’y en a pas', () => {
    const sans = [{ value: 'OTIS', label: 'OTIS' }];
    deepStrictEqual(realChoices(sans), sans);
  });
});

describe('contenuAffiche', () => {
  it('laisse le champ VIDE quand rien n’est retenu', () => {
    // Le défaut du 04/09/2026 : la sentinelle s'affichait comme une saisie, et
    // la frappe s'y collait.
    strictEqual(displayedText(AVEC_SENTINELLE, '', false, ''), '');
  });

  it('montre le libellé de la valeur retenue', () => {
    strictEqual(displayedText(AVEC_SENTINELLE, 'SEMATIC', false, ''), 'SEMATIC');
  });

  it('garde une valeur hors catalogue telle quelle', () => {
    strictEqual(displayedText(AVEC_SENTINELLE, 'MARQUE INCONNUE', false, ''), 'MARQUE INCONNUE');
  });

  it('montre la frappe dès que le champ est ouvert', () => {
    strictEqual(displayedText(AVEC_SENTINELLE, 'SEMATIC', true, 'FER'), 'FER');
  });
});

describe('invitAffichee', () => {
  it('rend l’invite ordinaire quand rien n’est retenu', () => {
    strictEqual(displayedPlaceholder(AVEC_SENTINELLE, '', true, 'Rechercher…'), 'Rechercher…');
  });

  it('garde la valeur retenue en filigrane pendant qu’on tape', () => {
    // Sans ça, ouvrir le champ efface sous les yeux ce qu'on venait remplacer.
    strictEqual(displayedPlaceholder(AVEC_SENTINELLE, 'SEMATIC', true, 'Rechercher…'), 'SEMATIC');
  });

  it('garde une valeur hors catalogue telle quelle', () => {
    strictEqual(displayedPlaceholder(AVEC_SENTINELLE, 'INCONNUE', true, 'Rechercher…'), 'INCONNUE');
  });

  it('rend l’invite ordinaire une fois le champ fermé', () => {
    // Fermé, c'est `contenuAffiche` qui montre la valeur : l'invite ne sert plus.
    strictEqual(displayedPlaceholder(AVEC_SENTINELLE, 'SEMATIC', false, 'Rechercher…'), 'Rechercher…');
  });
});

describe('matchScore', () => {
  it('écarte un libellé où les lettres tapées ne sont qu’éparpillées', () => {
    // Le cas d'Olivier, le 28/10/2026 : cmdk gardait ces champs pour « année ».
    for (const libelle of ['Contrat de maintenance', 'Type', 'Parois gaine', 'Taux de connaissance']) {
      strictEqual(matchScore(libelle, 'année'), 0, libelle);
    }
  });

  it('ignore les accents et les capitales', () => {
    strictEqual(matchScore('Année de mise en service', 'annee') > 0, true);
    strictEqual(matchScore('Électrique', 'ELEC') > 0, true);
  });

  it('met le libellé qui commence par la frappe devant celui qui la contient', () => {
    const debut = matchScore('Année de construction', 'année');
    const mot = matchScore('Dernière année de visite', 'année');
    const dedans = matchScore('Multiannée', 'année');
    strictEqual(debut > mot, true);
    strictEqual(mot > dedans, true);
  });

  it('demande chaque mot tapé, dans n’importe quel ordre', () => {
    strictEqual(matchScore('Année de mise en service', 'service année') > 0, true);
    strictEqual(matchScore('Année de construction', 'service année'), 0);
  });

  it('trouve encore par un mot-clé, mais derrière tout libellé', () => {
    const parMotCle = matchScore('Contrat de maintenance', 'hors parc', ['Hors parc', 'Sous contrat']);
    strictEqual(parMotCle > 0, true);
    strictEqual(parMotCle < matchScore('Parc', 'parc'), true);
  });

  it('garde tout quand rien n’est tapé', () => {
    strictEqual(matchScore('Type', ''), 1);
  });
});
