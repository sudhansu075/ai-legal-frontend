import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = {
    Low: "#16a34a",
    Medium: "#eab308",
    High: "#dc2626",
};

function RiskChart({ analysis }) {
    const counts = { Low: 0, Medium: 0, High: 0 };

    analysis.forEach((clause) => {
        counts[clause.risk_level]++;
    });

    const data = Object.keys(counts).map((key) => ({
        name: key,
        value: counts[key],
    }));

    return (
        <div className="bg-gray-900 p-8 rounded-2xl shadow-xl mb-8 text-center">

            <h2 className="text-2xl font-bold mb-6">
                Risk Distribution
            </h2>

            <div className="flex justify-center">
                <PieChart width={400} height={300}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[entry.name]}
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </div>

        </div>
    );
}

export default RiskChart;