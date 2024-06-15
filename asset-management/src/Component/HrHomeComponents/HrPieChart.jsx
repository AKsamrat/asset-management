import React, { PureComponent, useState } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import useAuth from '../../hooks/useAuth';
import useAxiosCommon from '../../hooks/useAxiosCommon';
import { useQuery } from '@tanstack/react-query';
import { Legend } from '@headlessui/react';
import { data } from 'autoprefixer';
const COLORS = ['#FEBF32', '#FF8042'];
const HrPieChart = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('returnable');
  const [filter2, setFilter2] = useState('non-returnable');
  const axiosCommon = useAxiosCommon();

  const {
    data: chartData = [],
    isLoading,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axiosCommon(
        `/hr-pieChart/${user?.email}?filter=${filter}&filter2=${filter2}`
      );
      console.log(data);
      return data;
    },
    queryKey: ['chartData', user?.email, filter, filter2],
  });

  //pi chart data=========================
  const data = [
    { name: 'Group A', value: chartData.reCount },
    { name: 'Group B', value: chartData.nonCount },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div>
      <h1 className="text-center text-4xl font-bold">
        Pie <span className="text-[#FEBF32]">Chart</span>
      </h1>
      <p className="text-center text-lg my-3">
        This Pie chart is made on available and un-available asset
      </p>

      <div className="flex justify-center items-center">
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {data?.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend></Legend>
        </PieChart>
      </div>
    </div>
  );
};

export default HrPieChart;
