from django.db import models
from mongoengine import Document, EmbeddedDocument, fields


class Routine(EmbeddedDocument):
    name = fields.StringField(required=True)
    sets = fields.IntField(required=False)
    reps = fields.IntField(required=False)
    duration = fields.StringField(required=False)
    description = fields.StringField(required=False)
    exercises = fields.ListField(fields.StringField(), required=False)


class ExerciseDay(EmbeddedDocument):
    day = fields.StringField(required=True)
    routines = fields.EmbeddedDocumentListField(Routine)


class WorkoutPlan(EmbeddedDocument):
    schedule = fields.ListField(fields.StringField(), required=True)
    exercises = fields.EmbeddedDocumentListField(ExerciseDay)


class Meal(EmbeddedDocument):
    name = fields.StringField(required=True)
    foods = fields.ListField(fields.StringField(), required=True)


class DietPlan(EmbeddedDocument):
    dailyCalories = fields.IntField(required=True)
    meals = fields.EmbeddedDocumentListField(Meal)


class User(Document):
    name = fields.StringField(required=True)
    email = fields.StringField(required=True)
    image = fields.StringField(required=False)
    clerkId = fields.StringField(required=True, unique=True)
    data = fields.DictField(required=False)


class Plan(Document):
    userId = fields.StringField(required=True)  # Could also be ReferenceField(User)
    name = fields.StringField(required=True)
    workoutPlan = fields.EmbeddedDocumentField(WorkoutPlan)
    dietPlan = fields.EmbeddedDocumentField(DietPlan)
    isActive = fields.BooleanField(default=True)

    meta = {
        'indexes': [
            'userId',
            'isActive'
        ]
    }

class UserData(Document):
    user = fields.ReferenceField(User, required=True)
    age = fields.IntField()
    height = fields.IntField()
    weight = fields.IntField()
    injuries = fields.ListField(fields.StringField())
    workout_days = fields.IntField()
    fitness_goal = fields.StringField()
    fitness_level = fields.StringField()
    dietary_restrictions = fields.ListField(fields.StringField())