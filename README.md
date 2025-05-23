# Application de Gestion de Notes
Cette application web permet de créer, modifier, supprimer et rechercher des notes, avec une interface moderne et une gestion persistante via `localStorage`.

## Fichiers

- `index.html` : Structure HTML de l'application.
- `style.css` : Feuilles de style pour l'apparence de l'application.
- `script.js` : Code JavaScript pour la logique de gestion des notes.

## Fonctionnalités

- Créer une nouvelle note (titre + contenu).
-     Modifier une note existante avec confirmation.
-  Supprimer une note avec confirmation.
-  Rechercher des notes par titre ou contenu.
- Filtrer les notes selon leur date de modification :
  - Toutes les dates
  - Cette semaine
  - Ce mois
-  Persistance automatique dans `localStorage`.

## Technologies utilisées

- HTML5
- CSS3
- JavaScript (vanilla)
- `localStorage` pour la sauvegarde des données

## Instructions d'utilisation

1. **Télécharger le projet**:
   - Clone ou télécharge le dossier contenant les fichiers.

2. **Ouvrir l'application** :
   - Lance le fichier `index.html` dans ton navigateur.

3. **Utilisation** :
   - Remplis le formulaire pour créer une note.
     - Utilise les boutons `Modifier` et `Supprimer` sur chaque note.
   - Recherche une note dans la barre de recherche.
   - Applique un filtre de date si nécessaire.

## Arborescence

├── index.html
├── style.css
├── script.js
└── README.md

## Remarques

- Les données sont stockées localement dans le navigateur. Aucune base de données externe n’est nécessaire.
-  Fonctionne sans connexion internet une fois chargé.
- Le design est responsive pour une expérience correcte sur mobile et desktop.
