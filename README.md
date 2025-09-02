# 🚀 Déploiement de l’application

## ⚙️ Mode développement

Pour lancer l’application en mode développement avec Docker :

```bash
# Construire l’image (architecture AMD64)
docker build --platform linux/amd64 -t my-app .

# Lancer le service en mode "watch" (rechargement auto)
docker compose watch react-dev
```

---

## 🌐 Mode production

En production, le serveur dispose d’un fichier **compose.yaml** dédié à l’application.
Lors d’un **push sur la branche `main`**, une **GitHub Action** se déclenche et exécute automatiquement les commandes nécessaires sur le serveur pour :

* récupérer la dernière version de l’image Docker,
* (re)lancer le conteneur en mode production,
* garantir que l’application est disponible avec la bonne configuration.

👉 Résultat : le déploiement est **automatisé** via GitHub Actions et nécessite uniquement un push sur `main`.

---

## 🛰️ Déclenchement du Workflow GitHub

En plus du déploiement auto via `main`, il est possible de déclencher manuellement un **workflow GitHub Actions** à partir de ce projet (client-config-front).
Cela se fait via l’API REST GitHub, endpoint :

```
POST https://api.github.com/repos/<owner>/<repo>/dispatches
```

### 🔹 Exemple de requête

```bash
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_PAT" \
  https://api.github.com/repos/<owner>/<repo>/dispatches \
  -d '{
    "event_type": "deploy-site",
    "client_payload": {
      "primary": "#f542c2",
      "secondary": "#fcba03",
      "titreSite": "titretest",
      "user": "usertest"
    }
  }'
```

### 🔹 Composition de la requête

* `Authorization: Bearer $GITHUB_PAT` → **token GitHub (PAT)**.

    * Ce token doit être **fine-grained**, avec permissions :

        * `Actions: Read and write`
        * `Contents: Read and write`
    * Il est stocké dans les variables d’environnement (`env`) pour éviter toute fuite dans le code.

* `https://api.github.com/repos/<owner>/<repo>/dispatches`

    * `<owner>` → l’organisation ou le compte GitHub (`Collect-Verything` par ex.).
    * `<repo>` → le nom du repo qui contient le workflow (`produits-cms-ui` par ex.).

* `event_type` → correspond au nom de l’événement attendu dans le workflow (`on: repository_dispatch: types: [deploy-site]`).

* `client_payload` → données envoyées au workflow (variables dynamiques pour le build : couleurs, titre, user, etc.).

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
