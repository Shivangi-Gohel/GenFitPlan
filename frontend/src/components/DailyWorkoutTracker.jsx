import React, { useState } from "react";
import axios from "axios";
import { URL } from "../../constant";

export default function DailyWorkoutTracker({ userId, workoutPlan }) {
  const today = new Date().toISOString().split("T")[0]; 
  const [completed, setCompleted] = useState([]);

  const toggleExercise = (exercise) => {
    setCompleted((prev) => {
      const exists = prev.find((e) => e.name === exercise.name);
      if (exists) {
        return prev.filter((e) => e.name !== exercise.name);
      } else {
        return [...prev, exercise];
      }
    });
  };

  const saveWorkoutLog = async () => {
    try {
      const res = await axios.post(`${URL}/api/workout-log`, {
        userId,
        date: today,
        completedExercises: completed,
      });
      alert("Workout saved!");
    } catch (error) {
      console.error(error);
      alert("Error saving workout log");
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-3">Today's Workout - {today}</h2>

      {workoutPlan.exercises.map((day) =>
        day.day === new Date().toLocaleDateString("en-US", { weekday: "long" }) ? (
          <div key={day.day}>
            {day.routines.map((exercise, idx) => {
              const isChecked = completed.find((e) => e.name === exercise.name);
              return (
                <div key={idx} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={!!isChecked}
                    onChange={() => toggleExercise(exercise)}
                    className="mr-2"
                  />
                  <span>{exercise.name} — {exercise.sets} sets × {exercise.reps} reps</span>
                </div>
              );
            })}
          </div>
        ) : null
      )}

      <button
        onClick={saveWorkoutLog}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Workout
      </button>
    </div>
  );
}
