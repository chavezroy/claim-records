'use client';

import { useRouter } from 'next/navigation';

interface CategoryFilterProps {
  categories: string[];
  currentCategory?: string;
}

export default function CategoryFilter({ categories, currentCategory }: CategoryFilterProps) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const url = new URL(window.location.href);
    if (e.target.value) {
      url.searchParams.set('category', e.target.value);
    } else {
      url.searchParams.delete('category');
    }
    router.push(url.pathname + url.search);
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <label className="mr-2">Category:</label>
      <select
        className="border rounded px-3 py-2"
        value={currentCategory || ''}
        onChange={handleChange}
      >
        <option value="">All Categories</option>
        {categories.map((cat: string) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}

