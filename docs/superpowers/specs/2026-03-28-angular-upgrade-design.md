# Design : Migration Angular 17 → 21

**Date :** 2026-03-28
**Branche :** `upgrade/angular-21`
**Base :** `fix/code-audit`

## Contexte

Le projet Portfolio est une application Angular 17 (standalone components) avec :
- Frontend : Angular 17, TypeScript 5.2, Tailwind CSS 3, DaisyUI 4, RxJS 7.8, zone.js 0.14, sweetalert2, iconify-icon
- Builder actuel : `@angular-devkit/build-angular:browser` (webpack)
- Style : SCSS

Objectif : monter à Angular 21 en conservant strictement les fonctionnalités et le design existants.

## Approche

Migration progressive étape par étape via `ng update`, en suivant le chemin officiel Angular.

## Chemin de migration

| Étape | Commande | TypeScript cible |
|-------|----------|-----------------|
| 1 | `ng update @angular/core@18 @angular/cli@18` | ~5.4 |
| 2 | `ng update @angular/core@19 @angular/cli@19` | ~5.6 |
| 3 | `ng update @angular/core@20 @angular/cli@20` | ~5.7 |
| 4 | `ng update @angular/core@21 @angular/cli@21` | ~5.8+ |

À chaque étape, `ng update` applique les codemods automatiques puis le build est vérifié avant de continuer.

## Changements attendus

### Automatiques (via ng update)
- Builder : `@angular-devkit/build-angular:browser` (webpack) → `@angular/build:application` (esbuild)
- TypeScript mis à jour à chaque saut de version
- zone.js mis à jour en peer dependency
- `@angular-devkit/build-angular` progressivement remplacé par `@angular/build`

### Manuels potentiels
- `provideAnimations()` si déprécié/supprimé dans une version intermédiaire
- Correction des erreurs de compilation après chaque saut si les codemods ne couvrent pas tout

## Ce qui ne change pas

- DaisyUI 4 et Tailwind CSS 3 — conservés (design préservé)
- RxJS 7.8 — compatible Angular 21
- sweetalert2, iconify-icon — inchangés
- Toute la logique applicative (composants, services, routes)

## Critères de succès

- `ng build` passe sans erreur sur Angular 21
- L'application affiche correctement la même interface qu'avant
- Aucune fonctionnalité régression
