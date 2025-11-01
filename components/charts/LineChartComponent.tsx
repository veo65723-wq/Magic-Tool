

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartDataPoint } from '../../types';

interface LineChartComponentProps {
  data: ChartDataPoint[];
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} axisLine={{ stroke: '#475569' }} tickLine={{ stroke: '#475569' }} />
        <YAxis tick={{ fill: '#94a3b8' }} axisLine={{ stroke: '#475569' }} tickLine={{ stroke: '#475569' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(30, 41, 59, 0.9)',
            borderColor: '#475569',
            color: '#cbd5e1',
          }}
          labelStyle={{ color: '#f8fafc' }}
        />
        <Line type="monotone" dataKey="uv" stroke="#38bdf8" strokeWidth={2} activeDot={{ r: 8, fill: '#0ea5e9' }} dot={{ stroke: '#38bdf8', strokeWidth: 1, r: 4, fill: '#0ea5e9' }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;