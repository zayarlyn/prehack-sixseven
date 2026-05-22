import CategoryChips from './CategoryChips';
import SortDropdown from './SortDropdown';

export default function FilterBar() {
  return (
    <div className="flex gap-4 mb-6">
      <CategoryChips />
      <SortDropdown />
    </div>
  );
}
