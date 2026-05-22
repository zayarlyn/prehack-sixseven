interface SystemMessageProps {
  content: string;
}

export default function SystemMessage({ content }: SystemMessageProps) {
  return (
    <div className="flex justify-center mb-4">
      <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs">{content}</span>
    </div>
  );
}
