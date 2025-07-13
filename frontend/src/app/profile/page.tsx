'use client';

import Layout from '../../components/Layout';
import ProfileComponent from '../../components/Profile';

export default function ProfilePage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <ProfileComponent />
      </div>
    </Layout>
  );
}
