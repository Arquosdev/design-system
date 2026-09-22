'use client';

import * as React from 'react';
import { Dialog } from 'radix-ui';

import { cn } from '../_lib/cn';
import { boiteDessinee, type Boite } from './photo-viewer.logic';
import { Icon } from '../icon/icon.web';
import type { IconRole } from '../../src/icons';

export interface PhotoVue {
  /** Ce que la photo montre — sert de légende ET de texte alternatif. */
  nom: string;
  /** Absent = la photo n'existe pas ou n'est pas affichable. */
  url?: string;
  /** D'où elle vient : « Machinerie », « Schéma de mesure · A14 »… */
  zone?: string;
}

/**
 * Une action posée sur la photo regardée.
 *
 * La visionneuse ne sait rien faire d'autre que montrer : télécharger, ouvrir
 * ailleurs, signaler — tout cela appartient à l'écran qui l'ouvre. Il lui
 * passe donc ses actions, et elle leur rend la photo courante.
 *
 * **Trois au plus, en rangée.** La fiche écrivait d'abord « une seule, et au
 * jour où il en faudra deux, ce sera un menu » ; elle en a demandé deux le
 * 22/09/2026 — télécharger, ouvrir ailleurs — et le menu se révèle pire : il
 * cache derrière un clic deux gestes qui n'en demandent qu'un, sur un écran
 * qu'on a ouvert pour REGARDER. Deux picots parlent d'eux-mêmes. Au-delà de
 * trois, la rangée couvrirait la photo, et c'est alors que le menu gagne.
 */
export interface PhotoViewerAction {
  /**
   * Ce que l'action fait — « Agrandir », « Télécharger ».
   *
   * Le bouton n'en montre rien : il est en icône, posé sur la photo. Le
   * libellé est ce qu'un lecteur d'écran annonce et ce que l'infobulle
   * affiche. Il reste donc obligatoire : une icône seule ne se nomme pas.
   */
  libelle: string;
  /** Le dessin, par son rôle du vocabulaire — jamais par son nom Phosphor. */
  icone: IconRole;
  onAction: (photo: PhotoVue) => void;
}

