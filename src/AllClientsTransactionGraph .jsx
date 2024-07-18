/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { RotateLoader } from 'react-spinners';

const AllClientsTransactionGraph = () => {
  const [clientList, setClientList] = useState([]);
  const [transactionList, setTransactionList] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const colorPalette = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c', '#d0ed57', '#a4c8e0', '#d84b2a', '#ff84c0'
  ];

  useEffect(() => {
    const fetchClientData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://mustafabayoumi.github.io/host_api/Web.json');
        setClientList(response.data.customers);
        setTransactionList(response.data.transactions);

        const data = response.data.transactions.reduce((acc, transaction) => {
          const date = transaction.date;
          if (!acc[date]) {
            acc[date] = { date };
            response.data.customers.forEach(client => {
              acc[date][client.name] = 0;
            });
          }
          const client = response.data.customers.find(c => c.id === transaction.customer_id);
          if (client) {
            acc[date][client.name] += transaction.amount;
          }
          return acc;
        }, {});
        setChartData(Object.values(data));
        setIsLoading(false);
      } catch (error) {
        setFetchError('Error fetching data');
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchClientData();
  }, []);

  if (isLoading) {
    return <div className='flex items-center justify-center py-16'><RotateLoader /></div>;
  }

  if (fetchError) {
    return <div className="text-red-500">{fetchError}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Transaction Graph for All Customers</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {clientList.map((client, index) => (
            <Line
              key={client.id}
              type="monotone"
              dataKey={client.name}
              stroke={colorPalette[index % colorPalette.length]}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AllClientsTransactionGraph;