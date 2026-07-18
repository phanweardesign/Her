# Her API Corrections

## Corrected
- Added the missing `POST /api/auth/login` backend route.
- Added phone number support to the User model so signup data matches MongoDB.
- Added backend validation, duplicate-account handling, password hashing, JWT creation, and safe public user responses.
- Standardized frontend session keys to `her_user` and `her_auth_token`.
- Fixed broken root `index.html` paths and removed stray Markdown text.
- Fixed signup links to the actual legal pages.
- Added `/api/health` for deployment checks.
- Added clear handling when `OPENAI_API_KEY` is missing.
- Added static frontend serving so Node can run Her without a separate web server.
- Added `.env.example`; the real `.env` is intentionally excluded from this corrected ZIP.
- Confirmed all JavaScript parses, npm reports zero vulnerabilities, active page assets exist, and health/auth/AI routes respond correctly.

## Deployment
1. Copy `backend/.env.example` to `backend/.env` on the server.
2. Enter the real MongoDB URI, JWT secret, and OpenAI API key.
3. From `backend`, run `npm ci --omit=dev` and `npm start`.
4. Test `/api/health`. It should return `"ok": true` and `"aiConfigured": true`.
