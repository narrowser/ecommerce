import Link from 'next/link';

export function CategoryNav({ categories }: { categories: any[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/products" className="px-4 py-2 rounded-full bg-gray-100 text-sm hover:bg-primary hover:text-white transition-colors">全部</Link>
      {categories.filter((c: any) => !c.parentId).map((cat: any) => (
        <Link key={cat.id} href={`/products?categoryId=${cat.id}`} className="px-4 py-2 rounded-full bg-gray-100 text-sm hover:bg-primary hover:text-white transition-colors">
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
