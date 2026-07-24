"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.onUserCreated = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
    const email = user.email || '';
    if (!email.endsWith('@cs-properties.com')) {
        console.log(`Skipping claims assignment for non-matching email domain: ${email}`);
        return;
    }
    const role = email.startsWith('admin') ? 'ADMIN' : 'AGENT';
    try {
        // Set Firebase custom user claims
        await admin.auth().setCustomUserClaims(user.uid, { role });
        console.log(`Successfully assigned custom claim { role: "${role}" } to user: ${user.uid}`);
        // Sync user record to PostgreSQL via Data Connect GraphQL API
        const query = `
      mutation UpsertUser($id: UUID!, $email: String!, $name: String!, $role: UserRole!, $phone: String) {
        user_upsert(data: {
          id: $id
          email: $email
          name: $name
          role: $role
          phone: $phone
        })
      }
    `;
        const variables = {
            id: user.uid,
            email: email,
            name: user.displayName || email.split('@')[0],
            role: role,
            phone: user.phoneNumber || null,
        };
        const projectId = process.env.GCLOUD_PROJECT || 'cs-properties-9742d';
        const dataConnectUrl = process.env.FUNCTIONS_EMULATOR === 'true'
            ? `http://127.0.0.1:9399/v1/projects/${projectId}/locations/us-central1/services/cs-properties-crm:executeGraphql`
            : `https://us-central1-dataconnect.googleapis.com/v1/projects/${projectId}/locations/us-central1/services/cs-properties-crm:executeGraphql`;
        const response = await fetch(dataConnectUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, variables }),
        });
        const result = await response.json();
        if (!response.ok || result.errors) {
            console.error('Data Connect sync error:', JSON.stringify(result.errors || result));
            throw new Error('Failed to sync user to PostgreSQL');
        }
        console.log(`Successfully synced user ${user.uid} to PostgreSQL.`);
    }
    catch (err) {
        console.error('Error in onUserCreated flow:', err);
        throw err;
    }
});
//# sourceMappingURL=onUserCreated.js.map