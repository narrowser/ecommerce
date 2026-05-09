'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => { apiClient('/api/users/me').then((res: any) => { setUser(res.data); setName(res.data.name); }).catch(() => {}); }, []);

  const saveName = async () => {
    await apiClient('/api/users/me', { method: 'PUT', body: JSON.stringify({ name }) });
    setEditing(false);
  };

  if (!user) return <div className="text-center py-20">加载中...</div>;

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">个人中心</h1>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-500">邮箱</label>
          <p className="font-medium">{user.email}</p>
        </div>
        <div>
          <label className="text-sm text-gray-500">用户名</label>
          {editing ? (
            <div className="flex gap-2">
              <input value={name} onChange={e => setName(e.target.value)} className="border rounded px-2 py-1 flex-1" />
              <Button size="sm" onClick={saveName}>保存</Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(false)}>取消</Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <p className="font-medium">{user.name}</p>
              <button onClick={() => setEditing(true)} className="text-sm text-primary">编辑</button>
            </div>
          )}
        </div>
        <div>
          <label className="text-sm text-gray-500">角色</label>
          <p className="font-medium">{user.role}</p>
        </div>
      </div>
    </div>
  );
}
