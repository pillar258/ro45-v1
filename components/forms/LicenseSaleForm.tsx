'use client';

import { useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';

// Define the schema for the form
const createLicenseSaleSchema = (dict: any) => z.object({
  license_types: z.array(z.string()).nonempty({ message: dict.validation.license_types_required }),
  established_date: z.string().nonempty({ message: dict.validation.field_required }),
  shareholder_count: z.coerce.number().min(0, { message: dict.validation.field_required }),
  has_holding_structure: z.string().nonempty({ message: dict.validation.field_required }),
  is_holding_company_sold: z.string().nonempty({ message: dict.validation.field_required }),
  ro_count: z.coerce.number().min(0, { message: dict.validation.field_required }),
  employee_count: z.coerce.number().min(0, { message: dict.validation.field_required }),
  total_compensation: z.string().nonempty({ message: dict.validation.field_required }),
  asking_price: z.coerce.number().positive({ message: dict.validation.positive_number_required }),
  contact_phone: z.string().nonempty({ message: dict.validation.phone_required }),
  email: z.string().email({ message: dict.validation.email_invalid }),
  wechat: z.string().optional(),
});

type LicenseSaleFormValues = z.infer<ReturnType<typeof createLicenseSaleSchema>>;

export function LicenseSaleForm({ dict }: { dict: any }) {
  const [isPending, startTransition] = useTransition();
  const t = dict.forms.license_sale_form;

  const formSchema = createLicenseSaleSchema(t);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      license_types: [],
      ro_count: 0,
      shareholder_count: 0,
      employee_count: 0,
    },
  });

  const onSubmit = (values: any) => {
    startTransition(async () => {
      try {
        const response = await fetch('/api/license-sales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Something went wrong');
        }

        toast.success(dict.forms.submission_success);
        form.reset();
      } catch (error: any) {
        toast.error(`${dict.forms.submission_failed} ${error.message}`);
      }
    });
  };

  const licenseOptions = Object.entries(dict.forms.ro_profile_form.license_options).map(([key, value]) => ({
    id: key,
    label: value as string,
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="not-prose space-y-8 p-8 border rounded-lg bg-white shadow-md">
        <h2 className="text-2xl font-semibold border-b pb-4">{t.title}</h2>

        <FormField
          control={form.control}
          name="license_types"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base font-semibold">{t.license_types}</FormLabel>
                <FormDescription>{t.license_types_desc}</FormDescription>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {licenseOptions.map((option) => (
                  <FormField
                    key={option.id}
                    control={form.control}
                    name="license_types"
                    render={({ field }) => {
                      return (
                        <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(option.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), option.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== option.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{option.label}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="established_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">{t.established_date}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shareholder_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">{t.shareholder_count}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={typeof field.value === 'number' ? field.value : Number(field.value ?? 0)}
                      onChange={e => field.onChange(Number((e.target as HTMLInputElement).value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="has_holding_structure"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="font-semibold">{t.has_holding_structure}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl><RadioGroupItem value="yes" /></FormControl>
                        <FormLabel className="font-normal">{dict.forms.yes}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl><RadioGroupItem value="no" /></FormControl>
                        <FormLabel className="font-normal">{dict.forms.no}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_holding_company_sold"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="font-semibold">{t.is_holding_company_sold}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl><RadioGroupItem value="yes" /></FormControl>
                        <FormLabel className="font-normal">{dict.forms.yes}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl><RadioGroupItem value="no" /></FormControl>
                        <FormLabel className="font-normal">{dict.forms.no}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="employee_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">{t.employee_count}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={typeof field.value === 'number' ? field.value : Number(field.value ?? 0)}
                      onChange={e => field.onChange(Number((e.target as HTMLInputElement).value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="total_compensation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">{t.total_compensation}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
                control={form.control}
                name="ro_count"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="font-semibold">{t.ro_count}</FormLabel>
                    <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 1"
                          value={typeof field.value === 'number' ? field.value : Number(field.value ?? 0)}
                          onChange={e => field.onChange(Number((e.target as HTMLInputElement).value))}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="asking_price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="font-semibold">{t.asking_price}</FormLabel>
                    <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 5000000"
                          value={typeof field.value === 'number' ? field.value : Number(field.value ?? 0)}
                          onChange={e => field.onChange(Number((e.target as HTMLInputElement).value))}
                        />
                    </FormControl>
                    <FormDescription>{t.asking_price_desc}</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="font-semibold">{dict.forms.contact_phone}</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="font-semibold">{dict.forms.email}</FormLabel>
                    <FormControl>
                        <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <FormField
            control={form.control}
            name="wechat"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="font-semibold">{dict.forms.wechat}</FormLabel>
                <FormControl>
                    <Input {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />

        <Button type="submit" disabled={isPending} className="w-full md:w-auto">
          {isPending ? dict.forms.submitting : dict.forms.submit}
        </Button>
      </form>
    </Form>
  );
}
