'use client';

import Layout from '../../components/Layout';
import CreateMarketForm from '../../components/CreateMarketForm';

export default function CreateMarketPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <CreateMarketForm />
      </div>
    </Layout>
  );
}
