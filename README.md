# KOROKO-ADMIN & MAIN STORE CORS CONFIGURATION

To allow `https://admin.koroko.in` to communicate seamlessly with your main store API (`https://koroko.in/api/*`), add this CORS header block into `d:\Desktop\Projects\Koroko\vercel.json` under `"headers"`:

```json
{
  "source": "/api/(.*)",
  "headers": [
    { "key": "Access-Control-Allow-Credentials", "value": "true" },
    { "key": "Access-Control-Allow-Origin", "value": "https://admin.koroko.in" },
    { "key": "Access-Control-Allow-Methods", "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
    { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-admin-secret" }
  ]
}
```

## Running Koroko-Admin Locally
```bash
cd d:\Desktop\Projects\Koroko-Admin
npm run dev
```
Local URL: `http://localhost:5174/`

## Deployment to Vercel (admin.koroko.in)
1. Push `Koroko-Admin` to its own GitHub repository.
2. In Vercel, click **Add New... ➔ Project** and import `Koroko-Admin`.
3. In Project Settings ➔ **Domains**, add `admin.koroko.in`.
4. Point DNS CNAME `admin` to `cname.vercel-dns.com`.
