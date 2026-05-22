import { ConfidentialClientApplication } from '@azure/msal-node';

const clientId = process.env.MICROSOFT_CLIENT_ID;
const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
const tenantId = process.env.MICROSOFT_TENANT_ID;

if (!clientId || !clientSecret || !tenantId) {
  throw new Error('MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET, and MICROSOFT_TENANT_ID must all be set');
}

export const msalClient = new ConfidentialClientApplication({
  auth: {
    clientId,
    clientSecret,
    authority: `https://login.microsoftonline.com/${tenantId}`,
  },
});

export const REDIRECT_URI = `${process.env.API_URL ?? 'http://localhost:6769'}/api/auth/microsoft/callback`;
export const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:6767';
