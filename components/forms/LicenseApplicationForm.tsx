'use client';

import { useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Locale } from '@/i18n';

// This component now needs the dictionary
interface LicenseApplicationPageProps {
  params: { locale: Locale };
  dictionary: any; // A more specific type can be created
}

const formSchema = z.object({
  applicant_type: z.enum(['company', 'individual']),
  applicant_name: z.string().min(2, 'Name is required'),
  location: z.string().optional(),
  industry_and_domain: z.array(z.string()).optional(),
  other_industry: z.string().optional(),
  license_types_applied: z.array(z.string()).nonempty('Please select at least one license type'),
  has_ro_candidate: z.boolean().default(false),
  contact_phone: z.string().min(8, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  wechat: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const licenseTypes = [
  { id: 'type1', label: 'Type 1' },
  { id: 'type4', label: 'Type 4' },
  { id: 'type6', label: 'Type 6' },
  { id: 'type9', label: 'Type 9' },
];

const industries = [
  { id: 'asset_management', label: 'Asset Management' },
  { id: 'securities_brokerage', label: 'Securities Brokerage' },
  { id: 'investment_banking', label: 'Investment Banking' },
  { id: 'family_office', label: 'Family Office' },
];

// The page component needs to be wrapped in a server component to fetch the dictionary
// So we create the client component part here.
export function LicenseApplicationForm({ dict }: { dict: any }) {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, formState: { errors }, control, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicant_type: 'company',
      has_ro_candidate: false,
      license_types_applied: [],
      industry_and_domain: [],
    },
  });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      const response = await fetch('/api/license-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(dict.forms.submission_success);
        reset();
      } else {
        const result = await response.json();
        toast.error(dict.forms.submission_failed.replace('{error}', result.error));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="not-prose space-y-8">
      {/* Applicant Type */}
      <Controller
        name="applicant_type"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label>{dict.forms.applicant_type}</Label>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="company" id="company" />
                <Label htmlFor="company">{dict.forms.company}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="individual" id="individual" />
                <Label htmlFor="individual">{dict.forms.individual}</Label>
              </div>
            </RadioGroup>
          </div>
        )}
      />

      {/* Applicant Name */}
      <div>
        <Label htmlFor="applicant_name">{dict.forms.applicant_name}</Label>
        <Input id="applicant_name" {...register('applicant_name')} />
        {errors.applicant_name && <p className="text-red-500 text-sm">{errors.applicant_name.message}</p>}
      </div>

      {/* License Types Applied */}
      <div>
        <Label>{dict.forms.license_types_applied}</Label>
        <Controller
          name="license_types_applied"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {licenseTypes.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`license_${item.id}`}
                    checked={field.value?.includes(item.id)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange([...(field.value || []), item.id])
                        : field.onChange(field.value?.filter((value) => value !== item.id));
                    }}
                  />
                  <Label htmlFor={`license_${item.id}`}>{item.label}</Label>
                </div>
              ))}
            </div>
          )}
        />
        {errors.license_types_applied && <p className="text-red-500 text-sm">{errors.license_types_applied.message}</p>}
      </div>

      {/* Contact Phone */}
      <div>
        <Label htmlFor="contact_phone">{dict.forms.contact_phone}</Label>
        <Input id="contact_phone" {...register('contact_phone')} />
        {errors.contact_phone && <p className="text-red-500 text-sm">{errors.contact_phone.message}</p>}
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email">{dict.forms.email}</Label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      
      {/* WeChat */}
      <div>
        <Label htmlFor="wechat">{dict.forms.wechat}</Label>
        <Input id="wechat" {...register('wechat')} />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? dict.forms.submitting : dict.forms.submit}
      </Button>
    </form>
  );
}
