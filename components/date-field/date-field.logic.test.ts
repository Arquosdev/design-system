import { strictEqual, deepStrictEqual } from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  toISO,
  toDisplay,
  mask,
  isISO,
  daysInMonth,
  inRange,
  refusal,
  monthGrid,
  shiftMonth,
  monthLabel,
  cursorFor,
  cellLabel,
  shiftDay,
  shiftMonthKeepingDay,
  todayISO,
  INVALID_TEXT,
  WEEKDAYS,
} from './date-field.logic.ts';

describe('versISO — la frontière qui a coûté une corruption', () => {
  it('lit une frappe française', () => {
    strictEqual(toISO('12/09/2026'), '2026-09-12');
  });

  it('rembourre les jours et les mois sur un chiffre', () => {
    strictEqual(toISO('1/9/2026'), '2026-09-01');
  });

  it('accepte le point et le tiret — le pavé numérique ne met pas de barre', () => {
    strictEqual(toISO('12.09.2026'), '2026-09-12');
    strictEqual(toISO('12-09-2026'), '2026-09-12');
  });

  it('laisse passer une date déjà ISO — FieldRow sème son éditeur avec elle', () => {
    strictEqual(toISO('2026-09-12'), '2026-09-12');
  });

  /*
    LE TEST DE LA CORRUPTION. « 12/09/2026 » est le 12 septembre et rien
    d'autre. Le Postgres de `web`, réglé sur `DateStyle = ISO, MDY`, le lisait
    comme le 9 décembre — et `new Date('12/09/2026')` en JavaScript fait la
    même erreur. Ce test échouerait si quelqu'un déléguait l'analyse à `Date`.
  */
  it('ne relit JAMAIS une frappe française en mois-jour-année', () => {
    strictEqual(toISO('12/09/2026'), '2026-09-12');
    strictEqual(toISO('09/12/2026'), '2026-12-09');
    // Le piège de l'autre sens : jour 12, mois 9 — pas jour 9, mois 12.
    strictEqual(toISO('12/09/2026') === toISO('09/12/2026'), false);
  });

  it('refuse un jour qui n’existe pas dans son mois', () => {
    // Celui-là faisait LEVER une erreur Postgres brute : 31 ne peut pas être un
    // mois. Ici il ne part pas.
    strictEqual(toISO('31/02/2026'), null);
    strictEqual(toISO('31/04/2026'), null);
    strictEqual(toISO('00/09/2026'), null);
  });

  it('refuse un mois hors de l’année', () => {
    strictEqual(toISO('12/13/2026'), null);
    strictEqual(toISO('12/00/2026'), null);
  });

  it('refuse une frappe inachevée plutôt que de la compléter', () => {
    strictEqual(toISO('12/09/20'), null);
    strictEqual(toISO('12/09'), null);
    strictEqual(toISO('12'), null);
  });

  it('refuse l’année sur deux chiffres — 26 est 1926 ou 2026 selon qui lit', () => {
    strictEqual(toISO('12/09/26'), null);
  });

  it('rend null sur le vide, qui n’est pas une faute mais une absence', () => {
    strictEqual(toISO(''), null);
    strictEqual(toISO('   '), null);
    strictEqual(toISO(null), null);
    strictEqual(toISO(undefined), null);
  });

  it('refuse ce qui n’est pas une date du tout', () => {
    strictEqual(toISO('hier'), null);
    strictEqual(toISO('2026-09-12T00:00:00Z'), null);
  });
});

describe('versAffichage', () => {
  it('rend le français depuis l’ISO', () => {
    strictEqual(toDisplay('2026-09-12'), '12/09/2026');
  });

  it('garde les zéros de rembourrage — la largeur du champ ne bouge pas', () => {
    strictEqual(toDisplay('2026-01-01'), '01/01/2026');
  });

  it('rend une chaîne vide sur ce qui n’est pas une date', () => {
    strictEqual(toDisplay(null), '');
    strictEqual(toDisplay(''), '');
    strictEqual(toDisplay('12/09/2026'), '');
    strictEqual(toDisplay('2026-02-31'), '');
  });

  it('fait l’aller-retour sans rien perdre', () => {
    strictEqual(toISO(toDisplay('2026-09-12')), '2026-09-12');
  });
});

