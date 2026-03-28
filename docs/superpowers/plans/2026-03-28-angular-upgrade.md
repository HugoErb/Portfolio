# Angular 17 → 21 Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrer le frontend Angular 17 vers Angular 21 en 4 sauts progressifs, sans modifier les fonctionnalités ni le design.

**Architecture:** Migration progressive via `ng update` à chaque version majeure. Chaque saut applique les codemods automatiques d'Angular, met à jour TypeScript, et fait passer le build avant de continuer. Le design (DaisyUI 4, Tailwind 3) et la logique applicative restent intacts.

**Tech Stack:** Angular CLI, npm, TypeScript, zone.js, @angular/build (esbuild)

---

## Fichiers concernés

| Fichier | Changement attendu |
|---------|-------------------|
| `frontend/package.json` | Versions Angular, TypeScript, zone.js mises à jour à chaque saut |
| `frontend/angular.json` | Builder migré de `@angular-devkit/build-angular:browser` vers `@angular/build:application` |
| `frontend/tsconfig.json` | `moduleResolution` peut passer de `node` à `bundler` |
| `frontend/src/app/app.config.ts` | `provideAnimations()` peut être migré automatiquement |
| `frontend/src/main.ts` | Potentiellement mis à jour par les codemods |

---

## Task 1 : Créer la branche de migration

**Files:**
- Aucun fichier modifié — opération git uniquement

- [ ] **Step 1 : Créer et basculer sur la branche**

```bash
cd "c:\Projets\Portfolio"
git checkout -b upgrade/angular-21
```

Expected: `Switched to a new branch 'upgrade/angular-21'`

- [ ] **Step 2 : Vérifier la branche**

```bash
git branch
```

Expected: `* upgrade/angular-21` est marquée active

- [ ] **Step 3 : Commit de départ**

```bash
git commit --allow-empty -m "chore: start Angular 17→21 migration branch"
```

---

## Task 2 : Migration Angular 17 → 18

**Files:**
- Modify: `frontend/package.json`
- Modify: `frontend/angular.json` (possible)
- Modify: `frontend/tsconfig.json` (possible)

- [ ] **Step 1 : Vérifier l'état du workspace**

```bash
cd "c:\Projets\Portfolio\frontend"
npm outdated
```

- [ ] **Step 2 : Lancer la migration Angular 18**

```bash
cd "c:\Projets\Portfolio\frontend"
npx ng update @angular/core@18 @angular/cli@18 --allow-dirty
```

Expected : Les codemods s'exécutent automatiquement. La commande liste les packages mis à jour et applique les migrations. Si elle demande confirmation, répondre `y`.

Si une erreur de peer dependency apparaît, utiliser :
```bash
npx ng update @angular/core@18 @angular/cli@18 --allow-dirty --force
```

- [ ] **Step 3 : Vérifier les versions dans package.json**

Ouvrir `frontend/package.json` et confirmer :
- `@angular/core`: `^18.x.x`
- `@angular/cli`: `^18.x.x`
- `typescript`: `~5.4.x`

- [ ] **Step 4 : Installer les dépendances**

```bash
cd "c:\Projets\Portfolio\frontend"
npm install
```

Expected: `added/updated X packages`

- [ ] **Step 5 : Vérifier que le build passe**

```bash
cd "c:\Projets\Portfolio\frontend"
npx ng build --configuration development
```

Expected: `Build at: ... - Hash: ... - Time: ...ms` sans erreur.

