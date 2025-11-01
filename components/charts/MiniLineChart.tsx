import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import type { ChartDataPoint } from '../../types';

interface MiniLineChartProps {
  data: ChartDataPoint[];
  color: string;
}

const MiniLineChart: React.FC<MiniLineChartProps> = ({ data, color }) => {
  return (
    <ResponsiveContainer width="100%" height={50}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <Line 
            type="monotone" 
            dataKey="uv" 
            stroke={color} 
            strokeWidth={2.5} 
            dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MiniLineChart;