export interface PhotoViewerProps {
  photos: readonly PhotoVue[];
  /** L'indice affiché. Piloté par l'appelant, pour qu'il sache où on en est. */
  index: number;
  onIndex: (index: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Vide ou absent = la visionneuse ne montre que la croix de fermeture. */
  actions?: readonly PhotoViewerAction[];
}

/**
 * La photo en grand, par-dessus la fiche.
 *
 * Construite sur la primitive Radix `Dialog` — la même base que le composant
 * Dialog de shadcn : elle apporte le piège à focus, la fermeture par Échap et
 * le masquage du reste de la page aux lecteurs d'écran, qu'on réécrirait mal.
 */
export function PhotoViewer({
  photos,
  index,
  onIndex,
  open,
  onOpenChange,
  actions,
}: PhotoViewerProps) {
  const nb = photos.length;
  const courante = photos[index];

  // Une URL qui ne charge pas retombe sur le cadre « photo indisponible ».
  // L'icône brisée du navigateur laisserait croire à une panne du module.
  const [cassees, setCassees] = React.useState<Record<string, true>>({});
  const url = courante?.url && !cassees[courante.url] ? courante.url : '';

  const deplacer = React.useCallback(
    (d: number) => nb > 1 && onIndex((index + d + nb) % nb),
    [index, nb, onIndex],
  );

  /**
   * La vignette d'où l'on vient, pour lui rendre le focus.
   *
   * Radix rend le focus à son `Dialog.Trigger` — et la visionneuse n'en a pas :
   * elle s'ouvre depuis n'importe laquelle de sept vignettes. Sans ça, le focus
   * retombe sur le corps de la page et la tabulation repart du rail.
   */
  const origine = React.useRef<HTMLElement | null>(null);

  /**
   * Où la photo est réellement dessinée dans son cadre.
   *
   * Le cadre ne colle pas à la photo, et aucune règle CSS ne l'y oblige : sa
   * largeur se calcule sur la taille naturelle de l'image, que le plafond de
   * hauteur ne corrige pas. Sur une photo debout — les trois quarts des photos
   * de relevé — le cadre reste large de toute l'image d'origine pendant qu'elle
   * s'affiche étroite, et un bouton posé dans son coin sort du cliché. Vu le
   * 21/09/2026.
   *
   * Deux écarts se cumulent, et aucun ne se devine :
   *   - l'élément est étiré par son cadre — mesuré à 760 × 801 pour une photo
   *     de 900 × 1600 le 21/09/2026 ;
   *   - `object-contain` y inscrit ensuite la photo et centre le reste.
   *
   * On mesure donc l'élément, puis on calcule ce qu'il dessine vraiment. Le
   * bouton étant en position absolue, il ne pèse sur aucun de ces calculs : la
   * mesure ne peut pas se mordre la queue.
   */
  const photoRef = React.useRef<HTMLImageElement | null>(null);
  const [boite, setBoite] = React.useState<Boite | null>(null);

  React.useLayoutEffect(() => {
    const img = photoRef.current;
    if (!img) {
      setBoite(null);
      return;
    }
    const mesurer = () =>
      setBoite(
        boiteDessinee(
          { l: img.offsetLeft, t: img.offsetTop, w: img.offsetWidth, h: img.offsetHeight },
          { w: img.naturalWidth, h: img.naturalHeight },
        ),
      );
    mesurer();
    // La fenêtre qu'on redimensionne, la photo suivante qui n'a pas le même
    // format : deux façons de bouger. La troisième — l'image qui finit de
    // charger — passe par `onLoad`, seul moment où ses dimensions naturelles
    // deviennent connues.
    const observateur = new ResizeObserver(mesurer);
    observateur.observe(img);
    return () => observateur.disconnect();
  }, [url, open]);

  if (!courante) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-(--arq-layer-plein-ecran) bg-brand/80" />
        <Dialog.Content
          // Le titre porte le nom de la photo : c'est ce qu'un lecteur d'écran
          // doit entendre en arrivant, pas le mot « visionneuse ».
          aria-describedby={undefined}
          // Radix n'a pas encore déplacé le focus quand cet événement part :
          // `activeElement`, c'est encore la vignette cliquée.
          onOpenAutoFocus={() => {
            origine.current = document.activeElement as HTMLElement | null;
          }}
          onCloseAutoFocus={(e) => {
            // Couper la reprise de Radix — elle viserait un `Trigger` absent —
            // et rendre le focus nous-mêmes.
            e.preventDefault();
            origine.current?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') deplacer(-1);
            if (e.key === 'ArrowRight') deplacer(1);
          }}
          className={cn(
            'fixed inset-0 z-(--arq-layer-plein-ecran) flex flex-col items-center justify-center gap-base p-lg',
            'outline-none',
          )}
        >
          {/* `flex-1 min-h-0` : la photo prend toute la hauteur que la légende
              lui laisse, au lieu d'un plafond fixe. Sur une photo verticale —
              cinquante-six des cinquante-sept d'un relevé — un plafond à 70 % de
              l'écran laissait une bande vide en haut et en bas pendant que la
              photo, elle, restait petite. */}
          <div className="flex min-h-0 max-w-full flex-1 items-center gap-base">
            {nb > 1 ? (
              <Fleche sens="prec" onClick={() => deplacer(-1)} />
            ) : null}

            {url ? (
              /* Le cadre donne au bouton un parent positionné. Il ne serre pas
                 la photo — c'est la mesure qui s'en charge, voir `boite`. Et on
                 n'y touche plus : lui donner `items-center` suffit à faire
                 tomber le plafond de hauteur de la photo, qui s'affiche alors
                 en pleine taille et déborde de l'écran. */
              <div className="relative flex max-h-full min-h-0">
                {/* eslint-disable-next-line @next/next/no-img-element -- photos
                    servies par un stockage externe, hors de l'optimiseur. */}
                <img
                  ref={photoRef}
                  src={url}
                  alt={courante.nom}
                  onError={() => setCassees((c) => ({ ...c, [url]: true }))}
                  onLoad={(e) =>
                    setBoite(
                      boiteDessinee(
                        {
                          l: e.currentTarget.offsetLeft,
                          t: e.currentTarget.offsetTop,
                          w: e.currentTarget.offsetWidth,
                          h: e.currentTarget.offsetHeight,
                        },
                        { w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight },
                      ),
                    )
                  }
                  // `contain` : ne rien rogner. Une photo de plaque de charge
                  // recadrée peut perdre le chiffre qu'on est venu lire.
                  className="max-h-full max-w-[76vw] rounded-md object-contain"
                />
                {actions?.length && boite ? (
                  <Rangee actions={actions} photo={courante} coin={boite} />
                ) : null}
              </div>
            ) : (
              // palette-brute-ok: plaque de remplacement posée sur le voile
              // sombre de la visionneuse. Aucune surface sémantique ne
              // convient — `bgMuted` disparaîtrait, `border` n'est pas un fond.
              <div className="flex h-full max-h-[500px] w-[76vw] max-w-[760px] items-center justify-center rounded-md bg-grey-200 px-lg text-center text-body text-text-muted">
                Photo indisponible — {courante.nom}
              </div>
            )}

            {nb > 1 ? <Fleche sens="suiv" onClick={() => deplacer(1)} /> : null}
          </div>

          <div className="max-w-[76vw] shrink-0 text-center text-text-on-dark">
            <Dialog.Title className="text-subhead font-semibold text-pretty">
              {courante.nom}
            </Dialog.Title>
            <p className="mt-xxs text-small opacity-75">
              {nb > 1 ? `${index + 1}/${nb}` : null}
              {nb > 1 && courante.zone ? ' · ' : null}
              {courante.zone}
            </p>
          </div>

          <Dialog.Close
            aria-label="Fermer"
            className={cn(
              'absolute top-base right-lg size-[36px] rounded-control bg-white/15 text-body text-text-on-dark',
              'outline-none hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white',
            )}
          >
            ✕
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/**
 * Les actions, posées dans le coin de la photo.
 *
 * Sur la photo et non dans l'en-tête : c'est l'objet qu'elles visent, et les
 * lire là évite de chercher le rapport entre un bouton lointain et ce qu'on
 * regarde. En bas à droite, parce qu'une photo de relevé porte son sujet au
 * centre et ses mentions en haut.
 *
 * Un fond plein, pas le blanc translucide des flèches : celles-ci se détachent
 * du voile sombre, ceux-ci se posent sur une photo dont on ne sait rien — du
 * ciel blanc comme une armoire noire.
 *
 * La rangée est ancrée par son coin bas-droit, donc elle POUSSE vers la
 * gauche : ajouter une action ne déplace pas celles qui étaient déjà là, et
 * l'œil qui a appris où cliquer ne le réapprend pas.
 *
 * Elles ne ferment pas la visionneuse : c'est à l'appelant de décider si son
 * action l'emporte sur ce qu'on était en train de regarder.
 */
function Rangee({
  actions,
  photo,
  coin,
}: {
  actions: readonly PhotoViewerAction[];
  photo: PhotoVue;
  /** La boîte dessinée par la photo, dans le cadre — mesurée, pas déduite. */
  coin: Boite;
}) {
  return (
    <div
      // Le coin bas-droit de la photo, puis on rentre la rangée à l'intérieur
      // d'une marge — la translation garde l'espacement en token.
      style={{ left: coin.l + coin.w, top: coin.t + coin.h }}
      className={cn(
        'absolute flex gap-sm',
        '-translate-x-[calc(100%+var(--spacing-sm))] -translate-y-[calc(100%+var(--spacing-sm))]',
      )}
    >
      {actions.map((action) => (
        <button
          key={action.libelle}
          type="button"
          onClick={() => action.onAction(photo)}
          aria-label={action.libelle}
          title={action.libelle}
          className={cn(
            'grid size-[40px] place-items-center',
            // Blanc et marine en dur, comme les flèches et la croix : la
            // visionneuse est toujours sur voile sombre, elle ne suit pas le
            // thème de la page. `bg-bg` aurait viré au sombre la nuit, et le
            // bouton se serait perdu sur une photo d'armoire.
            'rounded-full bg-white text-brand shadow-pop',
            'outline-none hover:bg-white/85 focus-visible:ring-2 focus-visible:ring-white',
          )}
        >
          <Icon role={action.icone} size="lg" />
        </button>
      ))}
    </div>
  );
}

function Fleche({ sens, onClick }: { sens: 'prec' | 'suiv'; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={sens === 'prec' ? 'Photo précédente' : 'Photo suivante'}
      className={cn(
        'size-[44px] shrink-0 rounded-control bg-white/15 text-subhead text-text-on-dark',
        'outline-none hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-white',
      )}
    >
      {sens === 'prec' ? '‹' : '›'}
    </button>
  );
}
