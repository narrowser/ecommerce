'use client';
import { useState, useEffect } from 'react';
import { StatsCard } from '@/components/admin/stats-card';
import { apiClient } from '@/lib/api-client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, products: 0 });

  useEffect(() => {
    Promise.all([
      apiClient('/api/orders/admin?pageSize=1').then((r: any) => r.total).catch(() => 0),
      apiClient('/api/products?pageSize=1').then((r: any) => r.total).catch(() => 0),
    ]).then(([orders, products]) => setStats({ orders, products }));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>
      <div className="grid grid-cols-4 gap-4">
        <StatsCard title="总订单" value={stats.orders} />
        <StatsCard title="商品数" value={stats.products} />
        <StatsCard title="用户数" value="-" />
        <StatsCard title="营收" value="-" />
      </div>
    </div>
  );
}
