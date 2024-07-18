// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RotateLoader } from 'react-spinners';

const ClientsTable = () => {
  const [clientList, setClientList] = useState([]);
  const [transactionList, setTransactionList] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({ name: '', amount: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get('https://mustafabayoumi.github.io/host_api/Web.json');
        setClientList(response.data.customers);
        setTransactionList(response.data.transactions);
        setFilteredTransactions(response.data.transactions);
        setIsLoading(false);
      } catch (error) {
        setFetchError('Error fetching data');
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchClientData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterCriteria({ ...filterCriteria, [name]: value });

    const filtered = transactionList.filter((transaction) => {
      const client = clientList.find((c) => c.id === transaction.customer_id);
      return (
        (!filterCriteria.name || (client && client.name.toLowerCase().includes(filterCriteria.name.toLowerCase()))) &&
        (!filterCriteria.amount || transaction.amount >= parseFloat(filterCriteria.amount))
      );
    });
    setFilteredTransactions(filtered);
  };

  if (isLoading) {
    return <div className='flex items-center justify-center py-16'><RotateLoader /></div>;
  }

  if (fetchError) {
    return <div className="text-red-500">{fetchError}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Client Transactions</h2>
      <div className="mb-4">
        <label className="block mb-2">
          Filter by Name:
          <input
            type="text"
            name="name"
            value={filterCriteria.name}
            onChange={handleFilterChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
      </div>
      {filteredTransactions.length === 0 ? (
        <div className="text-red-500 text-center font-bold text-2xl">No matching records found</div>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-center">Client ID</th>
              <th className="py-2 px-4 border-b text-center">Client Name</th>
              <th className="py-2 px-4 border-b text-center">Date</th>
              <th className="py-2 px-4 border-b text-center">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => {
              const client = clientList.find((c) => c.id === transaction.customer_id);
              const formattedDate = new Date(transaction.date).toLocaleDateString('en-GB', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              return (
                <tr key={transaction.id}>
                  <td className="py-2 px-4 border-b text-center">{client ? client.id : 'Unknown'}</td>
                  <td className="py-2 px-4 border-b text-center">{client ? client.name : 'Unknown'}</td>
                  <td className="py-2 px-4 border-b text-center">{formattedDate}</td>
                  <td className="py-2 px-4 border-b text-center">{transaction.amount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClientsTable;