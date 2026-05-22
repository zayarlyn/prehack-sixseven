import { useParams } from '@tanstack/react-router';

export default function UserProfilePage() {
  const { userId } = useParams({ from: '/profile/$userId' });

  return <div>User {userId} profile — coming soon</div>;
}
