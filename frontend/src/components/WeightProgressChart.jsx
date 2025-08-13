import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { date: "2025-08-01", weight: 70 },
  { date: "2025-08-08", weight: 69 },
  { date: "2025-08-13", weight: 68 }
];

export default function WeightProgressChart() {
  return (
    <LineChart width={500} height={300} data={data}>
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="date" />
      <YAxis dataKey="weight" />
      <Tooltip />
      <Line type="monotone" dataKey="weight" stroke="#8884d8" />
    </LineChart>
  );
}