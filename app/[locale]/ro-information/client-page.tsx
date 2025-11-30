'use client';

import { RoProfileForm } from '@/components/forms/RoProfileForm';

export default function RoInformationClientPage({ dictionary }: { dictionary: any }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <RoProfileForm dict={dictionary} />
      </div>
    </div>
  );
}
