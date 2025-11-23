'use client';

import { useTransition, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const searchSchema = z.object({
  license_types: z.array(z.string()).optional(),
  industry_experience: z.string().optional(),
  languages: z.array(z.string()).optional(),
  is_director: z.boolean().optional(),
  is_hong_kong_resident: z.boolean().optional(),
});

type SearchFormData = z.infer<typeof searchSchema>;

export function RoSearchForm({ dict, onSearch }: { dict: any, onSearch: (data: SearchFormData) => void }) {
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, control } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      license_types: [],
      languages: [],
    },
  });

  const handleSearch = (data: SearchFormData) => {
    startTransition(() => {
      onSearch(data);
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
    <form onSubmit={handleSubmit(handleSearch)} className="not-prose space-y-8 mt-16 p-8 border rounded-lg">
      <h2 className="text-2xl font-semibold">{dict.forms.ro_search_form.title}</h2>
      
      {/* License Types */}
      <div>
        <Label>{dict.forms.ro_search_form.license_types}</Label>
        <Controller
          name="license_types"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {licenseOptions.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`search_license_${item.id}`}
                    checked={field.value?.includes(item.id)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange([...(field.value || []), item.id])
                        : field.onChange(field.value?.filter((value) => value !== item.id));
                    }}
                  />
                  <Label htmlFor={`search_license_${item.id}`} className="font-normal">{item.label}</Label>
                </div>
              ))}
            </div>
          )}
        />
      </div>

      {/* Industry Experience */}
      <div>
        <Label htmlFor="industry_experience">{dict.forms.ro_search_form.industry_experience}</Label>
        <Input id="industry_experience" type="number" {...register('industry_experience')} />
      </div>

      {/* Languages */}
      <div>
        <Label>{dict.forms.ro_search_form.languages}</Label>
        <Controller
          name="languages"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-4 mt-2">
              {languageOptions.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`search_language_${item.id}`}
                    checked={field.value?.includes(item.id)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange([...(field.value || []), item.id])
                        : field.onChange(field.value?.filter((value) => value !== item.id));
                    }}
                  />
                  <Label htmlFor={`search_language_${item.id}`} className="font-normal">{item.label}</Label>
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
              <Checkbox id="search_is_director" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label htmlFor="search_is_director" className="font-normal">{dict.forms.ro_search_form.is_director}</Label>
        </div>
        <div className="flex items-center gap-2">
          <Controller
            name="is_hong_kong_resident"
            control={control}
            render={({ field }) => (
              <Checkbox id="search_is_hong_kong_resident" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label htmlFor="search_is_hong_kong_resident" className="font-normal">{dict.forms.ro_search_form.is_hong_kong_resident}</Label>
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="w-full md:w-auto">
        {isPending ? dict.forms.ro_search_form.searching_button : dict.forms.ro_search_form.search_button}
      </Button>
    </form>
  );
}
