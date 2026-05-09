'use client';
import { Button } from '@/components/ui/button';

interface Props {
  page: number; total: number; pageSize: number;
  onChange: (page: number) => void;
}
export function Pagination({ page, total, pageSize, onChange }: Props) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>上一页</Button>
      <span className="text-sm text-gray-600">第 {page}/{totalPages} 页</span>
      <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>下一页</Button>
    </div>
  );
}
