import { db, auth } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';

/**
 * Public: Submit a new loan application lead to Cloud Firestore
 */
export const submitLead = async (leadData) => {
  try {
    const docRef = await addDoc(collection(db, 'leads'), {
      ...leadData,
      amount: Number(leadData.amount),
      tenureYears: Number(leadData.tenureYears),
      monthlyIncome: Number(leadData.monthlyIncome),
      existingEmis: Number(leadData.existingEmis || 0),
      status: 'New',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return {
      status: 'success',
      message: 'Loan application submitted successfully',
      data: { _id: docRef.id, ...leadData },
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to submit lead to Firestore');
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
    // Customize user friendly login messages
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      throw new Error('Invalid email or password');
    }
    throw new Error(error.message || 'Authentication failed');
  }
};

/**
 * Protected: Retrieve all loan applications from Firestore
 * (Note: token parameter accepted for backwards compatibility)
 */
export const fetchLeads = async (token = null) => {
  try {
    const leadsRef = collection(db, 'leads');
    const q = query(leadsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const leads = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      leads.push({
        _id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      });
    });
    
    return {
      status: 'success',
      data: leads,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch leads from Firestore');
  }
};

/**
 * Protected: Update status of a specific lead document
 */
export const updateLeadStatus = async (id, status, token = null) => {
  try {
    const leadRef = doc(db, 'leads', id);
    await updateDoc(leadRef, {
      status,
      updatedAt: serverTimestamp(),
    });
    
    return {
      status: 'success',
      message: `Lead status updated to ${status}`,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to update lead status');
  }
};

/**
 * Public: Sign out helper
 */
export const logoutAdmin = async () => {
  return await firebaseSignOut(auth);
};
