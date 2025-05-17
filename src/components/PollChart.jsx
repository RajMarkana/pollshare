import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const PollChart = ({ question, options, votes }) => {
  const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe']
  const RADIAN = Math.PI / 180

  const data = options.map((option, index) => ({
    name: option,
    value: votes[index]
  }))

  const totalVotes = votes.reduce((a, b) => a + b, 0)

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-lg rounded-lg border border-blue-100">
          <p className="text-blue-900 font-medium">{payload[0].name}</p>
          <p className="text-blue-600">{`Votes: ${payload[0].value}`}</p>
          <p className="text-blue-400 text-sm">
            {`(${((payload[0].value / totalVotes) * 100).toFixed(1)}%)`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4 bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <h3 className="text-xl font-semibold text-blue-900 text-center">{question}</h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius="80%"
              innerRadius="40%"
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              className="text-blue-900"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center text-blue-600 font-medium">
        Total Votes: {totalVotes}
      </div>
    </div>
  )
}

export default PollChart