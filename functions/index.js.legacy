const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();
const db = admin.firestore();

/**
 * Helper to check and update rate limits per IP using a Firestore transaction.
 */
async function checkAndIncrementRateLimit(ip) {
  const limitRef = db.collection('rateLimits').doc(ip);
  const limit = 10; // Allow maximum 10 requests per minute
  const windowMs = 60 * 1000;
  let allowed = true;

  await db.runTransaction(async (tx) => {
    const docSnap = await tx.get(limitRef);
    const now = Date.now();

    if (!docSnap.exists) {
      tx.set(limitRef, { count: 1, windowStart: now });
    } else {
      const data = docSnap.data();
      if (now - data.windowStart < windowMs) {
        if (data.count >= limit) {
          allowed = false;
        } else {
          tx.update(limitRef, { count: data.count + 1 });
        }
      } else {
        tx.set(limitRef, { count: 1, windowStart: now });
      }
    }
  });

  return allowed;
}

/**
 * Sanitizes input string to prevent scripts injection/XSS.
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
}

/**
 * Internal Lead Assignment algorithm.
 * Selects active agents with remaining capacity, matching territories, and fewest leads.
 */
async function assignAgent(dealId) {
  const dealSnap = await db.collection('deals').doc(dealId).get();
  if (!dealSnap.exists) return null;

  const dealData = dealSnap.data();
  const contactSnap = await db.collection('contacts').doc(dealData.contactId).get();
  if (!contactSnap.exists) return null;

  const contactData = contactSnap.data();

  // Query active agents
  const agentsQuery = db.collection('agents').where('active', '==', true);
  const snapshot = await agentsQuery.get();

  let candidates = snapshot.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(a => (a.currentOpenLeadCount || 0) < (a.maxLeadCapacity || 10));

  // Match territory/zones if preferences exist
  if (contactData.preferredZones && contactData.preferredZones.length > 0) {
    candidates = candidates.filter(a => contactData.preferredZones.includes(a.territory));
  }

  // Fallback if no agents available
  if (candidates.length === 0) {
    await db.collection('brokerEscalations').add({
      dealId,
      reason: 'no_agent_available',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return null;
  }

  // Sort candidates by current lead count ascending
  candidates.sort((a, b) => (a.currentOpenLeadCount || 0) - (b.currentOpenLeadCount || 0));
  const chosen = candidates[0];

  // Run transaction to assign agent and increment count safely
  await db.runTransaction(async (tx) => {
    tx.update(db.collection('deals').doc(dealId), {
      assignedAgentId: chosen.id,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    tx.update(db.collection('contacts').doc(dealData.contactId), {
      assignedAgentId: chosen.id,
      leadStatus: 'contacted',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    tx.update(db.collection('agents').doc(chosen.id), {
      currentOpenLeadCount: admin.firestore.FieldValue.increment(1)
    });
  });

  return chosen.id;
}

/**
 * Enqueue task queue programmatically
 */
async function enqueueSpeedToLead(dealId) {
  try {
    const { getFunctions } = require('firebase-admin/functions');
    const queue = getFunctions().taskQueue('sendSpeedToLead');
    await queue.enqueue({ dealId });
  } catch (err) {
    console.warn('Cloud Tasks queue enqueue skipped or unsupported in local emulator:', err.message);
    if (process.env.FUNCTIONS_EMULATOR === 'true') {
      console.log(`[Emulator] Simulating background Speed-to-Lead dispatch for deal ID: ${dealId}`);
      setTimeout(async () => {
        try {
          await mockDispatchSpeedToLead(dealId);
        } catch (mockErr) {
          console.error('[Emulator Background Task Error]', mockErr);
        }
      }, 2000);
    }
  }
}

/**
 * Mock WhatsApp dispatcher
 */
async function sendWhatsApp(dealId) {
  console.log(`[WhatsApp API] Dispatched WhatsApp notice to applicant for deal: ${dealId}`);
  // Simulate network delivery
  return true;
}

/**
 * Mock SMS dispatcher
 */
async function sendSmsFailover(dealId) {
  console.log(`[SMS API] Dispatched SMS failover notice to applicant for deal: ${dealId}`);
  return true;
}

/**
 * Create manual follow up activity log
 */
async function createManualFollowUpTask(dealId) {
  const dealSnap = await db.collection('deals').doc(dealId).get();
  const assignedAgentId = dealSnap.exists ? dealSnap.data().assignedAgentId : null;

  await db.collection('activityLog').add({
    contactId: dealSnap.exists ? dealSnap.data().contactId : null,
    dealId: dealId,
    type: 'task',
    payload: {
      title: 'Manual Lead Follow-Up Required',
      description: 'System notifications (WhatsApp/SMS) failed to deliver. Please follow up manually.',
      status: 'pending'
    },
    createdBy: assignedAgentId || 'system',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
}

/**
 * Emulator background dispatcher simulation
 */
async function mockDispatchSpeedToLead(dealId) {
  try {
    await sendWhatsApp(dealId);
  } catch (err) {
    console.error('WhatsApp failed, executing SMS fallback:', err.message);
    try {
      await sendSmsFailover(dealId);
    } catch (smsErr) {
      console.error('SMS fallback failed, escalating to manual follow-up:', smsErr.message);
      await createManualFollowUpTask(dealId);
    }
  }
}

/**
 * 1. Public Lead Ingestion HTTPS Cloud Function
 */
exports.submitLead = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    // Enable debug App Check override for localhost emulators
    const appCheckToken = req.header('X-Firebase-AppCheck');
    if (!appCheckToken && process.env.FUNCTIONS_EMULATOR !== 'true') {
      return res.status(401).send('Missing App Check token');
    }

    if (appCheckToken) {
      try {
        await admin.appCheck().verifyToken(appCheckToken);
      } catch (err) {
        if (process.env.FUNCTIONS_EMULATOR !== 'true') {
          return res.status(401).send('Invalid App Check token');
        }
        console.warn('App Check invalid, but bypassed in Emulator environment.');
      }
    }

    // Rate Limiting checks
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown-ip';
    const allowed = await checkAndIncrementRateLimit(ip);
    if (!allowed) {
      return res.status(429).send('Too many requests. Please try again later.');
    }

    // Extract, validate, and sanitize body parameters
    const body = req.body || {};
    const fullName = sanitizeString(body.fullName || body.name);
    const email = sanitizeString(body.email);
    const phone = sanitizeString(body.phone);
    const location = sanitizeString(body.location);
    const notes = sanitizeString(body.notes || body.message);
    const pipelineType = body.pipelineType || (body.propertyTitle ? 'seller' : 'buyer');

    if (!fullName || !phone) {
      return res.status(400).json({ error: 'Applicant Name and Phone Number are required.' });
    }

    try {
      const contactsRef = db.collection('contacts');
      let contactId;
      let contactData;

      // Duplicate check: check email first, then phone
      let existingContactDoc = null;
      if (email) {
        const emailSnap = await contactsRef.where('email', '==', email).limit(1).get();
        if (!emailSnap.empty) existingContactDoc = emailSnap.docs[0];
      }
      if (!existingContactDoc && phone) {
        const phoneSnap = await contactsRef.where('phone', '==', phone).limit(1).get();
        if (!phoneSnap.empty) existingContactDoc = phoneSnap.docs[0];
      }

      if (existingContactDoc) {
        contactId = existingContactDoc.id;
        contactData = existingContactDoc.data();
        await contactsRef.doc(contactId).update({
          firstName: fullName.split(' ')[0] || '',
          lastName: fullName.split(' ').slice(1).join(' ') || '',
          email: email || contactData.email || null,
          phone: phone || contactData.phone || null,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      } else {
        const newContact = await contactsRef.add({
          firstName: fullName.split(' ')[0] || '',
          lastName: fullName.split(' ').slice(1).join(' ') || '',
          email: email || null,
          phone: phone || null,
          leadSource: body.source || 'Web Form',
          leadStatus: 'new',
          budgetMin: body.budget ? Number(body.budget) * 0.9 : null,
          budgetMax: body.budget ? Number(body.budget) * 1.1 : null,
          preferredBedrooms: body.bedrooms ? Number(body.bedrooms) : null,
          preferredZones: location ? [location] : [],
          assignedAgentId: null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        contactId = newContact.id;
      }

      let dealId;
      // Handle seller pipeline: create properties and listings drafts
      if (pipelineType === 'seller') {
        const propertyRef = await db.collection('properties').add({
          address: body.propertyTitle || location || 'Goa',
          city: body.location || 'Goa',
          bedrooms: Number(body.bedrooms || 0),
          bathrooms: Number(body.bathrooms || 0),
          squareFootage: Number(body.sizeSqFt || 0),
          ownerContactId: contactId,
          hoaFee: null,
          amenities: []
        });

        const listingRef = await db.collection('listings').add({
          propertyId: propertyRef.id,
          listingAgentId: null,
          askingPrice: Number(body.expectedPrice || body.budget || 0),
          status: 'pending',
          webDisplay: false,
          propertyAddress: body.propertyTitle || location || 'Goa',
          propertyCity: body.location || 'Goa'
        });

        const dealRef = await db.collection('deals').add({
          contactId,
          pipelineType: 'seller',
          stage: 'new',
          listingId: listingRef.id,
          assignedAgentId: null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        dealId = dealRef.id;
      } else {
        // Buyer pipeline
        const dealRef = await db.collection('deals').add({
          contactId,
          pipelineType: 'buyer',
          stage: 'new',
          listingId: null,
          assignedAgentId: null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        dealId = dealRef.id;
      }

      // Add audit activity
      await db.collection('activityLog').add({
        contactId,
        dealId,
        type: 'note',
        payload: {
          title: 'Lead Ingestion',
          text: notes || 'New lead registered via public form portal.'
        },
        createdBy: 'system',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Trigger automatic agent routing
      await assignAgent(dealId);

      // Async task enqueue for speed to lead WhatsApp messaging
      await enqueueSpeedToLead(dealId);

      return res.status(201).json({ receipt_id: dealId });
    } catch (error) {
      console.error('Lead Ingestion Error:', error);
      return res.status(500).send('Internal Server Error: ' + error.message);
    }
  });
});

/**
 * 2. Speed-to-Lead Cloud Tasks handler function
 */
exports.sendSpeedToLead = functions.tasks.taskQueue({
  retryConfig: { maxAttempts: 3, minBackoffSeconds: 60 },
}).onDispatch(async (data, context) => {
  const dealId = data.dealId;
  const attempt = (context && context.retryCount) || 1;

  try {
    await sendWhatsApp(dealId);
  } catch (err) {
    if (attempt >= 3) {
      try {
        await sendSmsFailover(dealId);
      } catch (smsErr) {
        await createManualFollowUpTask(dealId);
      }
    }
    throw err; // rethrow to trigger automatic cloud tasks retries
  }
});

/**
 * 3. Document Vault Secure signed URL Callable function
 */
exports.getDocumentUrl = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authenticating required to retrieve documents.');
  }

  const documentId = data.documentId;
  if (!documentId) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing Document ID parameter.');
  }

  const docSnap = await db.collection('documents').doc(documentId).get();
  if (!docSnap.exists) {
    throw new functions.https.HttpsError('not-found', 'Vault document not found.');
  }

  const docData = docSnap.data();

  // Validate MFA Enrollment status by requesting user attributes
  const user = await admin.auth().getUser(context.auth.uid);
  const enrolledFactors = (user.multiFactor && user.multiFactor.enrolledFactors) || [];
  if (enrolledFactors.length === 0 && process.env.FUNCTIONS_EMULATOR !== 'true') {
    throw new functions.https.HttpsError('permission-denied', 'Multi-factor authentication (MFA) enrollment is required.');
  }

  // Assess Role privileges and record ownership
  const tokenRole = context.auth.token.role;
  let allowed = false;

  if (tokenRole === 'admin' || tokenRole === 'broker') {
    allowed = true;
  } else if (tokenRole === 'sales_agent' || tokenRole === 'listing_agent') {
    if (docData.dealId) {
      const dealSnap = await db.collection('deals').doc(docData.dealId).get();
      if (dealSnap.exists && dealSnap.data().assignedAgentId === context.auth.uid) {
        allowed = true;
      }
    }
    if (!allowed && docData.propertyId) {
      const propertySnap = await db.collection('properties').doc(docData.propertyId).get();
      if (propertySnap.exists && propertySnap.data().ownerContactId) {
        const contactSnap = await db.collection('contacts').doc(propertySnap.data().ownerContactId).get();
        if (contactSnap.exists && contactSnap.data().assignedAgentId === context.auth.uid) {
          allowed = true;
        }
      }
    }
  }

  if (!allowed) {
    throw new functions.https.HttpsError('permission-denied', 'Access policy restricts viewing this document.');
  }

  // Obtain signed download URL from Cloud Storage (5 mins expiration)
  try {
    const bucket = admin.storage().bucket();
    const [url] = await bucket.file(docData.storagePath).getSignedUrl({
      action: 'read',
      expires: Date.now() + 5 * 60 * 1000
    });

    // Write access audit entry
    await db.collection('documentAccessLog').add({
      documentId,
      accessedBy: context.auth.uid,
      accessedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { url };
  } catch (err) {
    throw new functions.https.HttpsError('internal', 'Cloud Storage operation failed: ' + err.message);
  }
});

/**
 * 4. Automatic Agents custom claims synchronizer trigger
 */
exports.onAgentWrite = functions.firestore.document('agents/{agentId}').onWrite(async (change, context) => {
  const agentId = context.params.agentId;

  if (!change.after.exists) {
    // Delete custom claims
    try {
      await admin.auth().setCustomUserClaims(agentId, null);
      console.log(`Successfully cleared role claims for deleted agent ID ${agentId}`);
    } catch (err) {
      console.error(`Error resetting claims for deleted agent ID ${agentId}:`, err.message);
    }
    return;
  }

  const agentData = change.after.data();
  const role = agentData.role || 'sales_agent';

  try {
    await admin.auth().setCustomUserClaims(agentId, { role });
    console.log(`Successfully synced custom user claim { role: "${role}" } for agent: ${agentId}`);
  } catch (err) {
    console.error(`Claims synchronization failed for agent ID ${agentId}:`, err.message);
  }
});

/**
 * 5. Developer Admin claim setter & mock seeding HTTPS trigger
 */
exports.initDeveloperAdmin = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    const secret = req.query.secret;
    if (secret !== 'cs-properties-developer-seed' && process.env.FUNCTIONS_EMULATOR !== 'true') {
      return res.status(403).send('Forbidden: Developer seeding restricts access.');
    }

    try {
      const adminEmail = 'admin@creditsolutionsgoa.com';
      let adminUid;

      try {
        const user = await admin.auth().getUserByEmail(adminEmail);
        adminUid = user.uid;
      } catch {
        const user = await admin.auth().createUser({
          email: adminEmail,
          password: 'adminpassword123',
          emailVerified: true
        });
        adminUid = user.uid;
      }

      await admin.auth().setCustomUserClaims(adminUid, { role: 'admin' });
      await db.collection('agents').doc(adminUid).set({
        email: adminEmail,
        fullName: 'System Administrator',
        role: 'admin',
        maxLeadCapacity: 100,
        currentOpenLeadCount: 0,
        active: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      // Seed test agents
      const testAgents = [
        { email: 'broker@creditsolutionsgoa.com', fullName: 'Broker Manager', role: 'broker', territory: 'North Goa District' },
        { email: 'listing@creditsolutionsgoa.com', fullName: 'Listing Agent Specialist', role: 'listing_agent', territory: 'South Goa District' },
        { email: 'sales@creditsolutionsgoa.com', fullName: 'Sales Agent Advisor', role: 'sales_agent', territory: 'South Goa District' }
      ];

      for (const agent of testAgents) {
        try {
          let user;
          try {
            user = await admin.auth().getUserByEmail(agent.email);
          } catch {
            user = await admin.auth().createUser({
              email: agent.email,
              password: 'agentpassword123',
              emailVerified: true
            });
          }
          await admin.auth().setCustomUserClaims(user.uid, { role: agent.role });
          await db.collection('agents').doc(user.uid).set({
            email: agent.email,
            fullName: agent.fullName,
            role: agent.role,
            maxLeadCapacity: 5,
            currentOpenLeadCount: 0,
            territory: agent.territory,
            active: true,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
        } catch (agentErr) {
          console.error(`Agent seed failed for ${agent.email}:`, agentErr.message);
        }
      }

      return res.status(200).send('Developer seed completed. Admin user and 3 agents initialized.');
    } catch (err) {
      return res.status(500).send('Database seeding failed: ' + err.message);
    }
  });
});
