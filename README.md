# O'kanban - Tests & déploiement

## Architecture

L'application O'kanban est une application de gestion de projet en mode *Single Page Application* (SPA) découpée en deux projets :

- un serveur d'API REST, dans le répertoire `api`
- une application client Web, dans le répertoire `client`.

L'application `api` utilise principalement les technologies suivantes :

- base de données [PostgreSQL](https://www.postgresql.org/)
- serveur Web [Express](http://expressjs.com/)
- bibliothèque de validation de données [joi](https://joi.dev/)
- ORM [Sequelize](https://sequelize.org/)

L'application `client` utilise principalement :

- des fichiers statiques (HTML, CSS, JavaScript)
- le bundler [Vite](https://vitejs.dev/)

## Installation

- préparer une base de données pour stocker les données du projet
- `npm install`
  - note : à la fin de l'installation des dépendances backend, se lancera automatiquement le script NPM `postinstall` qui lui installe les dépendances du dossier `client`.
- dans les projets `api` et `client` : `cp .env.example .env`
  - penser à modifier ce qui doit l'être !
- à la première installation :
  - `npm run db:create` : créer la structure de la base de données
  - `npm run db:seed` : insérer des données
- si besoin de réinitialiser la base de données : `npm run db:reset`

## Mode developpement

Dans **deux terminaux** séparés :

- `npm run dev:back`
- `npm run dev:front`

## Mode production

### Production front

- `cd client`
- `npm run build`
  - pour créer le bundle front

- `npm run preview`
  - pour lancer le front en mode production

### Production back

- `cd api`
- `npm run start`
  - pour lancer le back en mode prod
