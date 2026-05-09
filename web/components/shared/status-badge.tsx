const statusMap: Record<string, { label: string; className: string }> = {
  PENDING_PAYMENT: { label: '待支付', className: 'bg-yellow-100 text-yellow-800' },
  PAID: { label: '已支付', className: 'bg-blue-100 text-blue-800' },
  SHIPPED: { label: '已发货', className: 'bg-purple-100 text-purple-800' },
  DELIVERED: { label: '已收货', className: 'bg-indigo-100 text-indigo-800' },
  COMPLETED: { label: '已完成', className: 'bg-green-100 text-green-800' },
  CANCELLED: { label: '已取消', className: 'bg-red-100 text-red-800' },
  PENDING: { label: '待处理', className: 'bg-gray-100 text-gray-800' },
  APPROVED: { label: '已通过', className: 'bg-green-100 text-green-800' },
  REJECTED: { label: '已拒绝', className: 'bg-red-100 text-red-800' },
};

export function StatusBadge({ status }: { status: string }) {
  const s = statusMap[status] || { label: status, className: 'bg-gray-100' };
  return <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.className}`}>{s.label}</span>;
}
