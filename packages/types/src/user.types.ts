import { z } from 'zod';

export const programLevels = ['Undergraduate', 'Postgraduate', 'Diploma'] as const;
export const ProgramLevelSchema = z.enum(programLevels);
export type ProgramLevel = z.infer<typeof ProgramLevelSchema>;

export const faculties = [
  'Faculty of Arts & Social Sciences',
  'Faculty of Business',
  'Faculty of Computing',
  'Faculty of Dentistry',
  'Faculty of Engineering',
  'Faculty of Law',
  'Faculty of Medicine',
  'Faculty of Science',
  'School of Design & Environment',
] as const;
export const FacultySchema = z.enum(faculties);
export type Faculty = z.infer<typeof FacultySchema>;

export const majors = [
  'Computer Science',
  'Information Systems',
  'Business Analytics',
  'Information Security',
  'Computer Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Industrial & Systems Engineering',
  'Engineering Science',
  'Environmental Engineering',
  'Materials Science & Engineering',
  'Biomedical Engineering',
  'Geomatics',
  'Real Estate',
  'Architecture',
  'Industrial Design',
  'Project & Facilities Management',
  'Business Administration',
  'Accountancy',
  'Economics',
  'Psychology',
  'Sociology',
  'Political Science',
  'History',
  'English Language',
  'English Literature',
  'Theatre Studies',
  'Philosophy',
  'Chinese Studies',
  'Malay Studies',
  'Indian Studies',
  'Japanese Studies',
  'Communications & New Media',
  'Social Work',
  'Data Science & Analytics',
  'Statistics',
  'Mathematics',
  'Applied Mathematics',
  'Physics',
  'Chemistry',
  'Life Sciences',
  'Environmental Studies',
  'Food Science & Technology',
  'Pharmaceutical Science',
  'Nursing',
  'Medicine',
  'Dentistry',
  'Law',
] as const;
export const MajorSchema = z.enum(majors);
export type Major = z.infer<typeof MajorSchema>;

export interface User {
  id: string;
  microsoftId: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  year: number | null;
  programLevel: ProgramLevel | null;
  faculty: Faculty | null;
  major: Major | null;
  bio: string | null;
  onboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PublicUser = Pick<
  User,
  'id' | 'fullName' | 'avatarUrl' | 'faculty' | 'major' | 'year' | 'programLevel' | 'bio' | 'createdAt'
> & {
  soldCount?: number;
  purchasedCount?: number;
  memberSince?: Date | string;
};

export interface ProfileStats {
  sold: number;
  purchased: number;
  rating: number | null;
  reviews: number | null;
}

export type SessionUser = Pick<User, 'id' | 'email' | 'fullName' | 'avatarUrl' | 'onboarded'>;

export const CompleteProfileDto = z.object({
  year: z.coerce.number().min(1).max(10),
  programLevel: ProgramLevelSchema,
  faculty: FacultySchema,
  major: MajorSchema,
  bio: z.string().max(200).optional(),
});

export type CompleteProfilePayload = z.infer<typeof CompleteProfileDto>;
