export default function ImageUploader() {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded p-8 text-center">
      <p className="text-gray-600 mb-2">Add photos</p>
      <input type="file" multiple className="hidden" />
    </div>
  );
}