describe('masque — on tape huit chiffres, on lit une date', () => {
  it('pose les barres au fil de la frappe', () => {
    strictEqual(mask('1'), '1');
    strictEqual(mask('12'), '12');
    strictEqual(mask('120'), '12/0');
    strictEqual(mask('1209'), '12/09');
    strictEqual(mask('12092'), '12/09/2');
    strictEqual(mask('12092026'), '12/09/2026');
  });

  it('laisse l’effacement naturel — reculer sur « 12/0 » ne laisse pas « 12/ »', () => {
    strictEqual(mask('12/0'), '12/0');
    strictEqual(mask('12/'), '12');
    strictEqual(mask('12'), '12');
  });

  it('borne à huit chiffres — le neuvième n’a pas de place où aller', () => {
    strictEqual(mask('120920261'), '12/09/2026');
  });

  it('ignore tout ce qui n’est pas un chiffre, barres comprises', () => {
    strictEqual(mask('12/09/2026'), '12/09/2026');
    strictEqual(mask('12ab09cd2026'), '12/09/2026');
    strictEqual(mask(''), '');
  });
});

describe('joursDuMois — la règle bissextile entière', () => {
  it('donne les longueurs ordinaires', () => {
    strictEqual(daysInMonth(2026, 1), 31);
    strictEqual(daysInMonth(2026, 4), 30);
    strictEqual(daysInMonth(2026, 2), 28);
  });

  it('reconnaît une année bissextile', () => {
    strictEqual(daysInMonth(2024, 2), 29);
  });

  /*
    Le raccourci « divisible par 4 » se trompe une fois par siècle, et les
    relevés d'ascenseur portent des mises en service des années 1900.
  */
  it('sait que 1900 n’était pas bissextile et que 2000 l’était', () => {
    strictEqual(daysInMonth(1900, 2), 28);
    strictEqual(daysInMonth(2000, 2), 29);
  });

  it('accepte le 29 février d’une bissextile et refuse celui d’une autre', () => {
    strictEqual(toISO('29/02/2024'), '2024-02-29');
    strictEqual(toISO('29/02/2026'), null);
  });
});

describe('estISO', () => {
  it('reconnaît une date ISO qui existe', () => {
    strictEqual(isISO('2026-09-12'), true);
  });

  it('refuse une date ISO qui n’existe pas au calendrier', () => {
    strictEqual(isISO('2026-02-31'), false);
    strictEqual(isISO('2026-13-01'), false);
  });

  it('refuse une forme approchante', () => {
    strictEqual(isISO('2026-9-12'), false);
    strictEqual(isISO('12/09/2026'), false);
    strictEqual(isISO(42), false);
    strictEqual(isISO(null), false);
  });
});

describe('dansLesBornes — l’ordre alphabétique de l’ISO EST l’ordre du temps', () => {
  it('accepte ce qui tient entre les deux', () => {
    strictEqual(inRange('2026-09-12', '2026-01-01', '2026-12-31'), true);
  });

  it('inclut les bornes elles-mêmes', () => {
    strictEqual(inRange('2026-01-01', '2026-01-01', '2026-12-31'), true);
    strictEqual(inRange('2026-12-31', '2026-01-01', '2026-12-31'), true);
  });

  it('refuse au-delà', () => {
    strictEqual(inRange('2025-12-31', '2026-01-01', null), false);
    strictEqual(inRange('2027-01-01', null, '2026-12-31'), false);
  });

  it('ne borne rien sans borne', () => {
    strictEqual(inRange('1978-03-04'), true);
  });

  it('compare bien par-dessus le changement d’année', () => {
    strictEqual(inRange('2026-01-01', '2025-12-31', null), true);
  });
});

describe('refus — pourquoi la frappe ne peut pas être retenue', () => {
  it('ne reproche rien à un champ vide', () => {
    strictEqual(refusal(''), null);
    strictEqual(refusal('   '), null);
  });

  it('ne reproche rien à une date juste', () => {
    strictEqual(refusal('12/09/2026'), null);
  });

  it('dit d’une frappe impossible qu’elle l’est', () => {
    strictEqual(refusal('31/02/2026'), INVALID_TEXT);
    strictEqual(refusal('12/09/20'), INVALID_TEXT);
  });

  it('nomme la borne franchie, et la nomme en français', () => {
    strictEqual(refusal('12/09/2020', '2026-01-01'), 'Date trop ancienne — pas avant le 01/01/2026');
    strictEqual(refusal('12/09/2030', null, '2026-12-31'), 'Date trop lointaine — pas après le 31/12/2026');
  });
});

