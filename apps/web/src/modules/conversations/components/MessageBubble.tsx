interface MessageBubbleProps {
  message: string;
  isSent: boolean;
}

export default function MessageBubble({ message, isSent }: MessageBubbleProps) {
  return (
    <div className={`mb-2 flex ${isSent ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs px-4 py-2 rounded ${isSent ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}>
        {message}
      </div>
    </div>
  );
}
