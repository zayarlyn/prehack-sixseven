export interface User {
  id: string;
  microsoftId: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  year: number | null;
  programLevel: 'undergraduate' | 'masters' | 'phd' | null;
  faculty: string | null;
  major: string | null;
  bio: string | null;
  onboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PublicUser = Pick<
  User,
  'id' | 'fullName' | 'avatarUrl' | 'faculty' | 'major' | 'year' | 'programLevel' | 'createdAt'
>;

export interface CompleteProfilePayload {
  year: number;
  programLevel: string;
  faculty: string;
  major: string;
  bio?: string;
}
