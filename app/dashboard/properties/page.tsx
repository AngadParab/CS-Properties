import { executeGraphQL } from '@/lib/dataConnect';
import PropertiesCatalog from '@/components/PropertiesCatalog';

export const dynamic = 'force-dynamic';

export default async function PropertiesPage() {
  let properties = [];
  let images = [];

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
            id
            name
          }
          createdAt
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
    console.error('Error fetching properties/images:', err);
  }

  return (
    <div className="flex-1 flex flex-col p-8 space-y-6 overflow-hidden">
      <PropertiesCatalog initialProperties={properties} initialImages={images} />
    </div>
  );
}
