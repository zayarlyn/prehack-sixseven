export default function ItemForm() {
  return (
    <form className="space-y-4">
      <input type="text" placeholder="Title" className="w-full border p-2 rounded" />
      <textarea placeholder="Description" className="w-full border p-2 rounded" rows={5} />
      <input type="number" placeholder="Price" className="w-full border p-2 rounded" />
      <select className="w-full border p-2 rounded">
        <option>Category</option>
        <option>Books</option>
        <option>Electronics</option>
      </select>
      <select className="w-full border p-2 rounded">
        <option>Condition</option>
        <option>New</option>
        <option>Like New</option>
        <option>Good</option>
        <option>Fair</option>
      </select>
      <input type="text" placeholder="Pickup Location" className="w-full border p-2 rounded" />
      <label className="flex items-center">
        <input type="checkbox" className="mr-2" />
        <span>Open to offers</span>
      </label>
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        Post Item
      </button>
    </form>
  );
}
