import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const DonationPage = () => {
  const { referralCode } = useParams();
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [phno,setphno] = useState('');
  const [email,setemail] = useState('');
  const [ref,setref] = useState('');
  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://nayepankh-foundation.vercel.app/api/donations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donorName,
          amount: Number(amount),
          referralCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Thank you for your donation!');
        setDonorName('');
        setAmount('');
        setemail('');
        setref('');
        setphno('');
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Failed to process donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <Heart className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Make a Donation</h1>
          <p className="text-gray-600 mt-2">Support NayePankh Foundation</p>
        </div>

        <form onSubmit={handleDonation}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              min="1"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phno" className="block text-sm font-medium text-gray-700 mb-1">
              Referral Code (If available)
            </label>
            <input
              type="text"
              id="ref"
              value={ref}
              onChange={(e) => setref(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              min="1"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phno" className="block text-sm font-medium text-gray-700 mb-1">
              Phone No 
            </label>
            <input
              type="text"
              id="phno"
              value={phno}
              onChange={(e) => setphno(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              min="1"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Donation Amount (₹)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              min="1"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Donate Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonationPage;
