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
