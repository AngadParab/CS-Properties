import { db, auth, appCheck, functions, storage } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp,
  deleteDoc,
  setDoc
} from 'firebase/firestore';
import { ref as storageRef, deleteObject } from 'firebase/storage';
import { signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { getToken } from 'firebase/app-check';

/**
 * Helper to dynamically determine Functions Base URL for local emulators vs production.
 */
const getFunctionsBaseUrl = () => {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:5001/cs-properties-9742d/us-central1';
  }
  return 'https://us-central1-cs-properties-9742d.cloudfunctions.net';
};

/**
 * Public: Submit a lead/inquiry to the secure submitLead HTTPS Cloud Function with App Check headers.
 */
const callSubmitLeadFunction = async (payload) => {
  let appCheckToken = '';
  if (appCheck) {
    try {
      const tokenResult = await getToken(appCheck, false);
      appCheckToken = tokenResult.token;
    } catch (err) {
      console.warn('App Check token retrieval skipped or failed:', err.message);
    }
  }

  const response = await fetch(`${getFunctionsBaseUrl()}/submitLead`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Firebase-AppCheck': appCheckToken,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(errText || 'Failed to submit lead to backend Cloud Function');
  }

  return await response.json();
};

/**
 * Public: Submit a new loan application lead
 */
export const submitLead = async (leadData) => {
  try {
    const result = await callSubmitLeadFunction({
      ...leadData,
      pipelineType: 'buyer',
      source: 'Apply Now Loan Form',
    });
    return {
      status: 'success',
      message: 'Loan application submitted successfully',
      data: result,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to submit lead');
  }
};

/**
 * Public: Submit a general or property inquiry
 */
export const submitInquiry = async (inquiryData) => {
  try {
    const result = await callSubmitLeadFunction({
      fullName: inquiryData.fullName || inquiryData.name,
      phone: inquiryData.phone,
      email: inquiryData.email,
      location: inquiryData.location || 'Goa',
      notes: inquiryData.message || inquiryData.notes,
      budget: inquiryData.budget || null,
      bedrooms: inquiryData.bedrooms || null,
      pipelineType: 'buyer',
      source: inquiryData.source || 'Contact Form',
    });
    return {
      status: 'success',
      message: 'Inquiry submitted successfully',
      data: result,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to submit inquiry');
  }
};

/**
 * Public: Submit a new property listing to sell
 */
export const submitPropertyListing = async (listingData) => {
  try {
    const result = await callSubmitLeadFunction({
      fullName: listingData.fullName,
      phone: listingData.phone,
      email: listingData.email,
      location: listingData.location,
      propertyTitle: listingData.propertyTitle,
      expectedPrice: Number(listingData.expectedPrice),
      sizeSqFt: Number(listingData.sizeSqFt),
      notes: listingData.description || listingData.notes,
      pipelineType: 'seller',
      source: 'Sell Form',
    });
    return {
      status: 'success',
      message: 'Property listing submitted for review',
      data: result,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to submit property listing');
  }
};

/**
 * Public: Authenticate admin credentials with Firebase Auth
 */
export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    
    return {
      status: 'success',
      token,
      user: {
        id: userCredential.user.uid,
        username: userCredential.user.email.split('@')[0],
        email: userCredential.user.email,
      },
    };
  } catch (error) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      throw new Error('Invalid email or password');
    }
    throw new Error(error.message || 'Authentication failed');
  }
};

/**
 * Public: Sign out helper
 */
export const logoutAdmin = async () => {
  return await firebaseSignOut(auth);
};

/**
 * Protected: Retrieve all Deals from Firestore, joining Contact and Agent records in client-side queries.
 */
