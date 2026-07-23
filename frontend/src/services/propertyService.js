import { db } from '../config/firebase';
import { collection, getDocs, getDoc, doc, query, where } from 'firebase/firestore';

const formatPrice = (val) => {
  if (!val || isNaN(val)) return 'Price on Request';
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Crores`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakhs`;
  return `₹${val.toLocaleString('en-IN')}`;
};

/**
 * Unified client service to retrieve property listings from Firestore.
 */
export const fetchProperties = async () => {
  const listingsRef = collection(db, 'listings');
  const q = query(listingsRef, where('status', '==', 'active'), where('webDisplay', '==', true));
  const querySnapshot = await getDocs(q);
  
  const firestoreListings = [];
  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data();
    let propertyData = {};
    
    if (data.propertyId) {
      try {
        const propDoc = await getDoc(doc(db, 'properties', data.propertyId));
        if (propDoc.exists()) {
          propertyData = propDoc.data();
        }
      } catch (propErr) {
        console.warn(`Failed to resolve property data for ${data.propertyId}:`, propErr.message);
      }
    }
    
    firestoreListings.push({
      id: docSnap.id,
      title: propertyData.address || data.propertyAddress || 'Goa Property Listing',
      name: propertyData.address || data.propertyAddress || 'Goa Property Listing',
      location: propertyData.city || data.propertyCity || 'Goa Region',
      locationFull: `${propertyData.address || data.propertyAddress}, ${propertyData.city || data.propertyCity}`,
      type: propertyData.assetClass || 'Residential Real Estate (Living spaces)',
      subtype: propertyData.subtype || 'Villas / Independent Houses',
      price: data.askingPrice || 0,
      priceStr: formatPrice(data.askingPrice),
      size: `${propertyData.squareFootage || 0} Sq.Ft`,
      details: `${propertyData.bedrooms || 0} BHK | ${propertyData.bathrooms || 0} Baths | ${propertyData.squareFootage || 0} sq.ft.`,
      desc: propertyData.description || data.notes || 'Premium property listed in Goa.',
      featured: true,
      roundedClass: 'rounded-tl-[50px] rounded-br-[50px]',
      gradient: 'from-blue-950/80 to-slate-900/80',
      images: data.images || []
    });
  }
  
  return firestoreListings;
};
