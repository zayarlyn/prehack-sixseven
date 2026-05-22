import { PublicUser } from '@swap/types';

interface UserAvatarProps {
  user: PublicUser;
}

export default function UserAvatar({ user }: UserAvatarProps) {
  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  if (user.avatarUrl) {
    return <img src={user.avatarUrl} alt={user.fullName} className="w-8 h-8 rounded-full" />;
  }

  return (
    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">
      {initials}
    </div>
  );
}
