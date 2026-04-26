from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .utils import G, compute_route_astar, block_road, unblock_road

def parse_coord(coord_str):
    if isinstance(coord_str, list):
        return coord_str
    if isinstance(coord_str, str):
        parts = coord_str.split(',')
        return [float(p.strip()) for p in parts]
    return coord_str

class RouteView(APIView):
    def post(self, request):
        start = request.data.get("start") or request.GET.get("start")
        end = request.data.get("end") or request.GET.get("end")
        hour = request.data.get("hour") or request.GET.get("hour", 12)
        vehicle_type = request.data.get("vehicle_type") or request.GET.get("vehicle_type", "ambulance")
        rain = request.data.get("rain", False)
        current_pos = request.data.get("current_position")

        if not start or not end:
            return Response({"error": "start et end requis"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            start = parse_coord(start)
            end = parse_coord(end)
            hour = int(hour)
            
            # Convertir current_pos s'il est fourni
            if current_pos:
                current_pos = parse_coord(current_pos)
            
            path = compute_route_astar(
                G, 
                start, 
                end, 
                current_hour=hour, 
                vehicle_type=vehicle_type,
                rain=rain,
                current_pos=current_pos
            )
            return Response({"path": path})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class BlockRoadView(APIView):
    def post(self, request):
        """Signale une route bloquée (barrage)"""
        try:
            start = request.data.get("start")
            end = request.data.get("end")
            
            if not start or not end:
                return Response(
                    {"error": "start et end requis pour bloquer une route"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            start = parse_coord(start)
            end = parse_coord(end)
            
            block_road(start, end)
            return Response({"status": "blocked", "start": start, "end": end})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UnblockRoadView(APIView):
    def post(self, request):
        """Débloque une route"""
        try:
            start = request.data.get("start")
            end = request.data.get("end")
            
            if not start or not end:
                return Response(
                    {"error": "start et end requis pour débloquer une route"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            start = parse_coord(start)
            end = parse_coord(end)
            
            unblock_road(start, end)
            return Response({"status": "unblocked", "start": start, "end": end})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
