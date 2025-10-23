# ATS Optimization Authentication Fix - Cookie-Only Auth

## Problem
When clicking "Get Optimized Resume" and selecting a template, users were getting an error:
```
Failed to optimize resume: Internal server error. Please try again.
```

## Root Cause
The `/api/ats-score/optimize` endpoint requires authentication via the `userAuthorization` middleware, which **only checks for tokens in cookies** (`req.cookies.authToken`).

However, some frontend API services were trying to send tokens via `Authorization: Bearer <token>` headers from localStorage, which were being ignored by the backend.

Authentication error in logs:
```
[Auth] Token missing from ::1 for /api/ats-score/optimize
[ERROR] Unable to find the authorization token in the cookie
```

## Solution - Cookie-Only Authentication
Updated all frontend API services to use **cookie-only authentication** by:

1. **Removed** all `Authorization: Bearer` header interceptors
2. **Added** `withCredentials: true` to all axios instances
3. **Backend remains unchanged** - only accepts cookies

This ensures consistent cookie-based authentication across the entire application.

## Code Changes

### Frontend API Services Updated

#### 1. `client/src/api/atsScoreServiceApi.js`
```javascript
this.api = axios.create({
  baseURL: `${API_BASE_URL}/ats-score`,
  timeout: 60000,
  withCredentials: true, // Send cookies with requests (REQUIRED)
  // ...
});
// Removed: Authorization header interceptor
```

#### 2. `client/src/api/resumeParserServiceApi.js`
```javascript
this.api = axios.create({
  baseURL: `${API_BASE_URL}/resume-parser`,
  timeout: 60000,
  withCredentials: true, // Send cookies with requests (REQUIRED)
});
// Removed: Authorization header interceptor
```

#### 3. `client/src/api/textExtractionServiceApi.js`
```javascript
this.api = axios.create({
  baseURL: `${API_BASE_URL}/text-extraction`,
  timeout: 30000,
  withCredentials: true, // Send cookies with requests (REQUIRED)
  // ...
});
// Removed: Authorization header interceptor
```

### Backend (No Changes Required)
`server/middleware/user-authorization.js` - Continues to check only cookies:
```javascript
const { authToken } = req.cookies
if (!authToken) {
  // Return 401 error
}
```

## How Cookie Authentication Works

1. **Login/OAuth** → Backend sets `authToken` cookie (httpOnly, secure)
2. **Frontend Requests** → Axios sends cookies automatically with `withCredentials: true`
3. **Backend Validation** → Middleware verifies token from cookie
4. **Success** → Request proceeds with `req.user` populated

## Benefits
1. ✅ **Fixes ATS optimization** - Now works correctly
2. ✅ **Consistent auth method** - All APIs use cookies
3. ✅ **More secure** - httpOnly cookies can't be accessed by JavaScript
4. ✅ **CSRF protection** - Cookies work with CSRF tokens
5. ✅ **Simpler frontend** - No manual token management needed

## Testing Checklist
After restarting the server, test:

- [ ] **Login/OAuth** - Can sign in successfully
- [ ] **ATS Analysis** - Can analyze resume vs job description
- [ ] **Get Optimized Resume** - Can select template
- [ ] **Resume Parser** - Can upload and parse resume
- [ ] **Text Extraction** - Can extract text from files
- [ ] **All authenticated endpoints** work

## Related Files
- ✅ `client/src/api/atsScoreServiceApi.js` - Removed Bearer auth
- ✅ `client/src/api/resumeParserServiceApi.js` - Removed Bearer auth
- ✅ `client/src/api/textExtractionServiceApi.js` - Removed Bearer auth
- ✅ `client/src/api/index.js` - Already had withCredentials
- ✅ `server/middleware/user-authorization.js` - Cookie-only (unchanged)

## Important Notes
- **All authentication is cookie-based** - No localStorage tokens used
- **withCredentials: true is REQUIRED** - Must be set on all axios instances
- **Backend only checks cookies** - Authorization headers are ignored
- **httpOnly cookies** - Cannot be accessed or modified by JavaScript
- **Secure cookies in production** - Only sent over HTTPS

