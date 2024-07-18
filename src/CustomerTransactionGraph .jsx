/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { RotateLoader } from 'react-spinners';

const CustomerTransactionGraph = () => {
  const [clientList, setClientList] = useState([]);
  const [transactionList, setTransactionList] = useState([]);
  const [selectedClientName, setSelectedClientName] = useState('');
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchClientData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://mustafabayoumi.github.io/host_api/Web.json');
        setClientList(response.data.customers);
        setTransactionList(response.data.transactions);
        setSelectedClientName('Ahmed Ali');
        setIsLoading(false);
      } catch (error) {
        setFetchError('Error fetching data');
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchClientData();
  }, []);

  useEffect(() => {
    const client = clientList.find(c => c.name === selectedClientName);
    if (client) {
      const clientTransactions = transactionList.filter((t) => t.customer_id === client.id);
      const data = clientTransactions.reduce((acc, transaction) => {
        const date = transaction.date;
        if (!acc[date]) {
          acc[date] = { date };
        }
        acc[date][selectedClientName] = (acc[date][selectedClientName] || 0) + transaction.amount;
        return acc;
      }, {});
      setChartData(Object.values(data));
    }
  }, [selectedClientName, clientList, transactionList]);

  if (isLoading) {
    return <div className='flex items-center justify-center py-16'><RotateLoader /></div>;
  }

  if (fetchError) {
    return <div className="text-red-500">{fetchError}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Customer Transaction Graph</h2>
      <label className="w-1/2 mb-4">
        Select Customer:
        <input
          type="text"
          list="client-names"
          value={selectedClientName}
          onChange={(e) => setSelectedClientName(e.target.value)}
          className="border border-gray-300 rounded p-2 mt-1 my-4"
        />
        <datalist id="client-names">
          {clientList.map((client) => (
            <option key={client.id} value={client.name}>
              {client.name}
            </option>
          ))}
        </datalist>
      </label>
      {selectedClientName && chartData.length > 0 ? (
        <ResponsiveContainer width="90%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={selectedClientName} stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div>No transactions found for the selected customer</div>
      )}
    </div>
  );
};

export default CustomerTransactionGraph;