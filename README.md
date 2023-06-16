# Facturation

## Contexte

J'ai commencé à travailler à mon compte en tant que "auto-entrepreneur" dans le domaine du développement informatique. J'ai rapidement compris que je vais avoir besoin d'un système me permettant de suivre, sur le plan économique, la santé de mon activité et de pouvoir facturer mes clients tout en limitant les erreurs éventuelles de ma personne. Des solutions sur Internet m'ont été présentés mais je préfére un système qui m'appartient où je peux ajouter ou modifier des fonctionnalités qui répondent à mon besoin. L'autre motif de ce système est que ça me fait un plus value.

Ce système est donc avant tout fait pour moi.

## Installation

### Dépendances symfony

A la racine du projet Symfony
```bash
    composer install
```

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
    sass index.scss index.css
```