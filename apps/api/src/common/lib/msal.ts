import { ConfidentialClientApplication } from '@azure/msal-node';

export const msalClient = new ConfidentialClientApplication({
  auth: {
    clientId: process.env.MICROSOFT_CLIENT_ID!,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
    authority: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}`,
  },
});

export const REDIRECT_URI = `${process.env.API_URL ?? 'http://localhost:6769'}/api/auth/microsoft/callback`;
export const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:6767';
