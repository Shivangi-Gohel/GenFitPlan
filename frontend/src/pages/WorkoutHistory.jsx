import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { useUser } from "@clerk/clerk-react";
import Layout from "../components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Activity, Target, TrendingUp, Zap } from "lucide-react";
import { URL } from "../../constant";

export default function WorkoutDashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRange, setFilterRange] = useState({ start: "", end: "" });
  const { user } = useUser();
  const userId = user.id;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(
          `${URL}/workout-log/?userId=${userId}`
        );
        const data = await res.json();
        setLogs(data);
      } catch (error) {
        console.error("Error fetching workout logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [userId]);

  if (loading)
    return (
      <p className="text-center text-gray-500">Loading workout history...</p>
    );

  if (logs.length === 0)
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">
            No Workout History Found
          </h1>
          <p className="text-gray-500">
            Start tracking your workouts to see your progress here.
          </p>
        </div>
      </Layout>
    );

  const filteredLogs = logs.filter((log) => {
    if (!filterRange.start || !filterRange.end) return true;
    return log.date >= filterRange.start && log.date <= filterRange.end;
  });
  console.log("Filtered Logs:", filteredLogs);

  const totalWorkouts = filteredLogs.length;
  const totalExercises = filteredLogs.reduce(
    (acc, log) => acc + log.completedExercises.length,
    0
  );
  const avgExercises =
    totalWorkouts > 0 ? (totalExercises / totalWorkouts).toFixed(1) : 0;

  const sortedDates = filteredLogs
    .map((l) => new Date(l.date))
    .sort((a, b) => a - b);

  let longestStreak = 0,
    currentStreak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const diff = (sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24);
    if (diff === 1) currentStreak++;
    else currentStreak = 1;
    if (currentStreak > longestStreak) longestStreak = currentStreak;
  }

  const lineChartData = filteredLogs.map((log) => ({
    date: log.date,
    exercises: log.completedExercises.length,
  }));

  return (
    <Layout>
      <div className="min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-10 px-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-white">
              Workout <span className="text-primary uppercase">Dashboard</span>
            </h1>
            <p className="text-gray-300 mt-1">
              Track your fitness journey and progress
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-10 px-6">
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm font-medium">
                    Total Workouts
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {totalWorkouts}
                  </p>
                </div>
                <div className="bg-blue-600 p-3 rounded-full">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm font-medium">
                    Total Exercises
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {totalExercises}
                  </p>
                </div>
                <div className="bg-green-600 p-3 rounded-full">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm font-medium">
                    Avg Exercises / Workout
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {avgExercises}
                  </p>
                </div>
                <div className="bg-purple-600 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900/20 to-orange-800/10 border-orange-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-300 text-sm font-medium">
                    Longest Streak
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {longestStreak} days
                  </p>
                </div>
                <div className="bg-orange-600 p-3 rounded-full">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 mx-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Recent Workouts
            </h2>
            {/* <div className="flex gap-4 items-center mx-auto my-auto">
            <label className="text-gray-300">
              Start:
              <input
                type="date"
                className="ml-2 bg-gray-800 border border-gray-600 rounded p-1 text-white focus:border-blue-500 focus:outline-none"
                value={filterRange.start}
                onChange={(e) =>
                  setFilterRange((prev) => ({ ...prev, start: e.target.value }))
                }
              />
            </label>
            <label className="text-gray-300">
              End:
              <input
                type="date"
                className="ml-2 bg-gray-800 border border-gray-600 rounded p-1 text-white focus:border-blue-500 focus:outline-none"
                value={filterRange.end}
                onChange={(e) =>
                  setFilterRange((prev) => ({ ...prev, end: e.target.value }))
                }
              />
            </label>
          </div> */}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-3 px-4 font-semibold text-gray-200">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-200">
                    Exercises Completed
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-200">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-gray-200">
                      {new Date(log.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {log.completedExercises.map((exercise, i) => (
                          <span
                            key={i}
                            className="bg-blue-900/50 text-blue-200 px-2 py-1 rounded text-xs border border-blue-700/50"
                          >
                            {exercise.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-blue-900/50 text-blue-200 px-2 py-1 rounded-full text-xs font-medium border border-blue-700/50">
                        {log.completedExercises.length} exercises
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-8 my-15 px-6 pb-10">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                Exercises Per Day
              </CardTitle>
              <CardDescription className="text-gray-400">
                Track your daily exercise volume over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="#9CA3AF"
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                    stroke="#9CA3AF"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F9FAFB",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="exercises"
                    stroke="#60A5FA"
                    strokeWidth={3}
                    dot={{ fill: "#60A5FA", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#60A5FA", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
