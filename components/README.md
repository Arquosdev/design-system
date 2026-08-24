# Composants

> Index généré par `npm run catalog` — ne pas éditer à la main.
> La source de chaque ligne est l'en-tête de la fiche du composant.

Chaque composant vit dans son dossier, avec sa fiche (`*.spec.md`) et une
implémentation par plateforme (`*.web.tsx`, `*.native.tsx`).

🖥️ web · 📱 mobile

| Composant | Rôle | Plateformes | Statut |
| --- | --- | --- | --- |
| _(aucun pour l'instant)_ | | | |

## Ajouter un composant

1. Copier `_TEMPLATE.spec.md` dans `components/<nom>/<nom>.spec.md` et le remplir.
2. Écrire `<nom>.web.tsx` et/ou `<nom>.native.tsx` — uniquement les plateformes déclarées.
3. `npm run catalog` pour régénérer cet index et `dist/catalog.json`.
