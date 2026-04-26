from django.urls import path
from .views import RouteView, BlockRoadView, UnblockRoadView

urlpatterns = [
    path('route/', RouteView.as_view(), name='route'),
    path('block/', BlockRoadView.as_view(), name='block_road'),
    path('unblock/', UnblockRoadView.as_view(), name='unblock_road'),
]