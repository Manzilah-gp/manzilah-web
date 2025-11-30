// components/Dashboard/BarChart.jsx
import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

/**
 * BarChart - Reusable bar chart component using Recharts
 * @param {Array} data - Chart data with label and value properties
 * @param {string} title - Chart title
 * @param {number} height - Chart height in pixels
 */
const BarChart = ({ data = [], title, height = 400 }) => {
    // Color palette for bars
    const COLORS = [
        '#1890ff', '#52c41a', '#fa8c16', '#722ed1',
        '#eb2f96', '#13c2c2', '#faad14', '#f5222d',
        '#2f54eb', '#a0d911'
    ];

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
                    <p style={{ margin: '5px 0 0 0', color: payload[0].color }}>
                        Count: {payload[0].value}
                    </p>
                    {payload[0].payload.percentage && (
                        <p style={{ margin: '5px 0 0 0', color: '#666' }}>
                            Percentage: {payload[0].payload.percentage}%
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    if (!data || data.length === 0) {
        return (
            <div style={{
                height: height,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999'
            }}>
                No data available
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={height}>
            <RechartsBarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="label"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                    dataKey="value"
                    name={title || "Count"}
                    radius={[8, 8, 0, 0]}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </RechartsBarChart>
        </ResponsiveContainer>
    );
};

export default BarChart;