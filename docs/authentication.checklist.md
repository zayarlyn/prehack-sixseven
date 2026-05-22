# Authentication Tasks

## Database & Schema

- [x] Define User model in prisma/schema.prisma with all fields
- [ ] Run initial migration `prisma migrate dev --name init_users`
- [x] Write seed file with dev bypass user (id: 00000000-0000-0000-0000-000000000001)
- [ ] Run seed and verify dev user exists in database
- [x] Verify onboarded field defaults to false

## Azure AD / Microsoft Setup

- [ ] Register app in university Azure AD / Entra ID
- [ ] Set redirect URI to http://localhost:3000/api/auth/microsoft/callback
- [ ] Copy MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET, MICROSOFT_TENANT_ID to apps/api/.env
- [ ] Restrict sign-in to university tenant only in Azure AD app settings
- [ ] Confirm university IT department allows third-party app registration

## Backend — Auth Module

- [ ] Install dependencies — @azure/msal-node, jsonwebtoken, @types/jsonwebtoken
- [ ] Configure MSAL client in apps/api/src/common/lib/firebase.ts
- [ ] Implement GET /api/auth/microsoft — redirect to Microsoft login page
- [ ] Implement GET /api/auth/microsoft/callback:
  - [ ] Exchange auth code for Microsoft token
  - [ ] Verify token belongs to university tenant
  - [ ] Extract microsoftId, email, fullName from token claims
  - [ ] Upsert user row in database
  - [ ] Sign and return JWT containing id, email, onboarded
  - [ ] Return auth error response if tenant does not match
- [x] Implement GET /api/auth/me — return current user from req.user
- [x] Implement POST /api/auth/complete-profile:
  - [x] Validate body with CompleteProfileDto (year, programLevel, faculty, major, bio)
  - [x] Update user row with profile fields
  - [x] Set onboarded to true
  - [x] Return updated user
- [ ] Implement POST /api/auth/logout — clear session or invalidate token
- [x] Write requireAuth middleware:
  - [x] Check Authorization header for Bearer token
  - [ ] Verify JWT signature using JWT_SECRET
  - [ ] Attach decoded user to req.user
  - [ ] Return 401 if token missing or invalid
  - [ ] Return 401 if user not found in database
- [x] Write dev bypass logic inside requireAuth:
  - [x] Check NODE_ENV !== production AND DEV_BYPASS_AUTH === true
  - [x] Fetch dev bypass user from database using DEV_BYPASS_USER_ID
  - [x] Attach to req.user and call next()
  - [x] Throw clear error if bypass user not found in database
- [ ] Add all auth routes to apps/api/src/app.ts under /api/auth

## Backend — Validation & Error Handling

- [x] Confirm CompleteProfileDto zod schema covers all required fields
- [ ] Confirm auth error response shape matches frontend expectation
- [ ] Confirm 401 responses use AppError and go through error middleware
- [ ] Test all routes return correct status codes for happy and error paths

## Frontend — Auth Store

- [x] Implement useAuthStore in modules/auth/store/authStore.ts:
  - [x] user state (User | null)
  - [x] token state (string | null)
  - [x] isLoading state (boolean)
  - [x] setUser action
  - [x] setToken action
  - [x] clearAuth action
  - [x] initBypassAuth action — sets dev user when VITE_BYPASS_AUTH is true
- [ ] Persist token to localStorage on setToken
- [ ] Clear localStorage on clearAuth

## Frontend — Axios Setup

- [x] Configure baseURL from VITE_API_URL in common/lib/axios.ts
- [x] Add request interceptor:
  - [x] Read token from localStorage key swap_token
  - [x] Attach Authorization Bearer header if token exists
  - [x] If VITE_BYPASS_AUTH is true send Bearer dev-bypass-token instead
- [x] Add response interceptor:
  - [x] On 401 and bypass mode is off redirect to /login
  - [ ] On 401 and bypass mode is on log warning only

## Frontend — Router Auth Guard

- [x] Implement requireAuth guard in router.tsx:
  - [x] If VITE_BYPASS_AUTH is true return immediately
  - [x] If no user in store redirect to /login
  - [x] If user exists but onboarded is false redirect to /auth/complete-profile
- [x] Apply requireAuth to all protected routes:
  - [x] / (feed)
  - [x] /items
  - [x] /items/new
  - [x] /items/:itemId
  - [x] /conversations
  - [x] /conversations/:conversationId
  - [x] /profile
  - [x] /profile/edit
  - [x] /profile/:userId
- [x] Leave these routes public (no guard):
  - [x] /login
  - [x] /auth/callback
  - [x] /auth/complete-profile

## Frontend — app.tsx Initialization

