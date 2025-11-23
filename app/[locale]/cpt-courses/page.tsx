import { getDictionary } from '@/lib/getDictionary';
import { Locale } from '@/i18n';
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import { CptCourse } from '@/types/cpt-course';

export default async function CptCoursesPage({ params: { locale } }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(locale);
  const t = dictionary.cpt_courses_page || {};
  const supabase = createClient();

  const { data: courses, error } = await supabase
    .from('cpt_courses')
    .select('*');

  if (error) {
    console.error('Error fetching CPT courses:', error);
    return <div>Error loading courses.</div>;
  }

  const courseList: CptCourse[] = courses || [];

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {dictionary.nav.cptCourses}
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            {t.subtitle || 'Stay ahead with our professional CPT courses designed for financial practitioners.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courseList.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              <p>暂无课程</p>
            </div>
          ) : (
            courseList.map((course) => (
              <div key={course.id} className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-w-3 aspect-h-2 bg-gray-200 sm:aspect-none h-48">
                  <Image
                    src={course.image_url}
                    alt={course.title}
                    layout="fill"
                    objectFit="cover"
                    className="opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="flex flex-1 flex-col space-y-4 p-6">
                  <p className="text-sm font-medium text-indigo-600">{course.category}</p>
                  <h3 className="text-xl font-semibold text-gray-900">
                    <a href={course.external_link} target="_blank" rel="noopener noreferrer" className="focus:outline-none">
                      <span aria-hidden="true" className="absolute inset-0" />
                      {course.title}
                    </a>
                  </h3>
                  <p className="text-sm text-gray-500 flex-1">{course.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-auto">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">{t.hours_label || 'Hours'}:</span> {course.hours}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      ${course.price}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
