import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { faculties, majors, programLevels } from '@swap/types';
import { useCompleteProfile } from '../hooks/useCompleteProfile';
import Button from '@swap-web/common/components/Button';
import { Form, FormItem, FormField, FormLabel, FormControl, FormMessage } from '@swap-web/common/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@swap-web/common/components/ui/select';
import { Input } from '@swap-web/common/components/ui/input';
import { Textarea } from '@swap-web/common/components/ui/textarea';

const completeProfileSchema = z.object({
  programLevel: z.enum(programLevels),
  faculty: z.enum(faculties),
  major: z.enum(majors),
  year: z.coerce.number().min(1).max(6),
  bio: z.string().max(200).optional(),
});

type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;

export default function CompleteProfilePage() {
  const form = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      bio: '',
      year: 1,
    },
  });

  const { mutate: completeProfile, isPending } = useCompleteProfile();

  const onSubmit = (data: CompleteProfileFormValues) => {
    completeProfile(data);
  };

  return (
    <div className="container mx-auto flex max-w-md flex-col items-center justify-center gap-y-6 py-12">
      <div className="flex flex-col items-center gap-y-2 text-center">
        <h1 className="text-3xl font-bold">Complete Your Profile</h1>
        <p className="text-muted-foreground">Welcome to Swap! Please fill in your details to continue.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
          <FormField
            control={form.control}
            name="programLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your program level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {programLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="faculty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Faculty</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your faculty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {faculties.map((faculty) => (
                      <SelectItem key={faculty} value={faculty}>
                        {faculty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="major"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Major</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your major" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {majors.map((major) => (
                      <SelectItem key={major} value={major}>
                        {major}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year of Study</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter your year of study" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tell us a little bit about yourself" className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save and Continue'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
