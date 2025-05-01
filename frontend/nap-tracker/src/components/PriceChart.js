import React from 'react';
import { PieChart, Pie, LineChart, Cell, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';


const priceHistoryData = [
    { date: 'Jan 16', price: 1500 },
    { date: 'Jan 17', price: 1600 },
    { date: 'Jan 18', price: 1700 },
    { date: 'Jan 19', price: 1800 },
    { date: 'Jan 20', price: 1900 },
];


const categoryData = [
    { category: 'Gold', price: 1895.5 },
    { category: 'S&P 500', price: 4783.83 },
    { category: 'Bitcoin', price: 41532.1 },
    { category: 'Silver', price: 23.45 },
    { category: 'Crude Oil', price: 73.25 },
];

const assets = [
    { name: 'Gold', category: 'Precious Metals', price: 1500, trend: 'Rising' },
    { name: 'Silver', category: 'Precious Metals', price: 25, trend: 'Falling' },
    { name: 'S&P 500', category: 'Indices', price: 4783.83, trend: 'Stable' },
    { name: 'Copper', category: 'Base Metals', price: 4, trend: 'Rising' },
    { name: 'Nickel', category: 'Base Metals', price: 8, trend: 'Falling' },
    { name: 'Crude Oil', category: 'Commodities', price: 73.25, trend: 'Stable' },
];


const categoryStats = Object.values(
    assets.reduce((acc, asset) => {
        const { category, price, trend } = asset;
        if (!acc[category]) {
            acc[category] = { category, total: 0, count: 0, trends: {} };
        }
        acc[category].total += price;
        acc[category].count += 1;
        acc[category].trends[trend] = (acc[category].trends[trend] || 0) + 1;
        return acc;
    }, {})
).map(({ category, total, count, trends }) => {
    const avgPrice = total / count;
    const dominantTrend = Object.entries(trends).sort((a, b) => b[1] - a[1])[0][0];
    return { category, avgPrice, trend: dominantTrend };
});



const risingAssets = assets
    .filter(a => a.trend === 'Rising')
    .sort((a, b) => b.price - a.price)
    .slice(0, 5)
    .map(a => ({ ...a, price: Math.abs(a.price), type: 'Rising' }));

const fallingAssets = assets
    .filter(a => a.trend === 'Falling')
    .sort((a, b) => b.price - a.price)
    .slice(0, 5)
    .map(a => ({ ...a, price: -Math.abs(a.price), type: 'Falling' }));

const divergingData = [...risingAssets, ...fallingAssets];


const PriceChart = () => (
    <div className='row mt-4'>
        <div className='col-md-6'>
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-light">
                    <h6 className="mb-0">Top Rising vs Falling Assets</h6>
                </div>
                <div className="card-body">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            layout="vertical"
                            data={divergingData}
                        // margin={{ top: 20, right: 30, left: 100, bottom: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" />
                            <Tooltip />
                            <Bar dataKey="price" fill="#8884d8">
                                {
                                    divergingData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.type === 'Rising' ? '#28a745' : '#dc3545'} />
                                    ))
                                }
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        <div className='col-md-6'>
            {/* <h5>Current Price Comparison</h5>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="price" fill="#28a745" />
                </BarChart>
            </ResponsiveContainer> */}
            {/* <h5>Average Price per Category</h5>
            <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={categoryStats}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis />
                    <Radar name="Avg Price" dataKey="avgPrice" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </RadarChart>
            </ResponsiveContainer> */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-light">
                    <h6 className="mb-0">Average Price per Category</h6>
                </div>
                <div className="card-body">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryStats}
                                dataKey="avgPrice"
                                nameKey="category"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {categoryStats.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={
                                            entry.trend === 'Rising'
                                                ? '#28a745'
                                                : entry.trend === 'Falling'
                                                    ? '#dc3545'
                                                    : '#ffc107'
                                        }
                                    />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    </div>
);

export default PriceChart;