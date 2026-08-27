import * as React from 'react';

import tokens from '../dist/tokens.json';

/**
 * Les outils communs aux pages de fondations.
 *
 * Toutes lisent `dist/tokens.json`, qui est GÉNÉRÉ depuis `src/*.ts` et dont la
 * CI refuse la divergence : ce que la vitrine montre est donc, par
 * construction, ce que les applications emploient. Une planche recopiée à la
 * main aurait menti au premier changement de teinte.
 */
export type Token = { $value: string; $description?: string };
type Groupe = Record<string, Token>;

/* `tokens.json` mêle des groupes et deux clés de tête (`$schema`,
   `$description`) : on passe par `unknown` plutôt que de décrire une forme que
   le générateur pourrait enrichir demain. */
const table = tokens as unknown as Record<string, Groupe>;

export const group = (name: string): [string, Token][] =>
  Object.entries(table[name] ?? {}).filter(([id]) => !id.startsWith('$'));

/** Ce que le générateur a écrit en tête d'un groupe — sa raison d'être. */
export const propos = (name: string): string | undefined =>
  (table[name] as unknown as { $description?: string })?.$description;

/** Une rampe de la palette : `palette.blue` porte ses neuf nuances. */
export const rampe = (name: string): [string, Token][] => {
  const p = (table.palette as unknown as Record<string, Groupe>)?.[name];
  return p ? Object.entries(p).filter(([id]) => !id.startsWith('$')) : [];
};

/** L'en-tête d'une page de fondation : ce que c'est, et ce que ça engage. */
export function Fondation({
  title,
  what,
  children,
}: {
  title: string;
  what: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[980px] p-xl">
      <header className="mb-xl border-b border-border-soft pb-lg">
        <h1 className="text-title font-bold tracking-tight text-text">{title}</h1>
        <p className="mt-sm max-w-[68ch] text-pretty text-body text-text-muted">{what}</p>
      </header>
      {children}
    </div>
  );
}

/** Une section à l'intérieur d'une fondation. */
export function Section({
  title,
  what,
  children,
}: {
  title: string;
  what?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-2xl last:mb-0">
      <h2 className="text-subhead font-semibold text-text">{title}</h2>
      {what ? (
        <p className="mt-xs mb-base max-w-[68ch] text-pretty text-small text-text-muted">{what}</p>
      ) : (
        <div className="mb-base" />
      )}
      {children}
    </section>
  );
}
