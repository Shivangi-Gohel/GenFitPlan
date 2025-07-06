from django.urls import path
from .views import getDietPlan

urlpatterns = [
    path('plan/', getDietPlan),
]