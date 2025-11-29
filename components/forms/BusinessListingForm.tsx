'use client';

import { useTransition, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';

const createFormSchema = (dict: any) => z.object({
  type: z.array(z.string()).min(1, dict.publish_page.form.validation.required),
  category: z.array(z.string()).min(1, dict.publish_page.form.validation.required),
  name: z.string().min(1, dict.publish_page.form.validation.required),
  description: z.string().max(1000).optional(),
  website: z.string().url().optional().or(z.literal('')),
  address: z.string().optional(),
  phone: z.string().min(1, dict.publish_page.form.validation.required),
  email: z.string().email(dict.publish_page.form.validation.email_invalid),
  image_url: z.any(),
});

export function BusinessListingForm({ dict }: { dict: any }) {
  const [isPending, startTransition] = useTransition();
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const formSchema = createFormSchema(dict);
  
  const { register, handleSubmit, formState: { errors }, control, reset, watch } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: [],
      category: [],
      name: '',
      description: '',
      website: '',
      address: '',
      phone: '',
      email: '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const onSubmit = (data: any) => {
    startTransition(async () => {
      let imageUrl = '';

      if (imageFile) {
        const supabase = createClient();
        const filePath = `public/${Date.now()}-${imageFile.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('business-images')
          .upload(filePath, imageFile);

        if (uploadError) {
          toast.error(`Image upload failed: ${uploadError.message}`);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from('business-images')
          .getPublicUrl(filePath);

        if (!publicUrlData.publicUrl) {
            toast.error('Failed to get public URL for image');
            return;
        }
        imageUrl = publicUrlData.publicUrl;
      }

      const submissionData = {
        ...data,
        image_url: imageUrl,
      };

      const response = await fetch('/api/business-listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        toast.success(dict.forms.submission_success);
        reset();
        setImageFile(null);
        const fileInput = document.getElementById('image_upload') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
      } else {
        const result = await response.json();
        toast.error(dict.forms.submission_failed.replace('{error}', result.error));
      }
    });
  };

  const typeOptions = [
    { id: 'introduction', label: dict.publish_page.form.org_intro },
    { id: 'business', label: dict.publish_page.form.business_info },
    { id: 'other', label: dict.publish_page.form.other },
  ];

  const categoryOptions = [
    { id: 'licensed_corp', label: dict.publish_page.form.licensed_corp },
    { id: 'cpa', label: dict.publish_page.form.cpa },
    { id: 'law_firm', label: dict.publish_page.form.law_firm },
    { id: 'compliance', label: dict.publish_page.form.compliance },
    { id: 'other', label: dict.publish_page.form.other },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 rounded-lg border shadow-sm">
      
      {/* Content Type */}
      <div className="space-y-3">
        <Label>{dict.publish_page.form.publish_content}</Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-4">
              {typeOptions.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type_${item.id}`}
                    checked={field.value?.includes(item.id)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange([...(field.value || []), item.id])
                        : field.onChange(field.value?.filter((value: string) => value !== item.id));
                    }}
                  />
                  <Label htmlFor={`type_${item.id}`} className="font-normal">{item.label}</Label>
                </div>
              ))}
            </div>
          )}
        />
        {errors.type && <p className="text-red-500 text-sm">{errors.type.message as string}</p>}
      </div>

      {/* Organization Type */}
      <div className="space-y-3">
        <Label>{dict.publish_page.form.org_type}</Label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categoryOptions.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat_${item.id}`}
                    checked={field.value?.includes(item.id)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange([...(field.value || []), item.id])
                        : field.onChange(field.value?.filter((value: string) => value !== item.id));
                    }}
                  />
                  <Label htmlFor={`cat_${item.id}`} className="font-normal">{item.label}</Label>
                </div>
              ))}
            </div>
          )}
        />
        {errors.category && <p className="text-red-500 text-sm">{errors.category.message as string}</p>}
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="description">{dict.publish_page.form.description}</Label>
          <Textarea 
            id="description" 
            {...register('description')} 
            placeholder={dict.publish_page.form.description_placeholder} 
            className="h-32"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message as string}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
            <div>
            <Label htmlFor="website">{dict.publish_page.form.website}</Label>
            <Input id="website" {...register('website')} />
            {errors.website && <p className="text-red-500 text-sm">{errors.website.message as string}</p>}
            </div>
            <div>
            <Label htmlFor="phone">{dict.publish_page.form.phone}</Label>
            <Input id="phone" {...register('phone')} />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message as string}</p>}
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
            <div>
            <Label htmlFor="email">{dict.publish_page.form.email}</Label>
            <Input id="email" {...register('email')} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message as string}</p>}
            </div>
            <div>
            <Label htmlFor="address">{dict.publish_page.form.address}</Label>
            <Input id="address" {...register('address')} />
            </div>
        </div>

        <div>
          <Label htmlFor="image_upload">{dict.publish_page.form.image}</Label>
          <Input 
            id="image_upload" 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? dict.forms.submitting : dict.publish_page.form.submit}
      </Button>
    </form>
  );
}
