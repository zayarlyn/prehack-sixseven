interface MessageInputProps {
  onSend: (message: string) => void;
}

export default function MessageInput({ onSend: _onSend }: MessageInputProps) {
  return (
    <div className="flex gap-2 border-t p-4">
      <input type="text" placeholder="Type a message..." className="flex-1 border p-2 rounded" />
      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Send</button>
    </div>
  );
}
