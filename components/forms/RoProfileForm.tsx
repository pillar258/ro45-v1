'use client';

import { useTransition, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';

// A factory function to create the schema with translations
const createFormSchema = (dict: any) => z.object({
  name_en: z.string().min(2, dict.forms.ro_profile_form.validation.name_en_required),
  name_zh: z.string().optional(),
  central_entity_number: z.string().optional(),
  license_types: z.array(z.string()).nonempty(dict.forms.ro_profile_form.validation.license_types_required),
  industry_experience: z.string().optional(),
  languages: z.array(z.string()).optional(),
  is_director: z.boolean().default(false),
  is_hong_kong_resident: z.boolean().default(false),
  availability_date: z.string().optional(),
  expected_salary: z.string().optional(),
  contact_info: z.object({
    phone: z.string().min(8, dict.forms.ro_profile_form.validation.phone_required),
    email: z.string().email(dict.forms.ro_profile_form.validation.email_invalid),
  }),
  cv_url: z.any(), // File upload will be handled separately
});

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

export function RoProfileForm({ dict }: { dict: any }) {
  const [isPending, startTransition] = useTransition();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const formSchema = createFormSchema(dict);

  const { register, handleSubmit, formState: { errors }, control, reset } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      license_types: [],
      languages: [],
      is_director: false,
      is_hong_kong_resident: false,
      contact_info: {
        phone: '',
        email: '',
      },
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCvFile(file);
    }
  };

  const onSubmit = (data: any) => {
    startTransition(async () => {
      let cvUrl = '';

      if (cvFile) {
        const supabase = createClient();
        const filePath = `public/${Date.now()}-${cvFile.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('cv-uploads')
          .upload(filePath, cvFile);

        if (uploadError) {
          toast.error(`CV upload failed: ${uploadError.message}`);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from('cv-uploads')
          .getPublicUrl(filePath);

        if (!publicUrlData.publicUrl) {
            toast.error('Failed to get public URL for CV');
            return;
        }
        cvUrl = publicUrlData.publicUrl;
      }

      const submissionData = {
        ...data,
        cv_url: cvUrl,
      };

      const response = await fetch('/api/ro-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        toast.success(dict.forms.submission_success);
        reset();
        setCvFile(null);
        // Manually reset file input if needed
        const fileInput = document.getElementById('cv_upload') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
      } else {
        const result = await response.json();
        toast.error(dict.forms.submission_failed.replace('{error}', result.error));
      }
    });
  };

  const licenseOptions = Object.entries(dict.forms.ro_profile_form.license_options).map(([key, value]) => ({
    id: key,
    label: value as string,
  }));

  const languageOptions = Object.entries(dict.forms.ro_profile_form.language_options).map(([key, value]) => ({
    id: key,
    label: value as string,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="not-prose space-y-8 p-8 border rounded-lg bg-white shadow-md">
      <h2 className="text-2xl font-semibold border-b pb-4">{dict.forms.ro_profile_form.title}</h2>
      
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name_en">{dict.forms.ro_profile_form.name_en}</Label>
          <Input id="name_en" {...register('name_en')} placeholder={dict.forms.ro_profile_form.name_en_placeholder} />
          {errors.name_en && <p className="text-red-500 text-sm">{errors.name_en.message}</p>}
        </div>
        <div>
          <Label htmlFor="name_zh">{dict.forms.ro_profile_form.name_zh}</Label>
          <Input id="name_zh" {...register('name_zh')} placeholder={dict.forms.ro_profile_form.name_zh_placeholder} />
        </div>
      </div>

      {/* Professional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="central_entity_number">{dict.forms.ro_profile_form.central_entity_number}</Label>
          <Input id="central_entity_number" {...register('central_entity_number')} />
        </div>
        <div>
          <Label htmlFor="industry_experience">{dict.forms.ro_profile_form.industry_experience}</Label>
          <Input id="industry_experience" type="number" {...register('industry_experience')} />
        </div>
      </div>

      {/* License Types */}
      <div>
        <Label>{dict.forms.ro_profile_form.license_types}</Label>
        <Controller
          name="license_types"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {licenseOptions.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`ro_license_${item.id}`}
                    checked={field.value?.includes(item.id)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange([...(field.value || []), item.id])
                        : field.onChange(field.value?.filter((value) => value !== item.id));
                    }}
                  />
                  <Label htmlFor={`ro_license_${item.id}`} className="font-normal">{item.label}</Label>
                </div>
              ))}
            </div>
          )}
        />
        {errors.license_types && <p className="text-red-500 text-sm">{errors.license_types.message}</p>}
      </div>

      {/* Languages */}
      <div>
        <Label>{dict.forms.ro_profile_form.languages}</Label>
        <Controller
          name="languages"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-4 mt-2">
              {languageOptions.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`language_${item.id}`}
                    checked={field.value?.includes(item.id)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange([...(field.value || []), item.id])
                        : field.onChange(field.value?.filter((value) => value !== item.id));
                    }}
                  />
                  <Label htmlFor={`language_${item.id}`} className="font-normal">{item.label}</Label>
                </div>
              ))}
            </div>
          )}
        />
      </div>

      {/* Preferences */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Controller
            name="is_director"
            control={control}
            render={({ field }) => (
              <Checkbox id="is_director" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label htmlFor="is_director" className="font-normal">{dict.forms.ro_profile_form.is_director}</Label>
        </div>
        <div className="flex items-center gap-2">
          <Controller
            name="is_hong_kong_resident"
            control={control}
            render={({ field }) => (
              <Checkbox id="is_hong_kong_resident" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label htmlFor="is_hong_kong_resident" className="font-normal">{dict.forms.ro_profile_form.is_hong_kong_resident}</Label>
        </div>
      </div>

      {/* Availability and Salary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="availability_date">{dict.forms.ro_profile_form.availability_date}</Label>
          <Input id="availability_date" type="date" {...register('availability_date')} />
        </div>
        <div>
          <Label htmlFor="expected_salary">{dict.forms.ro_profile_form.expected_salary}</Label>
          <Input id="expected_salary" {...register('expected_salary')} />
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="contact_phone">{dict.forms.ro_profile_form.contact_phone}</Label>
          <Input id="contact_phone" {...register('contact_info.phone')} />
          {errors.contact_info?.phone && <p className="text-red-500 text-sm">{errors.contact_info.phone.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">{dict.forms.ro_profile_form.email}</Label>
          <Input id="email" type="email" {...register('contact_info.email')} />
          {errors.contact_info?.email && <p className="text-red-500 text-sm">{errors.contact_info.email.message}</p>}
        </div>
      </div>
      
      {/* CV Upload */}
      <div>
        <Label htmlFor="cv_upload">{dict.forms.ro_profile_form.cv_upload}</Label>
        <Input id="cv_upload" type="file" onChange={handleFileChange} />
        {/* Note: File upload logic needs to be implemented separately */}
      </div>

      <Button type="submit" disabled={isPending} className="w-full md:w-auto">
        {isPending ? dict.forms.ro_profile_form.submitting : dict.forms.ro_profile_form.submit}
      </Button>
    </form>
  );
}