- [x] Call initBypassAuth on mount in useEffect
- [ ] Call GET /api/auth/me on mount to restore session if token exists in localStorage
- [ ] Set isLoading true while session is being restored
- [ ] Set isLoading false after me call resolves or fails
- [ ] Show full page loading spinner while isLoading is true

## Frontend — Login Page

- [ ] Render app logo and Swap wordmark centered on page
- [ ] Render tagline "Buy and sell within your campus"
- [ ] Render Microsoft sign in button:
  - [ ] Microsoft logo icon on the left
  - [x] "Sign in with Microsoft" label
  - [ ] onClick redirects to GET /api/auth/microsoft
- [ ] Render helper text "Use your @university.edu account"
- [x] Render dev bypass banner when VITE_BYPASS_AUTH is true:
  - [x] #fa4617 background, white text
  - [x] "⚠️ DEV BYPASS MODE — Auth is disabled. Signed in as Dev User."
- [ ] Desktop split layout — decorative left panel, form right panel
- [ ] If user is already authenticated redirect to /

## Frontend — Callback Page

- [ ] On mount read token or error from URL query params
- [ ] If token present:
  - [ ] Call setToken and store in localStorage
  - [ ] Call GET /api/auth/me to fetch full user
  - [ ] Call setUser with response
  - [ ] If onboarded is false redirect to /auth/complete-profile
  - [ ] If onboarded is true redirect to /
- [ ] If error present redirect to /login with error query param
- [ ] Show loading spinner while processing

## Frontend — Complete Profile Page

- [ ] Render welcome message "Welcome, [firstName]!"
- [ ] Render read-only info card:
  - [ ] Full name with lock icon
  - [ ] University email with lock icon
- [ ] Render Program Level dropdown (required):
  - [ ] Options: Undergraduate, Master's, PhD
- [ ] Render Year dropdown (required, dependent on program level):
  - [ ] Disabled until program level is selected
  - [ ] Resets when program level changes
  - [ ] Undergraduate: Year 1–6
  - [ ] Master's: Year 1–3
  - [ ] PhD: Year 1–6+
- [ ] Render Faculty dropdown (required):
  - [ ] Populate with university faculty list
- [ ] Render Major searchable select (required)
- [ ] Render Bio textarea (optional, 0/200 character count)
- [ ] Continue button disabled until year, programLevel, faculty, major all filled
- [ ] On submit call POST /api/auth/complete-profile
- [ ] On success call setUser with updated user and redirect to /
- [ ] Show inline error if request fails

## Frontend — Auth Error Page

- [ ] Render error icon
- [ ] Render "This account isn't eligible" heading
- [ ] Render body text showing the ineligible email address
- [ ] Render "Try a different account" primary button — signs out and returns to /login
- [ ] Render "Contact support" tertiary link

## Frontend — NavBar Dev Bypass Banner

- [x] Show #fa4617 banner at top of NavBar when VITE_BYPASS_AUTH is true
- [x] Banner text: "⚠️ DEV BYPASS MODE — Auth is disabled. Signed in as Dev User."

## Frontend — useAuth Hook

- [x] Export useAuth() from modules/auth/hooks/useAuth.ts
- [ ] Returns { user, token, isLoading, isAuthenticated }
- [ ] isAuthenticated is true when user is not null and onboarded is true

## Environment Variables

- [x] Add to apps/api/.env:
  - [x] DATABASE_URL
  - [x] MICROSOFT_CLIENT_ID
  - [x] MICROSOFT_CLIENT_SECRET
  - [x] MICROSOFT_TENANT_ID
  - [x] JWT_SECRET
  - [x] PORT
  - [x] DEV_BYPASS_AUTH=true
  - [x] DEV_BYPASS_USER_ID=00000000-0000-0000-0000-000000000001
- [x] Add to apps/web/.env:
  - [x] VITE_API_URL=http://localhost:3000
  - [x] VITE_BYPASS_AUTH=true
  - [x] VITE_BYPASS_USER_ID=00000000-0000-0000-0000-000000000001
- [x] Confirm both .env files are in .gitignore
- [x] Confirm both .env.example files are up to date

## Testing & Verification

- [ ] Dev bypass — app loads, NavBar shows bypass banner, all routes accessible
- [ ] Microsoft login — clicking button redirects to Microsoft login page
- [ ] Callback — after Microsoft login token is stored and user is redirected correctly
- [ ] New user — redirected to complete profile, cannot skip to feed
- [ ] Returning user — goes straight to feed, complete profile not shown again
- [ ] Invalid tenant — auth error page shown with correct email displayed
- [ ] Expired token — 401 interceptor clears auth and redirects to login
- [ ] Complete profile — all required fields must be filled before submit enables
- [ ] requireAuth — unauthenticated request to protected route returns 401
- [ ] Dev bypass in production — verify bypass is blocked when NODE_ENV=production
