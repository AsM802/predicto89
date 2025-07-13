'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../api';

const CreateMarketForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [outcomeType, setOutcomeType] = useState('YES_NO'); // Default to YES_NO
  const [outcomes, setOutcomes] = useState(['Yes', 'No']); // Default for YES_NO
  const [expiryDate, setExpiryDate] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleOutcomeChange = (index: number, value: string) => {
    const newOutcomes = [...outcomes];
    newOutcomes[index] = value;
    setOutcomes(newOutcomes);
  };

  const addOutcome = () => {
    setOutcomes([...outcomes, '']);
  };

  const removeOutcome = (index: number) => {
    const newOutcomes = outcomes.filter((_, i) => i !== index);
    setOutcomes(newOutcomes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (!expiryDate || isNaN(new Date(expiryDate).getTime())) {
      setMessage('Please provide a valid expiry date.');
      return;
    }

    try {
      const marketData = {
        title,
        description,
        outcomeType,
        outcomes: outcomes.map(o => ({ name: o, liquidity: 0, odds: 0.5 })), // Basic structure
        expiryDate: new Date(expiryDate).toISOString(),
      };
      await api.post('/api/markets', marketData);
      setMessage('Market created successfully!');
      router.push('/dashboard'); // Redirect to dashboard or market list
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to create market');
      console.error('Error creating market:', error.response?.data || error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center">Create New Market</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="outcomeType" className="block text-sm font-medium text-gray-700">Outcome Type</label>
          <select
            id="outcomeType"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={outcomeType}
            onChange={(e) => {
              setOutcomeType(e.target.value);
              // Reset outcomes based on type
              if (e.target.value === 'YES_NO') {
                setOutcomes(['Yes', 'No']);
              } else {
                setOutcomes(['']); // Start with one empty for other types
              }
            }}
            required
          >
            <option value="YES_NO">Yes/No</option>
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            {/* <option value="NUMERIC_RANGE">Numeric Range</option> */}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Outcomes</label>
          {outcomes.map((outcome, index) => (
            <div key={index} className="flex items-center mt-2">
              <input
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={outcome}
                onChange={(e) => handleOutcomeChange(index, e.target.value)}
                placeholder={`Outcome ${index + 1}`}
                required
              />
              {outcomes.length > 2 && outcomeType !== 'YES_NO' && (
                <button
                  type="button"
                  onClick={() => removeOutcome(index)}
                  className="ml-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 hover:bg-red-100"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          {outcomeType !== 'YES_NO' && (
            <button
              type="button"
              onClick={addOutcome}
              className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Outcome
            </button>
          )}
        </div>
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date</label>
          <input
            type="datetime-local"
            id="expiryDate"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Market
        </button>
        {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  );
};

export default CreateMarketForm;
