interface ErrorStateProps {
  message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
  return <div className="text-red-600 p-4 text-center">{message}</div>;
}
