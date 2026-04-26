import json
import networkx as nx
from math import sqrt, radians, cos, sin, asin
from pathlib import Path
import pandas as pd
from scipy.spatial import cKDTree
import threading
import time

DATA_DIR = Path(__file__).resolve().parent.parent.parent / 'data'
YAOUNDE_ROADS_GEOJSON = DATA_DIR / "export.geojson"
TRAFFIC_CSV = DATA_DIR / "traffic_by_segment_hour.csv"

def load_geojson():
    with open(YAOUNDE_ROADS_GEOJSON, "r", encoding="utf-8") as f:
        return json.load(f)

def load_traffic():
    df = pd.read_csv(TRAFFIC_CSV)
    df.columns = df.columns.str.strip()  # Supprimer les espaces des noms de colonnes
    df['road_id'] = df['road_id'].astype(int)
    df['hour'] = df['hour'].astype(int)
    df['road_type'] = df['road_type'].astype(str).str.strip()
    df['passable_ambulance'] = df['passable_ambulance'].astype(str).str.strip().str.lower()
    df['passable_firetruck'] = df['passable_firetruck'].astype(str).str.strip().str.lower()
    df['rain'] = df['rain'].astype(str).str.strip().str.lower()
    df.set_index(['road_id', 'hour'], inplace=True)
    return df

def haversine_distance(coord1, coord2):
    """Calcule la distance en km entre deux coordonnées (lon, lat) en degrés"""
    lon1, lat1 = coord1
    lon2, lat2 = coord2
    
    # Convertir en radians
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    
    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    r = 6371  # Rayon de la Terre en km
    return c * r

def parse_road_id(feature):
    raw = feature.get('id') or feature.get('properties', {}).get('@id') or feature.get('properties', {}).get('id')
    if raw is None:
        return None
    if isinstance(raw, str) and '/' in raw:
        raw = raw.rsplit('/', 1)[-1]
    try:
        return int(raw)
    except (ValueError, TypeError):
        return None

def build_graph(geojson_data):
    """Construit le graphe avec pré-calcul des longueurs en km"""
    G = nx.Graph()
    edge_id = 0
    for feature in geojson_data.get("features", []):
        if feature["geometry"]["type"] != "LineString":
            continue
        coords = [tuple(pt) for pt in feature["geometry"]["coordinates"]]
        road_type = feature["properties"].get("highway", "unknown").strip()
        ref = feature["properties"].get("ref", "unknown")
        road_id = parse_road_id(feature)
        surface = feature["properties"].get("surface", "").strip().lower()
        unpaved = surface in {'unpaved', 'gravel', 'dirt', 'ground', 'grass'}
        
        for i in range(len(coords) - 1):
            u, v = coords[i], coords[i+1]
            length_km = haversine_distance(u, v)
            G.add_edge(
                u,
                v,
                weight_km=length_km,
                road_type=road_type,
                road_id=road_id,
                surface=surface,
                unpaved=unpaved,
                ref=ref,
                edge_id=edge_id,
                weight=length_km  # Poids initial en km
            )
            edge_id += 1
    return G

def get_traffic_data(traffic_df, road_id, road_type, hour):
    """Récupère les données de trafic pour un segment via road_id puis road_type"""
    default = {
        'avg_speed_kmh': 50.0,
        'travel_time_multiplier': 1.0,
        'congestion_level': 0.0,
        'passable_ambulance': 'oui',
        'passable_firetruck': 'oui',
        'rain': 'non'
    }

    if road_id is not None:
        try:
            row = traffic_df.loc[(road_id, hour)]
            if isinstance(row, pd.DataFrame):
                row = row.iloc[0]
            return row.to_dict()
        except KeyError:
            pass

    return default

def get_weight_dynamic(weight_km, traffic_data, vehicle_type):
    """Calcule le poids dynamique en secondes basé sur traffic_data"""
    if weight_km == float('inf'):
        return float('inf')
    
    base_time_hours = weight_km / traffic_data['avg_speed_kmh']
    time_hours = base_time_hours * traffic_data['travel_time_multiplier']

    # Pénalité pluie
    if traffic_data.get('rain') == 'oui':
        time_hours *= 1.2

    # Congestion extrême
    if traffic_data.get('congestion_level', 0) > 0.8:
        time_hours *= 10  # très pénalisant

    # Passabilité du véhicule
    passable_col = f'passable_{vehicle_type}'
    if traffic_data.get(passable_col) == 'non':
        return float('inf')

    return time_hours * 3600  # convertir en secondes

