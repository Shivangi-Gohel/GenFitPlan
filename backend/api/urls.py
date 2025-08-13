from django.urls import path
from .views import get_active_plans, generate_program, store_user, get_user_plans, generate, store_data_from_vapi, get_user_details, workout_log

urlpatterns = [
    path('plan/', get_active_plans),
    path("generate-program/", generate_program),
    path('generate/', generate),
    path("store-user/", store_user),
    path('plans/<str:user_id>/', get_user_plans, name='get_user_plans'),
    path('vapi/store-data/', store_data_from_vapi, name='store_data_from_vapi'),
    path('get-user-details/<str:user_id>/', get_user_details, name='get_user_details'),
    path('workout_log/', workout_log, name='workout_log'),
]