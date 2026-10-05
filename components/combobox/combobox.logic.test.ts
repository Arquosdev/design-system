import { deepStrictEqual, strictEqual } from 'node:assert/strict';
import { describe, it } from 'node:test';

import { choixReels, contenuAffiche, invitAffichee, messageVide } from './combobox.logic.ts';

/* Ce que `menuDeChoix` fabrique pour un champ vide : la sentinelle du `Select`
   en tête, puis les vraies marques. */
const AVEC_SENTINELLE = [
  { valeur: '', libelle: '— choisir —' },
  { valeur: 'SEMATIC', libelle: 'SEMATIC' },
  { valeur: 'FERMATOR', libelle: 'FERMATOR' },
];

describe('choixReels', () => {
  it('écarte la sentinelle du Select', () => {
    deepStrictEqual(
      choixReels(AVEC_SENTINELLE).map((o) => o.valeur),
      ['SEMATIC', 'FERMATOR'],
    );
  });

  it('ne touche à rien quand il n’y en a pas', () => {
    const sans = [{ valeur: 'OTIS', libelle: 'OTIS' }];
    deepStrictEqual(choixReels(sans), sans);
  });
});

describe('contenuAffiche', () => {
  it('laisse le champ VIDE quand rien n’est retenu', () => {
    // Le défaut du 04/09/2026 : la sentinelle s'affichait comme une saisie, et
    // la frappe s'y collait.
    strictEqual(contenuAffiche(AVEC_SENTINELLE, '', false, ''), '');
  });

  it('montre le libellé de la valeur retenue', () => {
    strictEqual(contenuAffiche(AVEC_SENTINELLE, 'SEMATIC', false, ''), 'SEMATIC');
  });

  it('garde une valeur hors catalogue telle quelle', () => {
    strictEqual(contenuAffiche(AVEC_SENTINELLE, 'MARQUE INCONNUE', false, ''), 'MARQUE INCONNUE');
  });

  it('montre la frappe dès que le champ est ouvert', () => {
    strictEqual(contenuAffiche(AVEC_SENTINELLE, 'SEMATIC', true, 'FER'), 'FER');
  });
});

describe('invitAffichee', () => {
  it('rend l’invite ordinaire quand rien n’est retenu', () => {
    strictEqual(invitAffichee(AVEC_SENTINELLE, '', true, 'Rechercher…'), 'Rechercher…');
  });

  it('garde la valeur retenue en filigrane pendant qu’on tape', () => {
    // Sans ça, ouvrir le champ efface sous les yeux ce qu'on venait remplacer.
    strictEqual(invitAffichee(AVEC_SENTINELLE, 'SEMATIC', true, 'Rechercher…'), 'SEMATIC');
  });

  it('garde une valeur hors catalogue telle quelle', () => {
    strictEqual(invitAffichee(AVEC_SENTINELLE, 'INCONNUE', true, 'Rechercher…'), 'INCONNUE');
  });

  it('rend l’invite ordinaire une fois le champ fermé', () => {
    // Fermé, c'est `contenuAffiche` qui montre la valeur : l'invite ne sert plus.
    strictEqual(invitAffichee(AVEC_SENTINELLE, 'SEMATIC', false, 'Rechercher…'), 'Rechercher…');
  });
});

describe('le libellé fourni par l’écran — recherche déléguée', () => {
  /* Les options ne sont que les résultats de la dernière frappe : la valeur
     retenue n'y est presque jamais. */
  const RESULTATS = [{ valeur: '17xA', libelle: 'FONCIA PARIS' }];

  it('montre le libellé fourni quand la valeur n’est pas dans les options', () => {
    strictEqual(contenuAffiche(RESULTATS, '17xB', false, '', 'NEXITY LYON'), 'NEXITY LYON');
  });

  it('le garde aussi en filigrane pendant qu’on tape', () => {
    strictEqual(invitAffichee(RESULTATS, '17xB', true, 'Rechercher…', 'NEXITY LYON'), 'NEXITY LYON');
  });

  it('préfère le libellé des options quand il y est', () => {
    strictEqual(contenuAffiche(RESULTATS, '17xA', false, '', 'ANCIEN NOM'), 'FONCIA PARIS');
  });

  it('retombe sur la valeur sans libellé fourni', () => {
    strictEqual(contenuAffiche(RESULTATS, '17xB', false, ''), '17xB');
  });
});

describe('messageVide', () => {
  it('dit « Recherche… » tant que la réponse n’est pas là', () => {
    strictEqual(messageVide(true, true), 'Recherche…');
  });

  it('dit qu’il n’y a rien une fois la réponse arrivée', () => {
    strictEqual(messageVide(true, false), 'Aucun choix ne correspond.');
  });

  it('ne dit jamais « Recherche… » quand la liste est filtrée sur place', () => {
    strictEqual(messageVide(false, true), 'Aucun choix ne correspond.');
  });
});
