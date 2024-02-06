# Facturation

## Contexte

J'ai commencé à travailler à mon compte en tant qu'auto-entrepreneur dans le domaine du développement informatique. J'ai rapidement compris que je vais avoir besoin d'un système me permettant de suivre, sur le plan économique, la santé de mon activité et de pouvoir facturer mes clients tout en limitant les erreurs éventuelles de ma personne. Des solutions sur Internet m'ont été présentés mais je préfère un système qui m'appartient où je peux ajouter ou modifier des fonctionnalités qui répondent à mon besoin. L'autre motif de ce système est que ça me fasse une plus-value.

Ce système est donc avant tout fait pour moi et pour moi.

## Installation

### Dépendances symfony

A la racine du projet Symfony
```bash
    composer install
```

### Compilation du projet React

A la racine du projet et si `yarn` est installé :
```bash
    yarn build
```

La commande va compilé tous le répertoire `assets` (la partie front de l'application (js et sass), fait en React) et créer un sous-dossier `build` dans le dossier `public`.

### Base de données

Si la base de données n'est pas créer
```bash
    symfony console doctrine:database:create
```

Ensuite, une fois la BDD créer, il faut maintenant générer les migrations s'il ne sont pas déjà générer. Par défault, les fichiers de migrations sont stockés dans le répertoire `migrations` à la racine du projet Symfony.
```bash
    symfony console m:migration
```

Une fois les fichiers de migration générer, il faut les executer. Pour faire cela, il faut aller à la racine du projet Symfony, puis executer la commande suivante :
```bash
    symfony console doctrine:migration:migrate
```

## Authentification

Une fois que la dépendance a été ajouté, il faudra maintenant générer une clé. Cette clé sera ensuite utilisé pour générer les token qui seront envoyer aux utilisateurs de la plateforme. Voici la commande pour générer ces clés :
```bash
    php bin/console lexik:jwt:generate-keypair
```

Une fois la commande ci-dessus lancée, elle va créer un sous-dossier jwt dans le dossier config. Dans ce sous-dossier, on aura 2 fichiers, ces 2 fichiers sont les clés privés et publics qui seront utlisé dans les actions de génération du token. A ce niveau, on a rien de plus.

Il faudra maintenant configurer le fichier `packages/security.yaml`. Je recommande d'utiliser la doc de symfony pour configurer la connexion par token ou de regarder la configuration dans mes autres projets utilisant cette méthode de connexion

<a href="https://symfony.com/bundles/LexikJWTAuthenticationBundle/current/index.html" target="_blank">LexikJWTAuthenticationBundle</a>

## Commandes utiles

Voici ci-joint les commandes qui débloque quand le besoin ce présente

### Github

IF you have NOT pushed your changes to remote
```bash
    git reset HEAD~1
```

ELSE you have pushed your changes to remote
```bash
    git revert HEAD
```

Quick setup create a new repository on the command line

```bash
    echo "# <GitHub-Repository>" >> README.md
    git init
    git add README.md
    git commit -m "first commit"
    git branch -M main
    git remote add origin https://github.com/GaryDelgadoDeAlmeida/<GitHub-Repository>.git
    git push -u origin main
```

…or push an existing repository from the command line
```bash
    git remote add origin https://github.com/GaryDelgadoDeAlmeida/<GitHub-Repository>.git
    git branch -M main
    git push -u origin main
```

### SASS

Compile a SASS file into a CSS file
```bash
    sass --style compressed ./public/assets/sass/index.scss ./public/assets/build/index.css
```

### Générer un mot de passe hashé
```bash
symfony console security:hash-password
```

### Mettre à jour la version de Symfony

Dans le composer.json, dans toutes les dépendances de symfony (toutes celles qui commence par `symfony/*`), changer la version. A l'heure où j'écris ce message, la version actuelle de mon projet Symfony est la LTS `5.4`. Je vais la mettre à jour la version vers la `6.4`. Une fois changer toutes les dépendances commançant par `symfony/*`, il faut appliquer la modification sur tout le projet, pour ce faire, il faudra éxecuter la commande suivant :
```bash
composer update "symfony/*" --with-all-dependencies
```

Si une erreur est rencontrée, il faudra supprimer manuellement le cache et relancer la commande. De mon côté, c'est la seule erreur rencontrée.