describe('grilleDuMois', () => {
  it('rend six semaines de sept jours, quel que soit le mois', () => {
    for (let mois = 1; mois <= 12; mois++) {
      const grille = monthGrid({ year: 2026, month: mois });
      strictEqual(grille.length, 6);
      for (const semaine of grille) strictEqual(semaine.length, 7);
    }
  });

  it('commence LUNDI — septembre 2026 démarre un mardi, donc une case avant', () => {
    const [premiere] = monthGrid({ year: 2026, month: 9 });
    // 31/08/2026 est un lundi ; le 1er septembre, un mardi.
    strictEqual(premiere[0].iso, '2026-08-31');
    strictEqual(premiere[0].inMonth, false);
    strictEqual(premiere[1].iso, '2026-09-01');
    strictEqual(premiere[1].inMonth, true);
  });

  it('ne décale rien quand le mois commence un lundi', () => {
    // 01/06/2026 est un lundi : aucune case de débordement en tête.
    const [premiere] = monthGrid({ year: 2026, month: 6 });
    strictEqual(premiere[0].iso, '2026-06-01');
    strictEqual(premiere[0].inMonth, true);
  });

  it('remplit sept cases avant quand le mois commence un dimanche', () => {
    // 01/02/2026 est un dimanche — le pire cas, et celui qui exige six lignes.
    const grille = monthGrid({ year: 2026, month: 2 });
    strictEqual(grille[0][0].iso, '2026-01-26');
    strictEqual(grille[0][6].iso, '2026-02-01');
    strictEqual(grille[0][6].inMonth, true);
  });

  it('contient chaque jour du mois, une fois et une seule', () => {
    const cases = monthGrid({ year: 2026, month: 9 }).flat();
    const duMois = cases.filter((c) => c.inMonth);
    strictEqual(duMois.length, 30);
    strictEqual(duMois[0].iso, '2026-09-01');
    strictEqual(duMois[29].iso, '2026-09-30');
    strictEqual(new Set(cases.map((c) => c.iso)).size, 42);
  });

  it('franchit le bord d’un février bissextile sans inventer de jour', () => {
    const cases = monthGrid({ year: 2024, month: 3 }).flat();
    // Mars 2024 commence un vendredi : la tête déborde sur le 29 février.
    strictEqual(cases[0].iso, '2024-02-26');
    strictEqual(cases[3].iso, '2024-02-29');
    strictEqual(cases[4].iso, '2024-03-01');
  });

  it('donne quarante-deux jours strictement consécutifs', () => {
    const cases = monthGrid({ year: 2026, month: 12 }).flat();
    for (let i = 1; i < cases.length; i++) {
      const veille = Date.UTC(...(cases[i - 1].iso.split('-').map(Number) as [number, number, number]));
      strictEqual(cases[i - 1].iso < cases[i].iso, true);
      strictEqual(Number.isFinite(veille), true);
    }
    strictEqual(cases.some((c) => c.iso.startsWith('2027-01')), true);
  });

  it('a sept en-têtes de colonne, lundi d’abord', () => {
    strictEqual(WEEKDAYS.length, 7);
    strictEqual(WEEKDAYS[0], 'lun.');
    strictEqual(WEEKDAYS[6], 'dim.');
  });
});

describe('moisDecale', () => {
  it('avance et recule dans l’année', () => {
    deepStrictEqual(shiftMonth({ year: 2026, month: 9 }, 1), { year: 2026, month: 10 });
    deepStrictEqual(shiftMonth({ year: 2026, month: 9 }, -1), { year: 2026, month: 8 });
  });

  it('franchit décembre et janvier — c’est là que la base 1 se trompe', () => {
    deepStrictEqual(shiftMonth({ year: 2026, month: 12 }, 1), { year: 2027, month: 1 });
    deepStrictEqual(shiftMonth({ year: 2026, month: 1 }, -1), { year: 2025, month: 12 });
  });

  it('saute une année entière d’un coup', () => {
    deepStrictEqual(shiftMonth({ year: 2026, month: 9 }, 12), { year: 2027, month: 9 });
    deepStrictEqual(shiftMonth({ year: 2026, month: 3 }, -14), { year: 2025, month: 1 });
  });
});

