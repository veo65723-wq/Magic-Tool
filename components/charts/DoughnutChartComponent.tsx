
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

interface DoughnutChartComponentProps {
  value: number;
  label: string;
  color: string;
}

const DoughnutChartComponent: React.FC<DoughnutChartComponentProps> = ({ value, label, color }) => {
  const data = [
    { name: 'value', value: value },
    { name: 'remaining', value: 10 - value },
  ];
  const COLORS = [color, '#475569'];

  return (
    <ResponsiveContainer width="100%" height={150}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={45}
          outerRadius={60}
          startAngle={90}
          endAngle={-270}
          paddingAngle={0}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <Label 
            value={`${value}/10`} 
            position="center" 
            fill="#FFFFFF"
            className="text-2xl font-bold"
          />
        </Pie>
         <text x="50%" y="75%" textAnchor="middle" dominantBaseline="middle" fill="#94a3b8" className="text-sm">
            {label}
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DoughnutChartComponent;
