import { executeGraphQL } from '@/lib/dataConnect';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Premium Real Estate Listings | CS Properties',
  description: 'Browse our curated collection of luxury villas, residential homes, commercial properties, and premium plots.',
};

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  type: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSqFt?: number | null;
  address: string;
  city: string;
  agent?: {
    name: string;
  } | null;
}

interface PropertyImage {
  url: string;
  displayOrder: number;
  property: {
    id: string;
  };
}

export default async function PublicPropertiesPage() {
  let properties: Property[] = [];
  let images: PropertyImage[] = [];

  try {
    const propertiesData = await executeGraphQL(`
      query GetProperties {
        properties {
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
          }
        }
      }
    `);
    properties = propertiesData?.properties || [];

    const imagesData = await executeGraphQL(`
      query GetPropertyImages {
        propertyImages {
          url
          displayOrder
          property {
            id
          }
        }
      }
    `);
    images = imagesData?.propertyImages || [];
  } catch (err) {
    console.error('Error loading properties for public view:', err);
  }

  // Filter out non-active properties for the public listings page
  const activeProperties = properties.filter((p) => p.status === 'ACTIVE' || p.status === 'UNDER_CONTRACT');

  const getFirstImage = (propertyId: string) => {
    const propImgs = images.filter((img) => img.property.id === propertyId);
    return propImgs.sort((a, b) => a.displayOrder - b.displayOrder)[0]?.url || null;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Public Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/properties" className="text-xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            CS PROPERTIES
          </Link>
          <Link
            href="/login"
            className="text-xs font-semibold px-4 py-2 border border-zinc-800 rounded-lg hover:bg-zinc-900 hover:text-white transition cursor-pointer"
          >
            Agent Login
          </Link>
        </div>
      </header>

      {/* Main Catalog View */}
      <main className="max-w-7xl mx-auto px-4 py-12 space-y-10" id="main-catalog-content">
        <section className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Find Your Next Premium Address
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Explore our listing catalog of curated high-end properties, villas, and commercial real estate spaces.
          </p>
        </section>

        {activeProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-zinc-900 rounded-3xl bg-zinc-950">
            <span className="text-4xl">🏢</span>
            <p className="mt-4 text-zinc-400 text-sm font-semibold">No active listings available right now. Please check back later.</p>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" aria-label="Properties Catalog Grid">
            {activeProperties.map((prop) => {
              const mainImageUrl = getFirstImage(prop.id) || '/placeholder.png';

              return (
                <article
                  key={prop.id}
                  id={`property-card-${prop.id}`}
                  className="bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/60 rounded-2xl overflow-hidden flex flex-col group transition shadow-lg hover:shadow-2xl"
                >
                  <Link href={`/properties/${prop.id}`} className="flex flex-col h-full">
                    {/* Media container */}
                    <div className="h-48 w-full relative bg-zinc-950 overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={mainImageUrl}
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-900/90 text-indigo-400 border border-zinc-800">
                          {prop.type}
                        </span>
                      </div>
                    </div>

                    {/* Content Detail */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h2 className="font-extrabold text-base text-zinc-100 group-hover:text-indigo-400 transition truncate">
                          {prop.title}
                        </h2>
                        <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">{prop.description}</p>
                        <p className="text-xs text-zinc-500">{prop.address}, {prop.city}</p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-zinc-900">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-black text-white">
                            ${prop.price.toLocaleString()}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400">
                            {prop.status}
                          </span>
                        </div>

                        <div className="flex justify-between text-[11px] text-zinc-400 bg-zinc-950/40 p-2 rounded-lg border border-zinc-900/40">
                          <span>🛏️ {prop.bedrooms ?? 0} Beds</span>
                          <span>🛁 {prop.bathrooms ?? 0} Baths</span>
                          <span>📐 {prop.areaSqFt ?? 0} SqFt</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}