class WeightCache:
    """Cache global des poids, mis à jour toutes les 5 minutes"""
    def __init__(self, G, traffic_df):
        self.G = G
        self.traffic_df = traffic_df
        self.current_hour = None
        self.current_vehicle_type = None
        self.last_update = 0
        self.lock = threading.Lock()
        self.cache = {}  # cache des poids
        self.update_interval = 300  # 5 minutes en secondes

    def should_update(self, hour, vehicle_type):
        """Vérifie si on doit recalculer les poids"""
        current_time = time.time()
        return (
            self.current_hour != hour or
            self.current_vehicle_type != vehicle_type or
            (current_time - self.last_update) > self.update_interval
        )

    def _do_update(self, hour, vehicle_type):
        self.cache.clear()
        self.current_hour = hour
        self.current_vehicle_type = vehicle_type
        self.last_update = time.time()

        try:
            hour_slice = self.traffic_df.xs(hour, level='hour')
            traffic_by_road = hour_slice.to_dict(orient='index')
        except KeyError:
            traffic_by_road = {}

        for u, v, edge_data in self.G.edges(data=True):
            road_id = edge_data.get('road_id')
            traffic_data = traffic_by_road.get(road_id)
            if traffic_data is None:
                traffic_data = get_traffic_data(self.traffic_df, road_id, edge_data.get('road_type'), hour)
            weight = get_weight_dynamic(edge_data['weight_km'], traffic_data, vehicle_type)
            self.G[u][v]['weight'] = weight
            self.cache[(u, v)] = weight

    def update(self, hour, vehicle_type):
        with self.lock:
            self._do_update(hour, vehicle_type)

    def ensure_updated(self, hour, vehicle_type):
        if self.should_update(hour, vehicle_type):
            with self.lock:
                if self.should_update(hour, vehicle_type):
                    self._do_update(hour, vehicle_type)

    def get_weight(self, u, v, hour, vehicle_type):
        """Récupère le poids d'une arête, avec mise à jour si nécessaire"""
        self.ensure_updated(hour, vehicle_type)
        with self.lock:
            return self.cache.get((u, v), self.G.get_edge_data(u, v, {}).get('weight', float('inf')))


class KDTreeIndex:
    """Index spatial KD-Tree pour recherche rapide de nœuds"""
    def __init__(self, G):
        nodes = list(G.nodes())
        coords = [node for node in nodes if isinstance(node, tuple) and len(node) == 2]
        if not coords:
            raise ValueError("Aucun nœud avec coordonnées valides")
        self.nodes = coords
        self.tree = cKDTree(coords)
        self.G = G

    def nearest(self, coord, k=1):
        """Trouve le nœud le plus proche"""
        distances, indices = self.tree.query([coord], k=k)
        if k == 1:
            idx = indices[0][0] if isinstance(indices[0], (list, tuple)) else indices[0]
            return self.nodes[idx]
        else:
            return [self.nodes[i] for i in indices[0]]


def get_nearest_node(G, kdtree, coord):
    """Récupère le nœud le plus proche avec KD-Tree"""
    coord = tuple(coord)
    if coord in G:
        return coord
    try:
        return kdtree.nearest(coord)
    except Exception:
        raise ValueError("Aucun nœud voisin trouvé dans le graphe")

def compute_route_astar(G, start, end, current_hour=12, vehicle_type='ambulance'):
    """Calcule le chemin optimal avec A* et poids dynamiques"""
    _weight_cache.ensure_updated(current_hour, vehicle_type)

    # Trouver les nœuds les plus proches
    source = get_nearest_node(G, _kdtree, start)
    target = get_nearest_node(G, _kdtree, end)

    # Heuristique : distance géodésique / vitesse max (50 km/h) en secondes
    def heuristic(u, v):
        return haversine_distance(u, v) / 50 * 3600

    return nx.astar_path(
        G,
        source=source,
        target=target,
        heuristic=heuristic,
        weight="weight"
    )

# Initialisation globale
geojson_data = load_geojson()
G = build_graph(geojson_data)
traffic_df = load_traffic()
_weight_cache = WeightCache(G, traffic_df)
_kdtree = KDTreeIndex(G)