Si des erreurs de compilation TypeScript apparaissent, les corriger avant de continuer (voir section Résolution d'erreurs courantes en bas du plan).

- [ ] **Step 6 : Commit**

```bash
cd "c:\Projets\Portfolio"
git add frontend/package.json frontend/package-lock.json frontend/angular.json frontend/tsconfig.json frontend/src
git commit -m "chore: upgrade Angular 17 to 18"
```

---

## Task 3 : Migration Angular 18 → 19

**Files:**
- Modify: `frontend/package.json`
- Modify: `frontend/angular.json` (builder peut migrer vers `@angular/build:application`)
- Modify: `frontend/src/app/app.config.ts` (possible codemod)

- [ ] **Step 1 : Lancer la migration Angular 19**

```bash
cd "c:\Projets\Portfolio\frontend"
npx ng update @angular/core@19 @angular/cli@19 --allow-dirty
```

Expected : Codemods appliqués. Angular 19 peut migrer le builder de `@angular-devkit/build-angular:browser` vers `@angular/build:application` (esbuild). L'`angular.json` sera modifié automatiquement.

Si erreur peer dep :
```bash
npx ng update @angular/core@19 @angular/cli@19 --allow-dirty --force
```

- [ ] **Step 2 : Vérifier package.json**

Confirmer dans `frontend/package.json` :
- `@angular/core`: `^19.x.x`
- `typescript`: `~5.6.x`
- `@angular/build` ou `@angular-devkit/build-angular`: `^19.x.x`

- [ ] **Step 3 : Vérifier angular.json si le builder a migré**

Si le builder a changé pour `@angular/build:application`, le `angular.json` ressemblera à ceci (vérification, pas modification manuelle) :

```json
"build": {
    "builder": "@angular/build:application",
    "options": {
        "outputPath": "dist/portfolio",
        "index": "src/index.html",
        "browser": "src/main.ts",
        "polyfills": ["zone.js"],
        "tsConfig": "tsconfig.app.json",
        "inlineStyleLanguage": "scss",
        "assets": ["src/favicon.ico", "src/assets"],
        "styles": ["src/styles.scss"],
        "scripts": ["node_modules/iconify-icon/dist/iconify-icon.min.js"]
    }
}
```

Note : l'option `main` devient `browser`, et les options webpack (`aot`, `buildOptimizer`, `vendorChunk`, `namedChunks`) sont supprimées — c'est normal.

- [ ] **Step 4 : Installer les dépendances**

```bash
cd "c:\Projets\Portfolio\frontend"
npm install
```

- [ ] **Step 5 : Vérifier que le build passe**

```bash
cd "c:\Projets\Portfolio\frontend"
npx ng build --configuration development
```

Expected: Build sans erreur. L'output esbuild est plus rapide que webpack.

- [ ] **Step 6 : Commit**

```bash
cd "c:\Projets\Portfolio"
git add frontend/package.json frontend/package-lock.json frontend/angular.json frontend/tsconfig.json frontend/src
git commit -m "chore: upgrade Angular 18 to 19"
```

---

## Task 4 : Migration Angular 19 → 20

**Files:**
- Modify: `frontend/package.json`
- Modify: `frontend/tsconfig.json` (possible)

- [ ] **Step 1 : Lancer la migration Angular 20**

```bash
cd "c:\Projets\Portfolio\frontend"
npx ng update @angular/core@20 @angular/cli@20 --allow-dirty
```

Expected : Codemods appliqués. Consulter `https://update.angular.io/?v=19.0-20.0` pour les breaking changes éventuels si la commande échoue.

Si erreur peer dep :
```bash
npx ng update @angular/core@20 @angular/cli@20 --allow-dirty --force
```

- [ ] **Step 2 : Vérifier package.json**

Confirmer dans `frontend/package.json` :
- `@angular/core`: `^20.x.x`
- `typescript`: version compatible listée dans les peer deps de `@angular/core@20`

- [ ] **Step 3 : Installer les dépendances**

```bash
cd "c:\Projets\Portfolio\frontend"
npm install
```

- [ ] **Step 4 : Vérifier que le build passe**

```bash
cd "c:\Projets\Portfolio\frontend"
npx ng build --configuration development
```

Expected: Build sans erreur.

- [ ] **Step 5 : Commit**

```bash
cd "c:\Projets\Portfolio"
git add frontend/package.json frontend/package-lock.json frontend/angular.json frontend/tsconfig.json frontend/src
git commit -m "chore: upgrade Angular 19 to 20"
```

---

## Task 5 : Migration Angular 20 → 21

**Files:**
- Modify: `frontend/package.json`
- Modify: `frontend/tsconfig.json` (possible)

- [ ] **Step 1 : Lancer la migration Angular 21**

```bash
cd "c:\Projets\Portfolio\frontend"
npx ng update @angular/core@21 @angular/cli@21 --allow-dirty
```

Expected : Codemods appliqués. Consulter `https://update.angular.io/?v=20.0-21.0` pour les breaking changes éventuels si la commande échoue.

Si erreur peer dep :
```bash
npx ng update @angular/core@21 @angular/cli@21 --allow-dirty --force
```

- [ ] **Step 2 : Vérifier package.json**

Confirmer dans `frontend/package.json` :
- `@angular/core`: `^21.x.x`
- `@angular/cli`: `^21.x.x`

- [ ] **Step 3 : Installer les dépendances**

```bash
cd "c:\Projets\Portfolio\frontend"
npm install
```

- [ ] **Step 4 : Vérifier que le build passe**

```bash
cd "c:\Projets\Portfolio\frontend"
npx ng build --configuration development
```

Expected: Build sans erreur.

- [ ] **Step 5 : Vérifier le build de production**

```bash
cd "c:\Projets\Portfolio\frontend"
npx ng build --configuration production
```

Expected: Build de production sans erreur ni dépassement de budget.

- [ ] **Step 6 : Commit final**

```bash
cd "c:\Projets\Portfolio"
git add frontend/package.json frontend/package-lock.json frontend/angular.json frontend/tsconfig.json frontend/src
git commit -m "chore: upgrade Angular 20 to 21"
```

---

## Task 6 : Vérification finale

**Files:**
- Aucune modification — vérifications uniquement

- [ ] **Step 1 : Confirmer la version finale**

```bash
cd "c:\Projets\Portfolio\frontend"
npx ng version
```

Expected: `Angular CLI: 21.x.x`, `Angular: 21.x.x`

- [ ] **Step 2 : Lancer le serveur de dev et vérifier visuellement**

```bash
cd "c:\Projets\Portfolio\frontend"
npx ng serve
```

Ouvrir `http://localhost:4200` et vérifier :
- Le design est identique à avant (Tailwind, DaisyUI, styles)
- La navigation entre pages fonctionne
- Le formulaire de contact fonctionne (si testé en local avec le backend)
- Aucune erreur dans la console du navigateur

- [ ] **Step 3 : Résumé des changements**

```bash
cd "c:\Projets\Portfolio"
git log upgrade/angular-21 --oneline
```

Expected : 4-5 commits de migration + le commit de départ.

---

## Résolution d'erreurs courantes

### Erreur : propriété inconnue dans angular.json
`ng update` supprime les options webpack obsolètes (`aot`, `buildOptimizer`, `vendorChunk`, `namedChunks`) lors de la migration vers `@angular/build:application`. Si elles restent et causent une erreur, les supprimer manuellement dans `angular.json`.

### Erreur TypeScript : `moduleResolution`
Si une erreur indique que `moduleResolution: "node"` est incompatible, changer dans `frontend/tsconfig.json` :
```json
"moduleResolution": "bundler"
```

### Erreur : `src/test.ts` ou `src/polyfills.ts` introuvables
Ces fichiers sont référencés dans la config test de l'`angular.json` mais n'existent pas. Supprimer les références dans `angular.json` sous `architect.test.options` :
- Supprimer `"main": "src/test.ts"`
- Supprimer `"polyfills": "src/polyfills.ts"`

### Erreur : peer dependency `@angular-devkit/build-angular`
Si ce package reste en v17 après `ng update`, le mettre à jour manuellement :
```bash
npm install @angular-devkit/build-angular@<version-cible> --save-dev
```

### Avertissement : `provideAnimations` déprécié
Si `ng update` ne migre pas automatiquement `app.config.ts`, remplacer dans `frontend/src/app/app.config.ts` :
```typescript
// Avant
import { provideAnimations } from '@angular/platform-browser/animations';
// ...
providers: [provideRouter(routes), provideHttpClient(), provideAnimations()]

// Après
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// ...
providers: [provideRouter(routes), provideHttpClient(), provideAnimationsAsync()]
```
