from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User, Plan
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import google.generativeai as genai
from pymongo import MongoClient
from datetime import datetime
import os, json, requests, re
from dotenv import load_dotenv
from .models import Plan
from .serializers import PlanSerializer
from rest_framework import status
from google.generativeai import GenerativeModel
from dateutil import parser


print("Starting views.py, about to connect to MongoDB...")

load_dotenv()

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")
chat_model = genai.GenerativeModel("gemini-1.5-flash")

# Mongo setup
client = MongoClient(os.getenv("MONGO_URI"))
db = client["GenFitPlan"]
users_collection = db["users"]
collection = db["vapi_sessions"]
plans_collection = db["plans"]
log_collection = db["workout_log"]

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

try:
    client.server_info()
    print("Connected to MongoDB")
except Exception as e:
    print("MongoDB connection failed:", e)


@api_view(["GET"])
def get_active_plans(request):
    plans = Plan.objects(isActive=True)
    data = []
    for plan in plans:
        data.append(
            {
                "name": plan.name,
                "userId": plan.userId,
                "workoutPlan": plan.workoutPlan.to_mongo(),
                "dietPlan": plan.dietPlan.to_mongo(),
                "isActive": plan.isActive,
            }
        )
    return Response(data)


@csrf_exempt
def store_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            clerkId = data.get("clerkId")
            email = data.get("email")
            image = data.get("image")
            created_at = data.get("created_at")

            print("Received data:", data)
            print("Clerk ID:", clerkId)
            print("Email:", email)
            if created_at:
                created_at = parser.isoparse(created_at)

            user = {
                "clerkId": clerkId,
                "email": email,
                "image": image,
                "created_at": created_at or datetime.utcnow(),
            }

            users_collection.update_one(
                {"email": email},
                {"$set": user},
                upsert=True,
            )

            return JsonResponse({"status": "success"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Only POST allowed"}, status=405)


def validate_workout_plan(plan):
    validated_plan = {"schedule": plan.get("schedule", []), "exercises": []}

    for exercise in plan.get("exercises", []):
        validated_routines = []
        for routine in exercise.get("routines", []):
            sets = routine.get("sets")
            reps = routine.get("reps")

            validated_routines.append(
                {
                    "name": routine.get("name", ""),
                    "sets": (
                        int(sets)
                        if isinstance(sets, (int, float, str)) and str(sets).isdigit()
                        else 1
                    ),
                    "reps": (
                        int(reps)
                        if isinstance(reps, (int, float, str)) and str(reps).isdigit()
                        else 10
                    ),
                }
            )

        validated_plan["exercises"].append(
            {"day": exercise.get("day", ""), "routines": validated_routines}
        )

    return validated_plan


def validate_diet_plan(plan):
    validated_plan = {"dailyCalories": int(plan.get("dailyCalories", 0)), "meals": []}

    for meal in plan.get("meals", []):
        validated_plan["meals"].append(
            {"name": meal.get("name", ""), "foods": meal.get("foods", [])}
        )

    return validated_plan


@api_view(["POST"])
def generate_program(request):
    try:
        user_id = request.data.get("userId")
        if not user_id:
            return Response({"error": "userId is required"}, status=400)

        user_data = collection.find_one({"user": user_id}, {"_id": 0})
        if not user_data:
            return Response({"error": "No data found for this user"}, status=404)

        age = user_data.get("age")
        height = user_data.get("height")
        weight = user_data.get("weight")
        injuries = user_data.get("injuries", "none")
        workout_days = user_data.get("workout_days")
        fitness_goal = user_data.get("fitness_goal")
        fitness_level = user_data.get("fitness_level")
        dietary_restrictions = user_data.get("dietary_restrictions", [])

        model = GenerativeModel(
            model_name="gemini-2.0-flash-001",
            generation_config={
                "temperature": 0.4,
                "top_p": 0.9,
                "response_mime_type": "application/json",
            },
        )

        workout_prompt = f"""
        You are an experienced fitness coach creating a personalized workout plan based on:
        Age: {age}
        Height: {height}
        Weight: {weight}
        Injuries or limitations: {injuries}
        Available days for workout: {workout_days}
        Fitness goal: {fitness_goal}
        Fitness level: {fitness_level}

        As a professional coach:
        - Consider muscle group splits to avoid overtraining the same muscles on consecutive days
        - Design exercises that match the fitness level and account for any injuries
        - Structure the workouts to specifically target the user's fitness goal

        CRITICAL SCHEMA INSTRUCTIONS:
        - Your output MUST contain ONLY the fields specified below, NO ADDITIONAL FIELDS
        - "sets" and "reps" MUST ALWAYS be NUMBERS, never strings
        - For example: "sets": 3, "reps": 10
        - Do NOT use text like "reps": "As many as possible" or "reps": "To failure"
        - Instead use specific numbers like "reps": 12 or "reps": 15
        - For cardio, use "sets": 1, "reps": 1 or another appropriate number
        - NEVER include strings for numerical fields
        - NEVER add extra fields not shown in the example below

        Return a JSON object with this EXACT structure:
        {{
          "schedule": ["Monday", "Wednesday", "Friday"],
          "exercises": [
            {{
              "day": "Monday",
              "routines": [
                {{
                  "name": "Exercise Name",
                  "sets": 3,
                  "reps": 10
                }}
              ]
            }}
          ]
        }}

        DO NOT add any fields that are not in this example. Your response must be a valid JSON object with no additional text.
        """

        workout_result = model.generate_content(workout_prompt)
        workout_plan_text = workout_result.text
        workout_plan = json.loads(workout_plan_text)
        workout_plan = validate_workout_plan(workout_plan)

        diet_prompt = f"""
        You are an experienced nutrition coach creating a personalized diet plan based on:
        Age: {age}
        Height: {height}
        Weight: {weight}
        Fitness goal: {fitness_goal}
        Dietary restrictions: {dietary_restrictions}

        As a professional nutrition coach:
        - Calculate appropriate daily calorie intake based on the person's stats and goals
        - Create a balanced meal plan with proper macronutrient distribution
        - Include a variety of nutrient-dense foods while respecting dietary restrictions
        - Consider meal timing around workouts for optimal performance and recovery

        CRITICAL SCHEMA INSTRUCTIONS:
        - Your output MUST contain ONLY the fields specified below, NO ADDITIONAL FIELDS
        - "dailyCalories" MUST be a NUMBER, not a string
        - DO NOT add fields like "supplements", "macros", "notes", or ANYTHING else
        - ONLY include the EXACT fields shown in the example below
        - Each meal should include ONLY a "name" and "foods" array

        Return a JSON object with this EXACT structure and no other fields:
        {{
          "dailyCalories": 2000,
          "meals": [
            {{
              "name": "Breakfast",
              "foods": ["Oatmeal with berries", "Greek yogurt", "Black coffee"]
            }},
            {{
              "name": "Lunch",
              "foods": ["Grilled chicken salad", "Whole grain bread", "Water"]
            }}
          ]
        }}

        DO NOT add any fields that are not in this example. Your response must be a valid JSON object with no additional text.
        """

        diet_result = model.generate_content(diet_prompt)
        diet_plan_text = diet_result.text
        diet_plan = json.loads(diet_plan_text)
        diet_plan = validate_diet_plan(diet_plan)

        plan_data = {
            "user": user_id,
            "name": f"{fitness_goal} Plan - {datetime.today().strftime('%Y-%m-%d')}",
            "workoutPlan": workout_plan,
            "dietPlan": diet_plan,
            "createdAt": datetime.utcnow(),
        }

        inserted_id = plans_collection.update_one(
            {"user": user_id}, {"$set": plan_data}, upsert=True
        )

        return Response(
            {
                "success": True,
                "data": {
                    "user": user_id,
                    "workoutPlan": workout_plan,
                    "dietPlan": diet_plan,
                },
            },
            status=200,
        )

    except Exception as e:
        print("Error generating fitness plan:", str(e))
        return Response(
            {"success": False, "error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def get_user_plans(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        plans = Plan.objects.filter(user=user).order_by("-created_at")
        serializer = PlanSerializer(plans, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def store_data_from_vapi(request):
    try:
        message = request.data.get("message", {})
        if not message:
            return Response(
                {"error": "No message found"}, status=status.HTTP_400_BAD_REQUEST
            )
        print("Received message:", message)

        timestamp = message.get("timestamp")
        analysis = message.get("analysis", {})
        user = message.get("assistant", {}).get("variableValues").get("user_id")

        artifact_messages = message.get("artifact", {}).get("messages", [])
        if not artifact_messages:
            return Response(
                {"message": "No conversation messages found"}, status=status.HTTP_200_OK
            )
            
        structured_data = analysis.get("structuredData")

        # Get the last bot message
        last_msg = artifact_messages[-1]
        if (
            # last_msg.get("role") != "bot"
            "goodbye" not in last_msg.get("message", "").lower()
            or "great day" not in last_msg.get("message", "").lower()
        ):
            return Response(
                {"message": "No goodbye detected yet"}, status=status.HTTP_200_OK
            )

        if not structured_data:
            return Response(
                {"message": "Goodbye detected but no structuredData present"},
                status=status.HTTP_200_OK,
            )

        print("age,   ", structured_data.get("age"))
        required_fields = [
            "age",
            "height",
            "weight",
            "injuries",
            "workout_days",
            "fitness_goal",
            "fitness_level",
            "dietary_restrictions",
        ]
        
        filtered_data = {field: structured_data.get(field) for field in required_fields}

        print("Filtered Structured Data:", filtered_data)
        existing_session = collection.find_one({"user": user})

        if existing_session:
            # Update user’s latest info
            collection.update_one(
                {"_id": existing_session["_id"]},
                {"$set": {"timestamp": timestamp, **filtered_data}},
            )
            return Response(
                {"message": "User data updated after goodbye"},
                status=status.HTTP_200_OK,
            )
        else:
            # Insert new user record
            collection.insert_one(
                {"user": user, "timestamp": timestamp, **filtered_data}
            )
            return Response(
                {"message": "New user data stored after goodbye"},
                status=status.HTTP_201_CREATED,
            )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def get_user_details(request, user_id):
    try:
        print("Collection:", collection)
        print("User ID:", user_id)

        doc = collection.find_one({"user": user_id}, {"_id": 0})
        if not doc:
            return Response({"error": "No data found"}, status=404)

        return Response(doc)
    except Exception as e:
        import traceback

        traceback.print_exc()
        return Response({"error": str(e)}, status=500)


@api_view(["GET", "POST"])
def workout_log(request):
    if request.method == "POST":
        user_id = request.data.get("userId")
        date = request.data.get("date")
        completed = request.data.get("completedExercises", [])

        log_collection.update_one(
            {"user": user_id, "date": date},
            {"$set": {"completedExercises": completed}},
            upsert=True,
        )
        return Response({"success": True, "message": "Workout logged"})

    elif request.method == "GET":
        user_id = request.query_params.get("userId")
        logs = list(log_collection.find({"user": user_id}, {"_id": 0}))
        return Response(logs)


BASE_URL = "https://www.googleapis.com/youtube/v3/search"


def search_youtube_videos(query, max_results):
    """
    Search YouTube videos using YouTube Data API v3
    """
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": max_results,
        "key": YOUTUBE_API_KEY,
    }

    if not YOUTUBE_API_KEY:
        raise ValueError("YouTube API key is not set in environment variables.")

    response = requests.get(BASE_URL, params=params)
    data = response.json()

    videos = []
    for item in data.get("items", []):
        video_id = item["id"]["videoId"]
        title = item["snippet"]["title"]
        thumbnail = item["snippet"]["thumbnails"]["high"]["url"]
        channel = item["snippet"]["channelTitle"]
        url = f"https://www.youtube.com/watch?v={video_id}"

        videos.append(
            {"title": title, "channel": channel, "thumbnail": thumbnail, "url": url}
        )

    return videos


@api_view(["GET"])
def get_videos(request):
    query = request.GET.get("query", "")
    if not query:
        return Response({"error": "Missing query"}, status=400)

    if not YOUTUBE_API_KEY:
        return Response({"error": "API key not set"}, status=500)

    try:
        videos = search_youtube_videos(query, 10)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

    return Response(videos)


@api_view(["POST"])
def fitness_chatbot(request):
    try:
        body = json.loads(request.body.decode("utf-8"))
        user_message = body.get("message", "")

        if not user_message:
            return JsonResponse({"error": "No message provided"}, status=400)
        print("User message:", user_message)

        prompt = f"""
            You are a professional fitness and diet assistant. 
            - Only answer questions related to workouts, exercises, diet, nutrition, and motivation. 
            - Keep answers short, clear, and actionable. 
            - Provide workout/diet suggestions in bullet points or short steps.
            - If mood-based (e.g., "I feel tired"), suggest light/stretching workouts.
            - If form-related, give clear correction tips.
            - If unrelated, say: "I can only help with fitness, workouts, and diet."
            
            User: {user_message}
            Assistant:
            """

        response = chat_model.generate_content(prompt)

        if isinstance(response, str):
            reply = response
        elif hasattr(response, "text"):
            reply = response.text
        else:
            reply = str(response)

        final_reply = re.sub(r"(\*{1,2})", "", reply).strip()

        return JsonResponse({"reply": final_reply})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