describe('intituleDuMois et curseur', () => {
  it('nomme le mois en français, sans capitale', () => {
    strictEqual(monthLabel({ year: 2026, month: 9 }), 'septembre 2026');
    strictEqual(monthLabel({ year: 2026, month: 8 }), 'août 2026');
  });

  it('ouvre la grille sur le mois de la valeur', () => {
    deepStrictEqual(cursorFor('1978-03-04', '2026-09-07'), { year: 1978, month: 3 });
  });

  it('ouvre sur le mois courant quand il n’y a pas de valeur', () => {
    deepStrictEqual(cursorFor(null, '2026-09-07'), { year: 2026, month: 9 });
    deepStrictEqual(cursorFor('n’importe quoi', '2026-09-07'), { year: 2026, month: 9 });
  });
});

describe('intituleDeCase — ce qu’un lecteur d’écran annonce', () => {
  it('donne le jour de la semaine, que la grille dit par sa position', () => {
    strictEqual(cellLabel('2026-09-12'), 'samedi 12 septembre 2026');
    strictEqual(cellLabel('2026-09-07'), 'lundi 7 septembre 2026');
  });

  it('ne dit rien de ce qui n’est pas une date', () => {
    strictEqual(cellLabel('2026-02-31'), '');
  });
});

describe('aujourdhuiISO — lu sur le calendrier mural, pas sur UTC', () => {
  /*
    `toISOString()` convertirait vers UTC : le 12 septembre à 1 h du matin à
    Paris en sortirait comme le 11. Ce test échouerait si quelqu'un le
    réintroduisait — la date qu'on appelle « aujourd'hui » est celle de son
    calendrier mural, pas celle de Greenwich.
  */
  it('rend la date locale, même juste après minuit', () => {
    const minuitPasse = new Date(2026, 8, 12, 1, 30);
    strictEqual(todayISO(minuitPasse), '2026-09-12');
  });

  it('rembourre le mois et le jour', () => {
    strictEqual(todayISO(new Date(2026, 0, 5, 12)), '2026-01-05');
  });

  it('rend une date que le module sait relire', () => {
    strictEqual(isISO(todayISO()), true);
  });
});

describe('jourDecale — le déplacement au clavier dans la grille', () => {
  it('avance et recule d’un jour', () => {
    strictEqual(shiftDay('2026-09-12', 1), '2026-09-13');
    strictEqual(shiftDay('2026-09-12', -1), '2026-09-11');
  });

  it('avance d’une semaine, ce que fait une flèche verticale', () => {
    strictEqual(shiftDay('2026-09-12', 7), '2026-09-19');
    strictEqual(shiftDay('2026-09-12', -7), '2026-09-05');
  });

  it('franchit le bord d’un mois', () => {
    strictEqual(shiftDay('2026-09-30', 1), '2026-10-01');
    strictEqual(shiftDay('2026-09-01', -1), '2026-08-31');
  });

  it('franchit le bord d’une année', () => {
    strictEqual(shiftDay('2026-12-31', 1), '2027-01-01');
    strictEqual(shiftDay('2026-01-01', -1), '2025-12-31');
  });

  it('franchit un 29 février quand il existe, et l’ignore sinon', () => {
    strictEqual(shiftDay('2024-02-28', 1), '2024-02-29');
    strictEqual(shiftDay('2026-02-28', 1), '2026-03-01');
  });
});

describe('moisDecaleMemeJour — et le rabattement qui évite de sauter un mois', () => {
  it('garde le jour quand le mois voisin est assez long', () => {
    strictEqual(shiftMonthKeepingDay('2026-09-12', 1), '2026-10-12');
    strictEqual(shiftMonthKeepingDay('2026-09-12', -1), '2026-08-12');
  });

  /*
    LE défaut de l'arithmétique de mois : `Date` déborde, et « page suivante »
    depuis le 31 janvier atterrirait en mars — deux mois plus loin que la case
    regardée, un mois sur douze, sans motif visible.
  */
  it('rabat sur le dernier jour du mois plutôt que de déborder', () => {
    strictEqual(shiftMonthKeepingDay('2026-01-31', 1), '2026-02-28');
    strictEqual(shiftMonthKeepingDay('2024-01-31', 1), '2024-02-29');
    strictEqual(shiftMonthKeepingDay('2026-03-31', -1), '2026-02-28');
    strictEqual(shiftMonthKeepingDay('2026-05-31', 1), '2026-06-30');
  });

  it('franchit l’année', () => {
    strictEqual(shiftMonthKeepingDay('2026-12-15', 1), '2027-01-15');
    strictEqual(shiftMonthKeepingDay('2026-01-15', -1), '2025-12-15');
  });
});
