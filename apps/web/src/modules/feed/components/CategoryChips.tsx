export default function CategoryChips() {
  const categories = ['Books', 'Electronics', 'Furniture', 'Clothing', 'Other'];

  return (
    <div className="flex gap-2">
      {categories.map((cat) => (
        <button key={cat} className="px-3 py-1 border rounded hover:bg-gray-100">
          {cat}
        </button>
      ))}
    </div>
  );
}
