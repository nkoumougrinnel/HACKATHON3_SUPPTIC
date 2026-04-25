import json
import networkx as nx
from math import sqrt
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent.parent / 'data'
YAOUNDE_ROADS_GEOJSON = DATA_DIR / "export.geojson"

def load_geojson():
    with open(YAOUNDE_ROADS_GEOJSON, "r", encoding="utf-8") as f:
        return json.load(f)

def calculate_distance(coord1, coord2):
    x1, y1 = coord1
    x2, y2 = coord2
    return sqrt((x2 - x1)**2 + (y2 - y1)**2)

def build_graph(geojson_data):
    G = nx.Graph()
    for feature in geojson_data.get("features", []):
        if feature["geometry"]["type"] != "LineString":
            continue
        coords = [tuple(pt) for pt in feature["geometry"]["coordinates"]]
        for i in range(len(coords) - 1):
            u, v = coords[i], coords[i+1]
            length = calculate_distance(u, v)
            G.add_edge(u, v, weight=length)
    return G

def get_nearest_node(G, coord):
    coord = tuple(coord)
    if coord in G:
        return coord
    best_node = None
    best_distance = float("inf")
    for node in G.nodes:
        if not isinstance(node, tuple):
            continue
        distance = calculate_distance(coord, node)
        if distance < best_distance:
            best_distance = distance
            best_node = node
    if best_node is None:
        raise ValueError("Aucun nœud voisin trouvé dans le graphe")
    return best_node


def compute_route_astar(G, start, end):
    source = get_nearest_node(G, start)
    target = get_nearest_node(G, end)
    return nx.astar_path(
        G,
        source=source,
        target=target,
        heuristic=lambda u, v: calculate_distance(u, v),
        weight="weight"
    )

geojson_data = load_geojson()
G = build_graph(geojson_data)