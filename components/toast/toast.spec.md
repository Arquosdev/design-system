---
name: Toast
status: beta
layer: generique
role: Annoncer sans quitter la page ce qui vient de réussir ou d'échouer.
keywords: [toast, notification, message, annonce, confirmation, echec, bandeau]
platforms: [web]
replaces:
  web: [public/fiche/index.html — this.toast() / this.toastErreur()]
---

# Toast

Bandeau passager en bas d'écran. Construit sur la primitive Radix `Toast` —
déjà présente dans le paquet `radix-ui` du design system — plutôt que sur
`sonner`, que shadcn recommande aujourd'hui : `sonner` ajouterait une
dépendance et son thème propre pour un bandeau dont on maîtrise déjà l'aspect.

## Quand l'utiliser

- **Un enregistrement refusé** que l'utilisateur doit apprendre tout de suite, parce que sa saisie vient de disparaître sous ses yeux.
- **Une action sans effet visible** : un envoi vers l'hôte, une copie, un document poussé au téléchargement.

## Quand NE PAS l'utiliser

- **Pour l'état d'un enregistrement en cours sur une ligne** → la prop `save` de `FieldRow`. Le retour appartient à la ligne éditée, pas au bas de l'écran : un bandeau ne dit pas *quel* champ a échoué.
- **Pour une erreur qui empêche d'utiliser l'écran** → l'état d'erreur plein cadre. Un toast disparaît ; une impasse doit rester.
- **Pour une confirmation destructrice** → une boîte de dialogue. Un toast informe, il ne demande rien.

## Props

### `ToastProvider`

| Prop       | Type              | Défaut | Rôle                          |
| ---------- | ----------------- | ------ | ----------------------------- |
| `children` | `React.ReactNode` | —      | L'écran qu'il enveloppe       |

Il porte le contexte **et** la zone d'affichage. À monter une seule fois, au
plus haut de l'écran.

### `useToast()`

| Retour     | Type                                                     | Rôle                     |
| ---------- | -------------------------------------------------------- | ------------------------ |
| `announce` | `(message: string, options?: { tone?: ToastTone }) => void` | Publier un message       |

`ToastTone` vaut `'info'` (défaut) ou `'error'`.

## Exemples

```tsx
import { ToastProvider, useToast } from '@arquos/design-system/web';

// Une fois, autour de l'écran :
<ToastProvider>
  <Fiche />
</ToastProvider>;

// Partout dessous :
const { announce } = useToast();
announce('Document poussé vers le téléchargement.');
announce("La correction n'a pas pu être enregistrée.", { tone: 'error' });
```

## États

- **info** : 2,2 s. Une confirmation se lit d'un œil.
- **echec** : 12 s. Un refus doit être lu — six fois plus longtemps, comme dans
  le module actuel.
- **Empilement** : trois messages au plus, le plus ancien s'efface. Au-delà, la
  pile couvre ce qui vient d'être corrigé.

## Accessibilité

- `error` interrompt le lecteur d'écran (`type="foreground"`), `info` attend qu'il ait fini (`type="background"`).
- Le bandeau se ferme au clavier ; Radix pose le raccourci F6 vers la zone.
- La zone d'affichage ne capte pas les clics — seuls les bandeaux le font.
