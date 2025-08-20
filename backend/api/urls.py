from django.urls import path
from .views import get_active_plans, generate_program, store_user, get_user_plans, store_data_from_vapi, get_user_details, workout_log, get_videos, fitness_chatbot

urlpatterns = [
    path('plan/', get_active_plans),
    path("generate-program/", generate_program),
    path("store-user/", store_user),
    path('plans/<str:user_id>/', get_user_plans, name='get_user_plans'),
    path('vapi/store-data/', store_data_from_vapi, name='store_data_from_vapi'),
    path('get-user-details/<str:user_id>/', get_user_details, name='get_user_details'),
    path('workout-log/', workout_log, name='workout_log'),
    path("videos", get_videos, name="get_videos"),
    path("fitness-chat/", fitness_chatbot, name="fitness_chatbot"),
]