import { Avatar, AvatarFallback, AvatarImage } from '@swap-web/common/components/ui/avatar';
import { avatarBg } from '@swap-web/common/lib/avatar-color';

interface AvatarUser {
  fullName: string;
  avatarUrl: string | null;
}

interface UserAvatarProps {
  user: AvatarUser;
  size?: number;
}

export default function UserAvatar({ user, size = 32 }: UserAvatarProps) {
  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Avatar style={{ width: size, height: size }}>
      <AvatarImage src={user.avatarUrl ?? undefined} alt={user.fullName} />
      <AvatarFallback
        style={{
          background: avatarBg(user.fullName),
          color: '#1a1a1a',
          fontSize: size * 0.36,
          fontWeight: 700,
        }}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
