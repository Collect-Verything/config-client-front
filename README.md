# 🚀 Déploiement de l’application

Ce projet a pour objectif de remplacer l’étape de configuration de la boutique client présente dans le dépôt Collect-Verything/collect-verything-app.
L’idée est de simplifier la mise en place côté serveur pour des raisons de performance.

## ⚙️ Mode développement

Pour lancer l’application en mode développement avec Docker :

```bash
docker build --platform linux/amd64 -t my-app .
docker compose watch react-dev
```

---

## 🌐 Mode production

En production, le serveur dispose d’un fichier **docker-compose.yml** dans /home/root/my-app dédié à l’application, crée à la main pour le moment dans le but de gagner du temp, mais devrait etre versionné et dans le root

```yaml
version: "3.8"

services:
  frontend:
    image: cansefr/my-app:latest
    restart: always
    ports:
      - "80:3000"
```

Lors d’un **push sur la branche `main`**, une **GitHub Action** se déclenche et exécute automatiquement les commandes nécessaires sur le serveur pour :

* récupérer la dernière version de l’image Docker,
* (re)lancer le conteneur en mode production,
* garantir que l’application est disponible avec la bonne configuration.

👉 Résultat : le déploiement est **automatisé** via GitHub Actions et nécessite uniquement un push sur `main`.
Pour plus d'info regarder la doc **Déclenchement du Workflow GitHub** dans **curl-actions.md**

---

### 🔹 Gestion des variables sensibles

Toutes les valeurs sensibles (token, owner, repo) sont stockées dans un **fichier `.env`** :

```
VITE_APP_HOST=ipadresseclient
VITE_APP_GIT_OWNER=repo owner
VITE_APP_GIT_REPO=repo
VITE_APP_GIT_BEARER_PAT=pat token
```

Le frontend les lit via son système de variables d’environnement (`process.env`) et compose dynamiquement la requête.

---

👉 Avec ce système, le **client-config-front** agit comme une interface pour déclencher un **déploiement personnalisé** via GitHub Actions, sans jamais exposer les secrets en clair dans le code.
