# Crafty

Crafty est un service de microblogging minimal écrit en TypeScript avec NestJS. Il permet de publier et modifier des messages, de suivre d’autres utilisateurs et de consulter un fil personnel ou un mur regroupant les publications des comptes suivis.

Le dépôt est organisé en monorepo NestJS : une bibliothèque applicative partagée alimente une API HTTP et une interface en ligne de commande (CLI). Les cas d’usage sont séparés des adaptateurs de transport et de persistance.

## Fonctionnalités

- Publier un message au nom d’un utilisateur.
- Modifier le texte d’un message existant.
- Suivre un autre utilisateur.
- Consulter le fil d’un utilisateur.
- Consulter son mur, qui rassemble ses messages et ceux des utilisateurs suivis.
- Trier les messages affichés du plus récent au plus ancien.
- Valider le texte des messages : il ne peut pas être vide (ou composé uniquement d’espaces) et sa longueur maximale est de 200 caractères.

## Technologies

- **Node.js et TypeScript**
- **NestJS** pour le découpage en modules et l’injection de dépendances
- **Fastify** comme serveur HTTP de l’API
- **PostgreSQL** et **Prisma** pour la persistance configurée par défaut
- **nest-commander** pour les commandes CLI
- **Jest** et **Testcontainers** pour les tests

## Architecture

```text
apps/
  api/                 API HTTP NestJS
  cli/                 Commandes en ligne de commande
libs/
  crafty/
    src/
      domain/          Modèle métier (messages et fils)
      application/     Contrats et cas d’usage
      infra/           Adaptateurs de persistance et Prisma
```

La bibliothèque `libs/crafty` contient le domaine et les cas d’usage indépendants des interfaces : publier, modifier, suivre, consulter un fil et consulter un mur. Les interfaces de dépôt et de présentation sont définies côté application. Les applications `api` et `cli` partagent ces cas d’usage et fournissent leurs propres contrôleurs ou commandes et présentateurs.

Les adaptateurs configurés dans les modules de l’API et de la CLI utilisent Prisma. Le projet contient également des dépôts en mémoire et des dépôts basés sur des fichiers, notamment utilisés pour isoler ou tester les comportements.

## API HTTP

L’API utilise le port `3000` par défaut. Elle expose les routes suivantes :

| Méthode | Route | Entrée |
| --- | --- | --- |
| `POST` | `/post` | JSON : `{"user":"alice","message":"Bonjour !"}` |
| `POST` | `/edit` | JSON : `{"user":"alice","messageId":"123","message":"Texte modifié"}` |
| `POST` | `/follow` | JSON : `{"user":"alice","followee":"bob"}` |
| `GET` | `/view?user=alice` | Nom de l’utilisateur à afficher |
| `GET` | `/wall?user=alice` | Nom de l’utilisateur dont on veut consulter le mur |

Les routes `/view` et `/wall` renvoient une liste de messages contenant leur identifiant, auteur, texte et date de publication. Les routes de publication, modification et suivi attendent des données JSON.

Exemple :

```sh
curl -X POST http://localhost:3000/post \
  -H 'Content-Type: application/json' \
  -d '{"user":"alice","message":"Bonjour tout le monde !"}'

curl 'http://localhost:3000/view?user=alice'
```

## CLI

La CLI propose les commandes `post`, `edit`, `follow`, `view` et `wall`. Les formes d’utilisation prévues sont :

```text
post <utilisateur> <message>
edit <utilisateur> <identifiant-du-message> <nouveau-message>
follow <utilisateur> <utilisateur-à-suivre>
view <utilisateur>
wall <utilisateur>
```

Entourez d’un argument les textes comportant des espaces, par exemple `"Bonjour tout le monde !"`.

## Prérequis et configuration

- Node.js compatible avec les dépendances du projet et npm
- Une instance PostgreSQL accessible
- Une variable d’environnement `DATABASE_URL` contenant l’URL de connexion PostgreSQL

Exemple de forme pour `DATABASE_URL` (à adapter à votre environnement) :

```text
postgresql://utilisateur:mot-de-passe@localhost:5432/crafty
```

Le schéma Prisma se trouve dans [`libs/crafty/src/infra/prisma/schema.prisma`](libs/crafty/src/infra/prisma/schema.prisma). Le schéma déclare les utilisateurs, leurs relations d’abonnement et les messages. Les migrations sont conservées dans le dossier voisin `migrations`.

## Installation et lancement

```sh
npm install
npx prisma generate
npx prisma migrate deploy
```

Construire l’ensemble des applications et démarrer l’API en mode développement :

```sh
npm run build
npm run start:api
```

L’API écoute sur le port `3000` par défaut. Le projet expose aussi les scripts `build:api` et `build:cli` pour construire chaque application séparément.

## Tests et qualité

```sh
npm test
npm run test:e2e
npm run test:cov
```

Les tests unitaires couvrent les cas d’usage et le domaine ; des tests d’intégration vérifient les dépôts de persistance, notamment ceux basés sur Prisma et le système de fichiers. Des tests end-to-end et leurs configurations sont présents pour l’API et la CLI.

Le script `format` applique Prettier aux fichiers TypeScript des applications et bibliothèques. Le script `lint` lance Oxlint sur les chemins configurés dans `package.json`.