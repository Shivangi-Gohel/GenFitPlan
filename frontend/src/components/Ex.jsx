import { useState } from "react";

const Ex = () => {
  const [loading, setLoading] = useState(false);
  const [planData, setPlanData] = useState(null);
  const [error, setError] = useState(null);
  console.log(planData)

  const handleGenerateProgram = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/generate-program/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // if you want to send dynamic data later:
        body: JSON.stringify({}),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setPlanData(data.data); // contains planId, workoutPlan, dietPlan
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button onClick={handleGenerateProgram} disabled={loading}>
        {loading ? "Generating..." : "Generate Fitness Program"}
      </button>

      {error && <p className="text-red-500">Error: {error}</p>}

      {planData && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">Plan Generated</h2>
          <p>Plan ID: {planData.planId}</p>

          <h3 className="mt-2 font-semibold">Workout Plan:</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm">
            {JSON.stringify(planData.workoutPlan, null, 2)}
          </pre>

          <h3 className="mt-2 font-semibold">Diet Plan:</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm">
            {JSON.stringify(planData.dietPlan, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Ex;
