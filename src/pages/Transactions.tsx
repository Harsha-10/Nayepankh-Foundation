import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import './transaction.css'

interface Transaction {
  _id: string;
  donorName: string;
  amount: number;
  createdAt: string;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);  // Log the token to see its value

      const response = await fetch(
        `https://nayepankh-foundation-production-e02f.up.railway.app/api/donations/transactions?_=${new Date().getTime()}`, // Append a timestamp to bypass cache
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache',  // Prevent caching of the response
          },
        }
      );

      // Check if response is a valid JSON, otherwise log it for debugging
      const textResponse = await response.text();
      console.log('Response body:', textResponse); // Log the response body to see what's being returned

      try {
        const data = JSON.parse(textResponse); // Attempt to parse the JSON
        setTransactions(data); // If valid, set the transactions
      } catch (err) {
        console.error('Error parsing JSON:', err); // Handle JSON parsing errors
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <img className="logint" src="/public/logo.png" alt="Logo"
        style={{
          width: "9%",
          height: "9%",
          marginBottom: "4px",
          marginLeft: "16px",
          marginTop: "16px"
        }}
      />
      <Sidebar />
      <main className="flex-1 ml-64 p-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Transactions</h1>
          
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Donor
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50 transition duration-300 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{transaction.donorName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{transaction.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Transactions;
