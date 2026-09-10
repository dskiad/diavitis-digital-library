# Access API contract for future OTP activation

The GitHub Pages site is static. It must never contain the authorised-email database, SMTP credentials, OTP secrets, or private API keys.

## Front-end switch

`config.js` currently contains:

```js
DEMO_MODE: true
```

For production, change it to `false` and set `API_BASE_URL` to your HTTPS backend.

## Required backend endpoints

### POST `/api/access/request-otp`

Request:

```json
{ "email": "member@example.com" }
```

Backend responsibilities:

1. Normalise the email address.
2. Check the authorised-members database.
3. If authorised, generate a cryptographically secure one-time code.
4. Store only a hashed OTP with a short expiry (recommended 5–10 minutes) and attempt counter.
5. Send the OTP by email.
6. Return a generic response regardless of whether the address exists, to prevent email-address enumeration.

Recommended response:

```json
{ "ok": true, "message": "If authorised, an OTP has been sent." }
```

### POST `/api/access/verify-otp`

Request:

```json
{ "email": "member@example.com", "code": "123456" }
```

Backend responsibilities:

1. Verify the email is authorised.
2. Verify the OTP hash, expiry, and attempt count.
3. Invalidate the OTP after successful use.
4. Create an authenticated session.
5. Prefer a Secure, HttpOnly, SameSite cookie rather than storing access tokens in browser JavaScript.

Success:

```json
{ "ok": true }
```

Failure:

```json
{ "ok": false, "message": "The email or code was not accepted." }
```

### GET `/api/access/session` (optional but recommended)

Returns whether the browser already has a valid authenticated session.

## CORS and security

If the backend is on another domain, allow only your GitHub Pages/custom-domain origin. Use HTTPS only. Add rate limiting for OTP requests and verification attempts. Never send the full authorised-email list to the browser.
