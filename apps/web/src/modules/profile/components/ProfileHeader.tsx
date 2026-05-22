import { PublicUser } from '@swap/types';
import UserAvatar from '@swap-web/common/components/UserAvatar';

interface ProfileHeaderProps {
  user: PublicUser;
  isOwnProfile: boolean;
}

export default function ProfileHeader({ user, isOwnProfile }: ProfileHeaderProps) {
  return (
    <div className="border rounded p-6 mb-6">
      <div className="flex items-start gap-4">
        <UserAvatar user={user} />
        <div>
          <h1 className="text-2xl font-bold">{user.fullName}</h1>
          {user.faculty && <p className="text-gray-600">{user.faculty}</p>}
          {user.major && <p className="text-gray-600">{user.major}</p>}
          {user.year && <p className="text-sm text-gray-500">Year {user.year}</p>}
          {isOwnProfile && (
            <a href="/profile/edit" className="text-blue-600">
              Edit Profile
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
