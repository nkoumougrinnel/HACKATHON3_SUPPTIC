# État actuel du système de routage

## Backend routage

### `backend/routes/utils.py`

- **Chargement des données** :
  - Routes depuis `data/export.geojson` (via `json`)
  - Trafic depuis `data/traffic_by_segment_hour.csv` (via `pandas`)
  - Points d'intérêt depuis `data/points_interet.json`

- **Construction du graphe** :
  - Utilisation de `networkx.Graph`
  - Nœuds : coordonnées des intersections et points d'intérêt
  - Arêtes : segments routiers avec poids dynamiques

- **Calcul des poids** :
  - Base : distance euclidienne entre nœuds
  - Dynamique : multiplication par `travel_time_multiplier` selon `hour` et `road_id`/`road_type`

### `backend/routes/views.py`

- **Vue Django REST** : `RouteView`
- **Endpoint** : `/api/route/`
- **Paramètres** :
  - `start` : point de départ (coordonnées `lon,lat` ou ID POI)
  - `end` : point d'arrivée (coordonnées `lon,lat` ou ID POI)
  - `hour` : heure (optionnel, défaut 12)
- **Retour** :
  - `path` : liste de coordonnées `[lon, lat]`
  - `geojson` : objet GeoJSON Feature avec LineString

## Validation

- ✅ Import et construction du graphe réussis
- ✅ Test simulé d'une requête `RouteView` : `200 OK`
- ✅ Chemin retourné avec coordonnées valides
- ✅ Serveur Django fonctionnel sur `http://localhost:8000`
- ✅ API testée avec succès via HTTP
- ✅ **Optimisations appliquées** :
  - KD-Tree pour recherches spatiales (1000x plus rapide)
  - Suppression de la copie du graphe à chaque requête
  - Thread-safety avec `threading.Lock()`
  - Nettoyage automatique des nœuds temporaires

## Performances mesurées

### KD-Tree Benchmark

- **Recherche spatiale** : 0.0001s (vs 0.1s avant = **1000x plus rapide**)
- **Graphe** : 166k nœuds, 174k arêtes

### API Performance

- **Routes courtes** (proches) : ~0.05s ✅
- **Routes longues** (distantes) : timeout >30s ❌

### Diagnostic

- ✅ **Recherches spatiales optimisées** (KD-Tree)
- ✅ **Pas de copie de graphe** à chaque requête
- ❌ **Algorithme de plus court chemin** trop lent sur longues distances
- Le graphe de 166k nœuds est trop dense pour Dijkstra standard sur de grandes distances

## Comment tester avec Postman

1. **Ou créer une requête manuellement** :
   - Méthode: `GET`
   - URL: `http://localhost:8000/api/route/`
   - Paramètres:
     - `start`: coordonnées de départ (ex: `11.4843848,3.7945939`)
     - `end`: coordonnées d'arrivée (ex: `11.4908024,3.7945223`)
     - `hour`: heure (optionnel, défaut 12)

2. **Exemple de réponse** :
```json
{
  "path": [
    [11.4843848, 3.7945939],
    [11.484442, 3.7945915],
    ...
  ],
  "geojson": {
    "type": "Feature",
    "geometry": {
      "type": "LineString",
      "coordinates": [...]
    }
  }
}
```

## Ce qui reste à faire

- **Priorité haute** : Optimiser l'algorithme de plus court chemin pour les longues distances
  - Considérer A* au lieu de Dijkstra
  - Ou pré-calculer des chemins fréquents
  - Ou réduire la densité du graphe
- Documenter précisément le format `start/end` accepté
- Ajouter des filtres pour hôpitaux/casernes comme destinations prédéfinies
- Améliorer la gestion des points hors réseau routier existant

## Résumé
Le backend de routage est **implémenté et testé** à un niveau de base fonctionnel.
