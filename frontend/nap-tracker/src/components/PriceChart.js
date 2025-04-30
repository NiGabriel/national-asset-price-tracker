import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend, ResponsiveContainer } from 'recharts';


const priceHistoryData = [
    {date: 'Jan 16', price: 1500 },
    {date: 'Jan 17', price: 1600 },
    {date: 'Jan 18', price: 1700 },
    {date: 'Jan 19', price: 1800 },
    {date: 'Jan 20', price: 1900 },
];


const categoryData = [
    { category: 'Gold', price: 1895.5 },
    { category: 'S&P 500', price: 4783.83 },
    { category: 'Bitcoin', price: 41532.1 },
    { category: 'Silver', price: 23.45 },
    { category: 'Crude Oil', price: 73.25 },
  ];

const PriceChart = () => (
    <div className='row'>   
        <div className='col-md-6'>
            <h5>Price History (Gold)</h5>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart width={700} height={250} data={priceHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
        <div className='col-md-6'>
            <h5>Current Price Comparison</h5>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="price" fill="#28a745" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export default PriceChart;