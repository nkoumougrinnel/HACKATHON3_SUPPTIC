from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .utils import G, compute_route_astar

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

        if not start or not end:
            return Response({"error": "start et end requis"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            start = parse_coord(start)
            end = parse_coord(end)
            hour = int(hour)
            path = compute_route_astar(G, start, end, current_hour=hour, vehicle_type=vehicle_type)
            return Response({"path": path})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
