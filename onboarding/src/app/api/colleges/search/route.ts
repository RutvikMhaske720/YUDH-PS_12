import { NextRequest, NextResponse } from 'next/server';
import { INSTITUTE_DATABASE } from '@/data/instituteDatabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const apiKey = process.env.COLLEGEDB_API_KEY || 'cdb_48ba9a4fafa81d800b177b5f4e9e4d658afe9dbaa0cc316a';

    let collegeResults: Array<{ id: string; name: string; city: string; state: string }> = [];

    if (query.trim().length >= 2) {
      try {
        const response = await fetch(`https://api.collegedb.in/v1/colleges/search?q=${encodeURIComponent(query)}`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          next: { revalidate: 3600 },
        });

        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.results)) {
            collegeResults = data.results.map((c: any) => ({
              id: c.id || Math.random().toString(),
              name: c.name,
              city: c.city || 'India',
              state: c.state || '',
            }));
          }
        }
      } catch (err) {
        console.error('CollegeDB API fetch error:', err);
      }
    }

    // Combine / fallback with local institute database matches
    const localMatches = INSTITUTE_DATABASE.filter((inst) =>
      inst.name.toLowerCase().includes(query.toLowerCase()) ||
      inst.location.toLowerCase().includes(query.toLowerCase())
    ).map((inst) => ({
      id: inst.id,
      name: inst.name,
      city: inst.location.split(',')[0] || inst.location,
      state: inst.location.split(',')[1]?.trim() || '',
    }));

    // Deduplicate results by name
    const combined = [...collegeResults, ...localMatches];
    const uniqueColleges = Array.from(
      new Map(combined.map((item) => [item.name.toLowerCase(), item])).values()
    ).slice(0, 10);

    return NextResponse.json({
      success: true,
      query,
      results: uniqueColleges,
    });
  } catch (error: any) {
    console.error('CollegeDB Search API route error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to search colleges' },
      { status: 500 }
    );
  }
}
