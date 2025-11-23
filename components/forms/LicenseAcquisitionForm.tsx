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

const formSchema = z.object({
  acquirer_type: z.enum(['company', 'individual']),
  acquirer_name: z.string().min(2, 'Name is required'),
  location: z.string().optional(),
  industry_and_domain: z.array(z.string()).optional(),
  other_industry: z.string().optional(),
  license_types_sought: z.array(z.string()).nonempty('Please select at least one license type'),
  budget: z.string().optional(),
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

export function LicenseAcquisitionForm({ dict }: { dict: any }) {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, formState: { errors }, control, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      acquirer_type: 'company',
      license_types_sought: [],
      industry_and_domain: [],
    },
  });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      const response = await fetch('/api/license-acquisitions', {
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
      {/* Acquirer Type */}
      <Controller
        name="acquirer_type"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label>{dict.forms.applicant_type}</Label> {/* Reusing translation */}
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="company" id="acq_company" />
                <Label htmlFor="acq_company">{dict.forms.company}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="individual" id="acq_individual" />
                <Label htmlFor="acq_individual">{dict.forms.individual}</Label>
              </div>
            </RadioGroup>
          </div>
        )}
      />

      {/* Acquirer Name */}
      <div>
        <Label htmlFor="acquirer_name">{dict.forms.applicant_name}</Label> {/* Reusing translation */}
        <Input id="acquirer_name" {...register('acquirer_name')} />
        {errors.acquirer_name && <p className="text-red-500 text-sm">{errors.acquirer_name.message}</p>}
      </div>

      {/* License Types Sought */}
      <div>
        <Label>{dict.forms.license_types_sought}</Label>
        <Controller
          name="license_types_sought"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {licenseTypes.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`acq_license_${item.id}`}
                    checked={field.value?.includes(item.id)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange([...(field.value || []), item.id])
                        : field.onChange(field.value?.filter((value) => value !== item.id));
                    }}
                  />
                  <Label htmlFor={`acq_license_${item.id}`}>{item.label}</Label>
                </div>
              ))}
            </div>
          )}
        />
        {errors.license_types_sought && <p className="text-red-500 text-sm">{errors.license_types_sought.message}</p>}
      </div>

      {/* Budget */}
      <div>
        <Label htmlFor="budget">{dict.forms.budget}</Label>
        <Input id="budget" {...register('budget')} />
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
      
      <Button type="submit" disabled={isPending}>
        {isPending ? dict.forms.submitting : dict.forms.submit}
      </Button>
    </form>
  );
}
