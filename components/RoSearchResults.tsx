'use client';

export function RoSearchResults({ results, dict }: { results: any[], dict: any }) {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Search Results</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((ro) => (
          <div key={ro.id} className="p-4 border rounded-lg">
            <h4 className="font-bold">{ro.name_en}</h4>
            <p>{ro.name_zh}</p>
            {/* Add more fields as needed */}
          </div>
        ))}
      </div>
    </div>
  );
}
