/*
  Le calcul du ColorField, sans React : ce que le test rejoue tel quel.

  Une couleur entre et sort en HEX `#RRGGBB`, majuscules. À l'intérieur, le
  sélecteur travaille en TSV (teinte, saturation, valeur) : c'est l'espace où la
  zone de couleur et la barre de teinte se lisent directement.
*/

export type Tsv = { t: number; s: number; v: number };

const HEX = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i;

/** Un code lisible en `#RRGGBB`, ou `null`. Accepte « 0d5ab7 », « #0D5AB7 », « #08f ». */
export function normaliser(saisie: string): string | null {
  const m = saisie.trim().match(HEX);
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
  return `#${h.toUpperCase()}`;
}

const borne = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

export function versRvb(hex: string): [number, number, number] {
  const h = (normaliser(hex) ?? '#000000').slice(1);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

export function versTsv(hex: string): Tsv {
  const [r, g, b] = versRvb(hex).map((c) => c / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let t = 0;
  if (d) {
    if (max === r) t = ((g - b) / d) % 6;
    else if (max === g) t = (b - r) / d + 2;
    else t = (r - g) / d + 4;
    t *= 60;
    if (t < 0) t += 360;
  }
  return { t, s: max === 0 ? 0 : d / max, v: max };
}

export function versHex({ t, s, v }: Tsv): string {
  const tt = ((t % 360) + 360) % 360, ss = borne(s), vv = borne(v);
  const c = vv * ss, x = c * (1 - Math.abs(((tt / 60) % 2) - 1)), m = vv - c;
  const [r, g, b] = tt < 60 ? [c, x, 0] : tt < 120 ? [x, c, 0] : tt < 180 ? [0, c, x]
    : tt < 240 ? [0, x, c] : tt < 300 ? [x, 0, c] : [c, 0, x];
  return '#' + [r, g, b].map((n) => Math.round((n + m) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
}

/** Le contraste WCAG entre deux couleurs, de 1 à 21. */
export function contraste(a: string, b: string): number {
  const lum = (hex: string) => {
    const [r, g, bb] = versRvb(hex).map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bb;
  };
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/** Un texte blanc se lit-il sur cette couleur ? Le seuil AA d'un texte courant, 4,5. */
export const blancLisible = (hex: string) => contraste(hex, '#FFFFFF') >= 4.5;

/**
 * Les couleurs proposées d'emblée : des teintes de marque courantes, toutes
 * assez foncées pour porter un texte blanc (vérifié par le test). Un portail
 * qui part d'une d'elles est lisible sans y penser.
 */
export const SUGGESTIONS: readonly string[] = [
  '#0D5AB7', '#1D4ED8', '#0F766E', '#15803D', '#B45309',
  '#B91C1C', '#BE185D', '#7E22CE', '#4338CA', '#334155',
];