export const fetchDeals = async () => {
  try {
    const dealsRef = collection(db, 'deals');
    const q = query(dealsRef, orderBy('updatedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const deals = [];
    for (const dealDoc of querySnapshot.docs) {
      const dealData = dealDoc.data();
      
      // Resolve related contact record
      let contact = null;
      if (dealData.contactId) {
        try {
          const contactRef = doc(db, 'contacts', dealData.contactId);
          const contactSnap = await getDoc(contactRef);
          if (contactSnap.exists()) {
            contact = { _id: contactSnap.id, ...contactSnap.data() };
          }
        } catch (contactErr) {
          console.warn(`Could not resolve contact document ${dealData.contactId}:`, contactErr.message);
        }
      }
      
      // Resolve related agent record
      let agent = null;
      if (dealData.assignedAgentId) {
        try {
          const agentRef = doc(db, 'agents', dealData.assignedAgentId);
          const agentSnap = await getDoc(agentRef);
          if (agentSnap.exists()) {
            agent = { _id: agentSnap.id, ...agentSnap.data() };
          }
        } catch (agentErr) {
          console.warn(`Could not resolve agent document ${dealData.assignedAgentId}:`, agentErr.message);
        }
      }
      
      deals.push({
        _id: dealDoc.id,
        ...dealData,
        contact,
        agent,
        createdAt: dealData.createdAt?.toDate() || new Date(),
        updatedAt: dealData.updatedAt?.toDate() || new Date(),
      });
    }
    
    return {
      status: 'success',
      data: deals,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch CRM deals');
  }
};

/**
 * Protected: Update status/stage of a specific deal document
 */
export const updateDealStage = async (id, stage) => {
  try {
    const dealRef = doc(db, 'deals', id);
    await updateDoc(dealRef, {
      stage,
      updatedAt: serverTimestamp(),
    });
    
    return {
      status: 'success',
      message: `Deal stage updated to ${stage}`,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to update deal stage');
  }
};

/**
 * Protected: Fetch Activity Log for a specific Deal
 */
export const fetchActivityLog = async (dealId) => {
  try {
    const activityRef = collection(db, 'activityLog');
    const q = query(activityRef, where('dealId', '==', dealId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const logs = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      logs.push({
        _id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      });
    });
    
    return logs;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch activity feed');
  }
};

/**
 * Protected: Add a new entry to the Activity Log
 */
export const addActivityEntry = async (activityData) => {
  try {
    const docRef = await addDoc(collection(db, 'activityLog'), {
      ...activityData,
      createdAt: serverTimestamp(),
    });
    return {
      status: 'success',
      id: docRef.id,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to create activity log entry');
  }
};

/**
 * Protected: Retrieve all Agents
 */
export const fetchAgents = async () => {
  try {
    const agentsRef = collection(db, 'agents');
    const querySnapshot = await getDocs(agentsRef);
    const agents = [];
    querySnapshot.forEach((doc) => {
      agents.push({
        _id: doc.id,
        ...doc.data(),
      });
    });
    return agents;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch agents list');
  }
};

/**
 * Protected: Retrieve Document list for a specific Deal
 */
export const fetchDocuments = async (dealId) => {
  try {
    const docsRef = collection(db, 'documents');
    const q = query(docsRef, where('dealId', '==', dealId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const documents = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      documents.push({
        _id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      });
    });
    return documents;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch document attachments');
  }
};

/**
 * Protected: Create document metadata after successful Storage upload
 */
export const addDocumentMetadata = async (docData) => {
  try {
    const docRef = await addDoc(collection(db, 'documents'), {
      ...docData,
      createdAt: serverTimestamp(),
    });
    return {
      status: 'success',
      id: docRef.id,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to add document metadata');
  }
};

/**
 * Protected: Fetch signed file URL from Cloud Function for secure downloads (mediates access check)
 */
export const getDocumentDownloadUrl = async (documentId) => {
  try {
    const getDocUrlCall = httpsCallable(functions, 'getDocumentUrl');
    const result = await getDocUrlCall({ documentId });
    return result.data.url;
  } catch (error) {
    throw new Error(error.message || 'Access restricted. Verification required.');
  }
};

// Legacy API interfaces mapped for backwards compatibility
export const fetchLeads = fetchDeals;
export const updateLeadStatus = updateDealStage;

/**
 * Protected: Create a manual client profile and deal assignment from Admin panel
 */
export const createManualDeal = async (dealData) => {
  try {
    const contactsRef = collection(db, 'contacts');
    let contactId;
    let contactData = null;

    // Deduplication check: check email first, then phone
    let existingDoc = null;
    if (dealData.email) {
      const emailQuery = query(contactsRef, where('email', '==', dealData.email));
      const emailSnap = await getDocs(emailQuery);
      if (!emailSnap.empty) existingDoc = emailSnap.docs[0];
    }
    if (!existingDoc && dealData.phone) {
      const phoneQuery = query(contactsRef, where('phone', '==', dealData.phone));
      const phoneSnap = await getDocs(phoneQuery);
      if (!phoneSnap.empty) existingDoc = phoneSnap.docs[0];
    }

    if (existingDoc) {
      contactId = existingDoc.id;
      contactData = existingDoc.data();
      await updateDoc(doc(db, 'contacts', contactId), {
        firstName: dealData.firstName || contactData.firstName || '',
        lastName: dealData.lastName || contactData.lastName || '',
        email: dealData.email || contactData.email || null,
        phone: dealData.phone || contactData.phone || null,
        updatedAt: serverTimestamp(),
      });
    } else {
      const newContactRef = await addDoc(contactsRef, {
        firstName: dealData.firstName || '',
        lastName: dealData.lastName || '',
        email: dealData.email || null,
        phone: dealData.phone || null,
        leadSource: dealData.leadSource || 'Manual Entry',
        leadStatus: dealData.stage === 'Closed' ? 'qualified' : 'new',
        budgetMin: dealData.budgetMin || null,
        budgetMax: dealData.budgetMax || null,
        preferredBedrooms: dealData.preferredBedrooms || null,
        preferredZones: dealData.preferredZones || [],
        assignedAgentId: dealData.assignedAgentId || auth.currentUser?.uid || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      contactId = newContactRef.id;
    }

    // Create the Deal
    const dealRef = await addDoc(collection(db, 'deals'), {
      contactId,
      pipelineType: dealData.pipelineType || 'buyer',
      stage: dealData.stage || 'New',
      listingId: dealData.listingId || null,
      assignedAgentId: dealData.assignedAgentId || auth.currentUser?.uid || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Log Activity
    await addDoc(collection(db, 'activityLog'), {
      dealId: dealRef.id,
      contactId,
      type: 'note',
      payload: {
        title: 'Deal Manually Created',
        text: dealData.notes || 'Agent manually entered client profile and pipeline card.'
      },
      createdBy: auth.currentUser?.email || 'admin',
      createdAt: serverTimestamp(),
    });

    return {
      status: 'success',
      dealId: dealRef.id,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to manually create client deal');
  }
};

/**
 * Protected: Manually list a property (creates Property & Listing documents)
 */
export const createPropertyAndListing = async (propertyData, listingData, imageUrls = []) => {
  try {
    // 1. Create property record
    const propRef = await addDoc(collection(db, 'properties'), {
      address: propertyData.address || '',
      city: propertyData.city || 'Goa',
      bedrooms: Number(propertyData.bedrooms || 0),
      bathrooms: Number(propertyData.bathrooms || 0),
      squareFootage: Number(propertyData.squareFootage || 0),
      ownerContactId: propertyData.ownerContactId || null,
      hoaFee: propertyData.hoaFee ? Number(propertyData.hoaFee) : null,
      amenities: propertyData.amenities || [],
      createdAt: serverTimestamp(),
    });

    // 2. Create listing record
    const listingRef = await addDoc(collection(db, 'listings'), {
      propertyId: propRef.id,
      listingAgentId: auth.currentUser?.uid || null,
      askingPrice: Number(listingData.askingPrice || 0),
      status: listingData.status || 'active',
      webDisplay: listingData.webDisplay !== undefined ? listingData.webDisplay : true,
      propertyAddress: propertyData.address || '',
      propertyCity: propertyData.city || 'Goa',
      images: imageUrls,
      createdAt: serverTimestamp(),
    });

    return {
      status: 'success',
      listingId: listingRef.id,
      propertyId: propRef.id,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to list property manually');
  }
};

/**
 * Protected: Delete property listing (deletes database records and cleans up storage images)
 */
export const deletePropertyListing = async (listingId, propertyId, imageUrls = []) => {
  try {
    // 1. Delete Firestore documents
    await deleteDoc(doc(db, 'listings', listingId));
    if (propertyId) {
      await deleteDoc(doc(db, 'properties', propertyId));
    }

    // 2. Cleanup images from storage bucket
    for (const url of imageUrls) {
      if (url && url.includes('firebasestorage')) {
        try {
          const fileRef = storageRef(storage, url);
          await deleteObject(fileRef);
          console.log(`Deleted storage asset: ${url}`);
        } catch (err) {
          console.warn(`Failed to clean up storage image ${url}:`, err.message);
        }
      }
    }

    return { status: 'success' };
  } catch (error) {
    throw new Error(error.message || 'Failed to delete property listing');
  }
};

/**
 * Protected: Fetch all listings (active + pending) for administrative oversight
 */
export const fetchAdminListings = async () => {
  try {
    const listingsSnap = await getDocs(collection(db, 'listings'));
    const adminListings = [];

    for (const listingDoc of listingsSnap.docs) {
      const listingData = listingDoc.data();
      let property = null;

      if (listingData.propertyId) {
        try {
          const propSnap = await getDoc(doc(db, 'properties', listingData.propertyId));
          if (propSnap.exists()) {
            property = { _id: propSnap.id, ...propSnap.data() };
          }
        } catch (propErr) {
          console.warn(`Could not resolve listing property ${listingData.propertyId}:`, propErr.message);
        }
      }

      adminListings.push({
        _id: listingDoc.id,
        ...listingData,
        property,
      });
    }

    return adminListings;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch admin listings');
  }
};

