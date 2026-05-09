'use client';
import { useState, useEffect } from 'react';
import { StatsCard } from '@/components/admin/stats-card';
import { apiClient } from '@/lib/api-client';

export default function SupplierDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0 });

  useEffect(() => {
    Promise.all([
      apiClient('/api/products/mine?pageSize=1').then((r: any) => r.total).catch(() => 0),
      apiClient('/api/orders/supplier?pageSize=1').then((r: any) => r.total).catch(() => 0),
    ]).then(([products, orders]) => setStats({ products, orders }));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">供应商仪表盘</h1>
      <div className="grid grid-cols-3 gap-4">
        <StatsCard title="我的商品" value={stats.products} />
        <StatsCard title="相关订单" value={stats.orders} />
        <StatsCard title="本月收入" value="-" />
      </div>
    </div>
  );
}
