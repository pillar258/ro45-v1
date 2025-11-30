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
              <a
                key={course.id}
                href={course.external_link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48 bg-gray-200">
                  <Image
                    src={course.image_url}
                    alt={course.title}
                    layout="fill"
                    objectFit="cover"
                    className="opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="mt-auto flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.204 8.845l-5 5m0 0l-5-5m5 5v-5m3.885-4.115A2 2 0 1114 10a2 2 0 01-2 2h-2.286" /></svg>
                        {course.language || 'Cantonese'}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {course.hours} {t.hours_label || 'Hours'}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
