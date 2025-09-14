import { addDays, format, startOfDay, endOfDay, subDays } from "date-fns";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#6366F1",
  "#8B5CF6",
];

export type AnalyticsData = {
  dailyTrends: { date: string; count: number }[];
  byReason: { name: string; value: number }[];
  byImpact: { name: string; value: number }[];
  hourlyDistribution: { hour: string; count: number }[];
};

interface AnalyticsChartsProps {
  data: AnalyticsData;
}

export default function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Daily Trends */}
      <div className="bg-card rounded-lg p-4 h-[300px]">
        <h3 className="text-sm font-medium mb-4">Daily Trends</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.dailyTrends}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => format(new Date(value), "MMM d")}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              labelFormatter={(value) => format(new Date(value), "MMM d, yyyy")}
              formatter={(value: number) => [value, "Distractions"]}
            />
            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Reasons Distribution */}
      <div className="bg-card rounded-lg p-4 h-[300px]">
        <h3 className="text-sm font-medium mb-4">Reasons Distribution</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.byReason}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={(entry) => entry.name}
            >
              {data.byReason.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [value, "Distractions"]} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Impact Distribution */}
      <div className="bg-card rounded-lg p-4 h-[300px]">
        <h3 className="text-sm font-medium mb-4">Impact Distribution</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.byImpact}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={(entry) => entry.name}
            >
              {data.byImpact.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={
                    entry.name === "low"
                      ? "#10B981"
                      : entry.name === "medium"
                      ? "#F59E0B"
                      : "#EF4444"
                  }
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [value, "Distractions"]} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Hourly Distribution */}
      <div className="bg-card rounded-lg p-4 h-[300px]">
        <h3 className="text-sm font-medium mb-4">Time of Day Distribution</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.hourlyDistribution}>
            <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value: number) => [value, "Distractions"]} />
            <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
