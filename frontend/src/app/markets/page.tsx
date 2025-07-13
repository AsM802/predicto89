'use client';

import Layout from '../../components/Layout';
import CategoryFilter from '../../components/CategoryFilter';

export default function MarketsPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Prediction Markets</h1>
          <p className="text-xl text-gray-600">Trade on the outcome of future events</p>
        </div>

        <CategoryFilter />

        <div className="mt-12 text-center text-gray-500 text-lg">
          <p>No markets found</p>
        </div>
      </div>
    </Layout>
  );
}
