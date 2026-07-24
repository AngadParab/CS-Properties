'use server';

import { executeGraphQL } from '@/lib/dataConnect';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';

export async function createPropertyAction(
  propertyData: {
    title: string;
    description: string;
    price: number;
    status: 'DRAFT' | 'ACTIVE' | 'UNDER_CONTRACT' | 'SOLD';
    type: 'RESIDENTIAL' | 'VILLA' | 'COMMERCIAL' | 'PLOT';
    bedrooms?: number | null;
    bathrooms?: number | null;
    areaSqFt?: number | null;
    address: string;
    city: string;
  },
  images: { url: string; displayOrder: number }[]
) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  try {
    // 1. Create property record
    const insertPropertyMutation = `
      mutation CreateProperty(
        $title: String!
        $description: String!
        $price: Float!
        $status: PropertyStatus!
        $type: PropertyType!
        $bedrooms: Int
        $bathrooms: Int
        $areaSqFt: Float
        $address: String!
        $city: String!
        $agentId: UUID!
      ) {
        property_insert(data: {
          title: $title
          description: $description
          price: $price
          status: $status
          type: $type
          bedrooms: $bedrooms
          bathrooms: $bathrooms
          areaSqFt: $areaSqFt
          address: $address
          city: $city
          agentId: $agentId
        })
      }
    `;

    const result = await executeGraphQL(insertPropertyMutation, {
      ...propertyData,
      agentId: user.uid,
    });

    const propertyId = result?.property_insert?.id;
    if (!propertyId) {
      throw new Error('Failed to retrieve created property ID.');
    }

    // 2. Insert linked images
    if (images.length > 0) {
      const insertImageMutation = `
        mutation AddPropertyImage($propertyId: UUID!, $url: String!, $displayOrder: Int!) {
          propertyImage_insert(data: {
            propertyId: $propertyId
            url: $url
            displayOrder: $displayOrder
          })
        }
      `;

      for (const image of images) {
        await executeGraphQL(insertImageMutation, {
          propertyId,
          url: image.url,
          displayOrder: image.displayOrder,
        });
      }
    }

    revalidatePath('/dashboard/properties');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to create property listing:', error);
    return { success: false, error: error.message || 'Failed to create listing.' };
  }
}
