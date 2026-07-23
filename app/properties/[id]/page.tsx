import { executeGraphQL } from '@/lib/dataConnect';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import InquiryForm from '@/components/InquiryForm';

export const dynamic = 'force-dynamic';

interface PageParams {
  params: Promise<{
    id: string;
  }>;
}

// Generate dynamic metadata for search engine indexing and SEO optimization
export async function generateMetadata({ params }: PageParams) {
  const { id } = await params;
  try {
    const data = await executeGraphQL(`
      query GetProperty($id: UUID!) {
        property(id: $id) {
          title
          description
        }
      }
    `, { id });

    const property = data?.property;
    if (property) {
      return {
        title: `${property.title} | CS Properties`,
        description: property.description,
      };
    }
  } catch (err) {
    console.error('Metadata generation error:', err);
  }

  return {
    title: 'Property Listing | CS Properties',
    description: 'Explore premium residential and commercial listings in our portfolio.',
  };
}

export default async function PublicPropertyDetailPage({ params }: PageParams) {
  const { id } = await params;

  let property = null;
  let images: { url: string; displayOrder: number }[] = [];

  try {
    const propertyData = await executeGraphQL(`
      query GetProperty($id: UUID!) {
        property(id: $id) {
          id
          title
          description
          price
          status
          type
          bedrooms
          bathrooms
          areaSqFt
          address
          city
          agent {
            name
            email
          }
          createdAt
        }
        propertyImages(where: { property: { id: { eq: $id } } }) {
          url
          displayOrder
        }
      }
    `, { id });

    property = propertyData?.property || null;
    images = propertyData?.propertyImages || [];
  } catch (err) {
    console.error('Error fetching public property detail:', err);
  }

  if (!property) {
    redirect('/properties');
  }

  const sortedImages = [...images].sort((a, b) => a.displayOrder - b.displayOrder);
  const mainImageUrl = sortedImages[0]?.url || null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/properties" className="text-xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            CS PROPERTIES
          </Link>
          <Link
            href="/properties"
            className="text-xs font-semibold px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800/80 transition"
          >
            ← Back to Catalog
          </Link>
        </div>
      </header>

      {/* Main Grid View */}
      <main className="max-w-7xl mx-auto px-4 py-12" id={`property-details-${property.id}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Listing Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Photo Display */}
            {mainImageUrl && (
              <div className="h-96 md:h-[480px] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-900 shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mainImageUrl}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Gallery Thumbnail Strip */}
            {sortedImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {sortedImages.slice(1).map((img, idx) => (
                  <div key={idx} className="h-24 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-900 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={`Gallery view ${idx + 2}`}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Listing Specs and Description */}
            <article className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">{property.title}</h1>
                  <p className="text-zinc-500 text-sm mt-1">{property.address}, {property.city}</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-indigo-400 block">${property.price.toLocaleString()}</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-zinc-900 text-zinc-400 mt-1 uppercase tracking-wide border border-zinc-800">
                    {property.status}
                  </span>
                </div>
              </div>

              {/* Specification badge panel */}
              <div className="grid grid-cols-4 gap-4 bg-zinc-900/40 p-4 rounded-2xl border border-zinc-900">
                <div className="text-center p-2">
                  <span className="block text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Type</span>
                  <span className="text-sm font-extrabold text-zinc-200 mt-1 block">{property.type}</span>
                </div>
                <div className="text-center p-2">
                  <span className="block text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Bedrooms</span>
                  <span className="text-sm font-extrabold text-zinc-200 mt-1 block">{property.bedrooms ?? 0}</span>
                </div>
                <div className="text-center p-2">
                  <span className="block text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Bathrooms</span>
                  <span className="text-sm font-extrabold text-zinc-200 mt-1 block">{property.bathrooms ?? 0}</span>
                </div>
                <div className="text-center p-2">
                  <span className="block text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Area SqFt</span>
                  <span className="text-sm font-extrabold text-zinc-200 mt-1 block">{(property.areaSqFt ?? 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Property Overview</h2>
                <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{property.description}</p>
              </div>
            </article>
          </div>

          {/* Sidebar Inquiry Form & Agent details */}
          <div className="space-y-6">
            <div className="bg-zinc-900/40 border border-zinc-900 p-5 rounded-2xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Listing Agent</span>
              <div className="space-y-1">
                <p className="text-sm font-extrabold text-zinc-100">{property.agent?.name || 'CS Properties Agent'}</p>
                {property.agent?.email && (
                  <p className="text-xs text-zinc-400">{property.agent.email}</p>
                )}
              </div>
            </div>

            <InquiryForm propertyId={property.id} />
          </div>
        </div>
      </main>
    </div>
  );
}
