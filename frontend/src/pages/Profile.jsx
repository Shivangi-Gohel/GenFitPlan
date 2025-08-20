import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import ProfileHeader from "../components/ProfileHeader";
import CornerElements from "../components/CornerElements";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { AppleIcon, CalendarIcon, DumbbellIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Profile() {
  const { user } = useUser();
  const [dietPlan, setDietPlan] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];
  const todayDayName = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  // Fetch AI-generated plan
  useEffect(() => {
    fetch("http://localhost:8000/api/generate-program/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setDietPlan(data.data.dietPlan);
        setWorkoutPlan(data.data.workoutPlan);
        setLoading(false);
      });
  }, [user.id]);

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
      const res = await fetch("http://localhost:8000/api/workout-log/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          date: today,
          completedExercises: completed,
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast("Workout saved!", {
          description: "Your workout has been added successfully.",
          style: {
            background: "rgb(59, 180, 229,0.8)",
          },
        });
      } else {
        toast.error("Error saving workout", {
          description: "There was an issue saving your workout.",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error saving workout", {
        description: "Unable to save workout. Please try again.",
      });
    }
  };

  const AccordionItemSkeleton = () => (
    <div className="border rounded-lg overflow-hidden p-4 space-y-3 animate-pulse">
      <div className="h-6 w-1/3 bg-primary/20 rounded"></div> {/* Day header */}
      {Array(3)
        .fill(0)
        .map((_, rIdx) => (
          <div
            key={rIdx}
            className="flex justify-between items-center border border-border rounded p-3 bg-background/50"
          >
            <div className="flex flex-col gap-2">
              <div className="h-4 w-32 bg-primary/20 rounded"></div>{" "}
              <div className="flex gap-2 mt-1">
                <div className="h-4 w-12 bg-primary/20 rounded"></div>{" "}
                <div className="h-4 w-12 bg-secondary/20 rounded"></div>{" "}
              </div>
            </div>
            <div className="h-8 w-20 bg-primary/20 rounded"></div>{" "}
          </div>
        ))}
    </div>
  );

  return (
    <Layout>
      <section className="relative z-10 pt-12 pb-32 flex-grow container mx-auto px-4">
        <ProfileHeader user={user} />

        <div className="space-y-8">
          <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
            <CornerElements />
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <h2 className="text-xl font-bold tracking-tight">
                <span className="text-primary">Your</span>{" "}
                <span className="text-foreground">Fitness Plan</span>
              </h2>
            </div>

            <Tabs defaultValue="workout" className="w-full">
              <TabsList className="mb-6 w-full grid grid-cols-2 bg-cyber-terminal-bg border">
                <TabsTrigger
                  value="workout"
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <DumbbellIcon className="mr-2 size-4" />
                  Workout Plan
                </TabsTrigger>
                <TabsTrigger
                  value="diet"
                  className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <AppleIcon className="mr-2 h-4 w-4" />
                  Diet Plan
                </TabsTrigger>
              </TabsList>

              {/* Workout Plan */}
              <TabsContent value="workout">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    <span className="font-mono text-sm text-muted-foreground">
                      SCHEDULE: {workoutPlan?.schedule.join(", ")}
                    </span>
                  </div>

                  <Accordion type="multiple" className="space-y-4">
                    {loading
                      ? Array(3)
                          .fill(0)
                          .map((_, idx) => <AccordionItemSkeleton key={idx} />)
                      : workoutPlan?.exercises.map((exerciseDay, index) => (
                          <AccordionItem
                            key={index}
                            value={exerciseDay.day}
                            className="border rounded-lg overflow-hidden"
                          >
                            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-primary/10 font-mono">
                              <div className="flex justify-between w-full items-center">
                                <span className="text-primary">
                                  {exerciseDay.day}
                                </span>
                                <div className="text-xs text-muted-foreground">
                                  {exerciseDay.routines.length} EXERCISES
                                </div>
                              </div>
                            </AccordionTrigger>

                            <AccordionContent className="pb-4 px-4">
                              <div className="space-y-3 mt-2">
                                {exerciseDay?.routines.map(
                                  (routine, routineIndex) => {
                                    const isChecked = completed.find(
                                      (e) => e.name === routine.name
                                    );
                                    return (
                                      <div
                                        key={routineIndex}
                                        className="border border-border rounded p-3 bg-background/50 flex items-center justify-between"
                                      >
                                        <div className="flex items-center gap-10">
                                          <div>
                                            <h4 className="font-semibold text-foreground">
                                              {routine.name}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                              <div className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-mono">
                                                {routine.sets} SETS
                                              </div>
                                              <div className="px-2 py-1 rounded bg-secondary/20 text-secondary text-xs font-mono">
                                                {routine.reps} REPS
                                              </div>
                                            </div>
                                          </div>
                                          <button
                                            className="mt-6 px-3 py-1 text-xs font-medium bg-primary/80 text-black rounded-lg hover:bg-primary/90"
                                            onClick={() => {
                                              navigate(
                                                `/youtube-search?query=${encodeURIComponent(
                                                  routine.name
                                                )}`
                                              );
                                            }}
                                          >
                                            🎥 Watch Video
                                          </button>
                                        </div>
                                        {exerciseDay.day === todayDayName && (
                                          <input
                                            type="checkbox"
                                            checked={!!isChecked}
                                            onChange={() =>
                                              toggleExercise(routine)
                                            }
                                            className="w-5 h-5 accent-primary"
                                          />
                                        )}
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                  </Accordion>

                  {/* Show Save Button only if today matches a workout day */}
                  {workoutPlan?.schedule.includes(todayDayName) && (
                    <button
                      onClick={saveWorkoutLog}
                      className="mt-4 bg-primary/80 text-black px-4 py-2 rounded-xl"
                    >
                      Save Today's Workout
                    </button>
                  )}
                </div>
              </TabsContent>

              {/* Diet Plan */}
              <TabsContent value="diet">
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-sm text-muted-foreground">
                      DAILY CALORIE TARGET
                    </span>
                    <div className="font-mono text-xl text-primary">
                      {dietPlan?.dailyCalories} KCAL
                    </div>
                  </div>
                  <div className="h-px w-full bg-border my-4"></div>
                  <div className="space-y-4">
                    {dietPlan?.meals.map((meal, index) => (
                      <div
                        key={index}
                        className="border border-border rounded-lg overflow-hidden p-4"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <h4 className="font-mono text-primary">
                            {meal.name}
                          </h4>
                        </div>
                        <ul className="space-y-2">
                          {meal.foods.map((food, foodIndex) => (
                            <li
                              key={foodIndex}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <span className="text-xs text-primary font-mono">
                                {String(foodIndex + 1).padStart(2, "0")}
                              </span>
                              {food}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </Layout>
  );
}
