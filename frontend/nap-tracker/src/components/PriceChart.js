import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00C49F', '#FFBB28', '#FF8042', '#b19cd9'];

const PriceChart = () => {
    const [priceData, setPriceData] = useState([]);
    const [categoryStats, setCategoryStats] = useState([]);

    const API_URL = process.env.REACT_APP_API_BASE_URL;
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_URL}/price-history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const grouped = {};
                res.data.forEach(item => {
                    const name = item.asset.name;
                    if (!grouped[name]) grouped[name] = [];
                    grouped[name].push({ price: item.price, date: item.recordedAt });
                });

                const trendData = Object.entries(grouped).map(([name, records]) => {
                    const sorted = records.sort((a, b) => new Date(a.date) - new Date(b.date));
                    const trend = sorted[sorted.length - 1].price > sorted[0].price ? 'Rising'
                        : sorted[sorted.length - 1].price < sorted[0].price ? 'Falling'
                            : 'Stable';
                    return {
                        name,
                        price: sorted[sorted.length - 1].price,
                        trend,
                    };
                });

                const categories = {};
                res.data.forEach(item => {
                    const category = item.asset.category.name;
                    if (!categories[category]) categories[category] = { total: 0, count: 0, trends: {} };
                    categories[category].total += item.price;
                    categories[category].count += 1;
                    const trend = trendData.find(a => a.name === item.asset.name)?.trend || 'Stable';
                    categories[category].trends[trend] = (categories[category].trends[trend] || 0) + 1;
                });

                const catStats = Object.entries(categories).map(([category, { total, count, trends }]) => ({
                    category,
                    avgPrice: total / count,
                    trend: Object.entries(trends).sort((a, b) => b[1] - a[1])[0][0]
                }));

                // Separate trends
                const rising = trendData
                    .filter(a => a.trend === 'Rising')
                    .sort((a, b) => b.price - a.price)
                    .slice(0, 2);

                const falling = trendData
                    .filter(a => a.trend === 'Falling')
                    .sort((a, b) => b.price - a.price)
                    .slice(0, 2);

                const stable = trendData
                    .filter(a => a.trend === 'Stable')
                    .sort((a, b) => b.price - a.price)
                    .slice(0, 2);

                // Merge them into final chart data
                const top6 = [...rising, ...falling, ...stable];

                setPriceData(top6);

                setCategoryStats(catStats);
            } catch (err) {
                console.error("Failed to fetch price data:", err);
            }
        };

        fetchData();
    }, [API_URL, token]);

    const trendColor = trend =>
        trend === 'Rising' ? '#28a745' :
            trend === 'Falling' ? '#dc3545' : '#ffc107';

    const trendLegend = [
        { name: 'Rising', color: '#28a745' },
        { name: 'Falling', color: '#dc3545' },
        { name: 'Stable', color: '#ffc107' },
    ];

    return (
        <div className="row mt-4">
            {/* Bar Chart */}
            <div className="col-md-6">
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-light"><h6 className="mb-0">Top Rising vs Falling</h6></div>
                    <div className="card-body">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart layout="vertical" data={priceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" tick={{ fontSize: 14, fontFamily: 'Calibri', fill: '#333' }} />
                                <YAxis dataKey="name" type="category" tick={{ fontSize: 14, fontFamily: 'Calibri', fill: '#333' }} />
                                <Tooltip />
                                <Legend
                                    payload={trendLegend.map(item => ({
                                        id: item.name,
                                        type: 'circle',
                                        value: item.name,
                                        color: item.color
                                    }))}
                                />
                                <Bar dataKey="price">
                                    {priceData.map((entry, idx) => (
                                        <Cell key={idx} fill={trendColor(entry.trend)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Pie Chart */}
            <div className="col-md-6">
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-light"><h6 className="mb-0">Avg Price per Category</h6></div>
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
                                    label={({ value }) => `RWF${value.toFixed(2)}`}
                                >
                                    {categoryStats.map((entry, idx) => (
                                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
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
};

export default PriceChart;