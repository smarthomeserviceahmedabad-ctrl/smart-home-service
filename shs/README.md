# Smart Home Service

Next.js (App Router) website for booking maids, cooks, babysitters, caregivers and drivers in Gujarat.
**Frontend-only build:** there is no database or server code. Bookings, staff, settings and admin edits are saved in the visitor's browser (localStorage).

## Run it
```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```
Deploy: push to Vercel (no database needed). Set `NEXT_PUBLIC_SITE_URL` to your real domain so canonical URLs and the sitemap are correct.

## Environment variables (`.env`)
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public site URL (canonical links, sitemap) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number with country code, e.g. `919876543210` (fallback if not set in Admin → Settings) |
| `NEXT_PUBLIC_PHONE` | Click-to-call number (fallback) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID, e.g. `G-XXXXXXX` (optional) |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Google Search Console verification code (defaults to the site's configured token) |

## Where things are
- `src/lib/data.ts` — services, cities, sample staff, FAQs, blog posts, policies, translations (edit here to change site content)
- `src/lib/store.tsx` — browser state and persistence (replace with API calls when a backend is added)
- `src/views/` — pages: `public.tsx`, `book.tsx` (booking wizard, tracking), `account.tsx` (login, customer dashboard, staff), `admin.tsx`
- `src/components/` — header/footer/chat (`chrome.tsx`), shared UI (`blocks.tsx`), hero slider, icons and illustrations (`art.tsx`)
- `src/app/` — routes, SEO metadata, sitemap, robots. SEO landing pages like `/maid-service-in-ahmedabad` come from `src/app/[landing]`.

## Pages
Home, About, Services (+22 service pages), Find Professionals, profiles, Locations (+10 city pages, 220 service-in-city pages), How It Works, Pricing, Blog, Contact, Book (7-step wizard), Track, Login (demo OTP), Customer dashboard, Staff registration, Staff portal, Admin panel (bookings, staff, services, customers, locations, content, marketing, reports, settings), policy pages.

Admin panel: `/admin`, demo password `admin123` (change it in Settings).

## Limits of the frontend-only build
These need a backend before going live with real customers:
- Bookings are only stored in the browser that made them — the business does **not** receive them automatically. Configure the WhatsApp number so customers can send their booking on WhatsApp.
- Admin password and OTP login are demo-only (checked in the browser, OTP shown on screen).
- No SMS/email notifications, no Razorpay payments, ID documents are not uploaded.
- Admin edits (prices, services, slides) are visible only in the admin's own browser; search engines see the content in `src/lib/data.ts`.
- Photos live in `public/images/<key>.jpg` (one per service plus hero photos), listed with credits in `src/lib/photos.json`. They are free Pexels/Unsplash stock photos — Indian photos where available (`"indian": true`), alternatives elsewhere. They are representative, not photos of your staff.
  - **Swap a photo:** replace the file in `public/images/` with your own (same file name), or change its `remote` URL in `photos.json` and run `npm run images -- --force`.
  - Or upload a photo in Admin → Services / Content (overrides the file, but only in that browser).
  - If a file is missing, the illustration is shown instead.
- Policy pages are templates: complete the bracketed parts and get them legally reviewed.
