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
  acquisition_method: z.array(z.string()).nonempty('Please select at least one acquisition method'),
  acquirer_type: z.enum(['company', 'individual']),
  acquirer_name: z.string().min(2, 'Name is required'),
  license_types_sought: z.array(z.string()).optional(),
  other_license_type: z.string().optional(),
  budget: z.string().optional(),
  contact_phone: z.string().min(8, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  wechat: z.string().optional(),
}).refine(data => {
    return (data.license_types_sought && data.license_types_sought.length > 0) || (data.other_license_type && data.other_license_type.length > 0);
}, {
    message: "Please select at least one license type or specify other",
    path: ["license_types_sought"]
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
      acquisition_method: [],
      acquirer_type: 'company',
      license_types_sought: [],
      other_license_type: '',
      budget: '',
      wechat: '',
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
    <form onSubmit={handleSubmit(onSubmit)} className="not-prose space-y-8 p-8 border rounded-lg bg-white shadow-md">
      <h2 className="text-2xl font-semibold border-b pb-4">{dict.nav.licenseAcquisition}</h2>
      
      {/* Acquisition Method */}
      <div>
        <Label className="text-base font-semibold mb-4 block">{dict.forms.acquisition_method}</Label>
        <Controller
          name="acquisition_method"
          control={control}
          render={({ field }) => (
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                    id="method_apply"
                    checked={field.value?.includes('apply')}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange([...(field.value || []), 'apply'])
                        : field.onChange(field.value?.filter((value) => value !== 'apply'));
                    }}
                />
                <Label htmlFor="method_apply" className="font-normal">{dict.forms.apply}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                    id="method_acquire"
                    checked={field.value?.includes('acquire')}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange([...(field.value || []), 'acquire'])
                        : field.onChange(field.value?.filter((value) => value !== 'acquire'));
                    }}
                />
                <Label htmlFor="method_acquire" className="font-normal">{dict.forms.acquire}</Label>
              </div>
            </div>
          )}
        />
        {errors.acquisition_method && <p className="text-red-500 text-sm mt-1">{errors.acquisition_method.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Acquirer Type */}
        <Controller
          name="acquirer_type"
          control={control}
          render={({ field }) => (
            <div className="space-y-3">
              <Label className="font-semibold">{dict.forms.applicant_type}</Label>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="company" id="acq_company" />
                  <Label htmlFor="acq_company" className="font-normal">{dict.forms.company}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individual" id="acq_individual" />
                  <Label htmlFor="acq_individual" className="font-normal">{dict.forms.individual}</Label>
                </div>
              </RadioGroup>
            </div>
          )}
        />

        {/* Acquirer Name */}
        <div>
          <Label htmlFor="acquirer_name" className="font-semibold">{dict.forms.applicant_name}</Label>
          <Input id="acquirer_name" {...register('acquirer_name')} className="mt-2" />
          {errors.acquirer_name && <p className="text-red-500 text-sm mt-1">{errors.acquirer_name.message}</p>}
        </div>
      </div>

      {/* License Types Needed */}
      <div>
        <Label className="text-base font-semibold mb-4 block">{dict.forms.license_types_needed}</Label>
        <div className="flex flex-wrap items-center gap-4">
            <Controller
              name="license_types_sought"
              control={control}
              render={({ field }) => (
                <>
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
                      <Label htmlFor={`acq_license_${item.id}`} className="font-normal">{item.label}</Label>
                    </div>
                  ))}
                </>
              )}
            />
            <div className="flex items-center gap-2">
                <Label htmlFor="other_license_type" className="font-normal whitespace-nowrap">{dict.forms.other}</Label>
                <Input 
                    id="other_license_type" 
                    {...register('other_license_type')} 
                    className="w-40 h-8"
                    placeholder=""
                />
            </div>
        </div>
        {errors.license_types_sought && <p className="text-red-500 text-sm mt-1">{errors.license_types_sought.message}</p>}
      </div>

      {/* Budget */}
      <div>
        <Label htmlFor="budget" className="font-semibold">{dict.forms.budget}</Label>
        <Input id="budget" {...register('budget')} className="mt-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Phone */}
        <div>
          <Label htmlFor="contact_phone" className="font-semibold">{dict.forms.contact_phone}</Label>
          <Input id="contact_phone" {...register('contact_phone')} className="mt-2" />
          {errors.contact_phone && <p className="text-red-500 text-sm mt-1">{errors.contact_phone.message}</p>}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="font-semibold">{dict.forms.email}</Label>
          <Input id="email" type="email" {...register('email')} className="mt-2" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
      </div>
      
      {/* WeChat */}
      <div>
        <Label htmlFor="wechat" className="font-semibold">{dict.forms.wechat}</Label>
        <Input id="wechat" {...register('wechat')} className="mt-2" />
      </div>

      <Button type="submit" disabled={isPending} className="w-full md:w-auto">
        {isPending ? dict.forms.submitting : dict.forms.submit}
      </Button>
    </form>
  );
}
