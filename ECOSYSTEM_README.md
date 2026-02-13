# Yummyfi — Complete Production Ecosystem

A **Zomato/Swiggy-grade** food delivery platform built with React Native Expo (mobile), React (admin panel), Firebase (backend), Razorpay (payments), and Socket.io (live tracking).

## Architecture Overview

```text
yummyfi-app/
├── src/               # Existing React web app (Vite + React 19)
├── mobile/            # React Native Expo mobile app
├── admin/             # Admin Panel (Vite + React 18)
├── functions/         # Firebase Cloud Functions (Razorpay + order hooks)
├── tracking-server/   # Socket.io real-time tracking server
├── firestore.rules    # Firestore security rules
└── firebase.json      # Firebase project config
```

---

## 1. Mobile App (Expo)

### Mobile App Setup

```bash
cd mobile
npm install

# Create .env from template
cp .env.example .env
# Fill in your Firebase config values (EXPO_PUBLIC_FIREBASE_*)
```

### Mobile App Run

```bash
npx expo start
# Press 'a' for Android / 'i' for iOS / 'w' for web
```

### Key Features

- **Home Screen** — Zomato-style UI with offers carousel, veg/non-veg filter, product grid
- **Product Detail** — Image carousel, ratings, add-to-cart with animations
- **Cart** — Quantity controls, coupon input, UPI/COD payment selection
- **Orders** — Active/past orders with real-time status badges
- **Live Tracking** — WebView Leaflet map with delivery boy marker, ETA, route polyline
- **Profile** — User info, edit, order history shortcuts
- **Search** — Real-time product filtering

### Tech Stack

- Expo 51 + React Native 0.74
- React Navigation (bottom tabs + stack)
- react-native-reanimated (60fps animations)
- expo-location (GPS permissions + reverse geocoding)
- socket.io-client (live tracking)
- AsyncStorage (local persistence)
- WebView + Leaflet (OpenStreetMap for tracking)

---

## 2. Admin Panel (Web)

### Admin Panel Setup

```bash
cd admin
npm install

cp .env.example .env
# Fill in Firebase config (VITE_FIREBASE_*) and VITE_SOCKET_SERVER_URL
```

### Admin Panel Run

```bash
npm run dev
# Opens at http://localhost:3000
```

### Admin Key Features

- **Dashboard** — Real-time stats cards (orders, revenue, active, products)
- **Products** — Full CRUD, search, veg/non-veg tagging, image URLs
- **Orders** — Status management with 8 states, assign delivery boys, confirm/cancel
- **Delivery Boys** — Add/remove, availability toggle, ratings
- **Live Tracking** — react-leaflet map with all active deliveries, Socket.io real-time
- **Offers** — Create/edit promo offers with validity dates
- **Coupons** — Discount codes with min order, max discount, usage limits
- **Users** — View all registered users
- **Settings** — Delivery fees, GST, kitchen location, Razorpay key, store open/close

### Admin Roles

| Role             | Access                                          |
| ---------------- | ----------------------------------------------- |
| `super_admin`    | Full access to all pages + settings             |
| `order_admin`    | Dashboard, Orders, Products, Offers, Coupons    |
| `delivery_admin` | Dashboard, Delivery Boys, Live Tracking, Orders |

---

## 3. Firebase Cloud Functions

### Functions Setup

```bash
cd functions
npm install

# Set Razorpay secrets
firebase functions:config:set razorpay.key_id="rzp_live_xxx" razorpay.key_secret="xxx" razorpay.webhook_secret="xxx"
```

### Deploy

```bash
firebase deploy --only functions
```

### Endpoints

| Function                | Type              | Description                                  |
| ----------------------- | ----------------- | -------------------------------------------- |
| `createRazorpayOrder`   | Callable          | Creates Razorpay order for UPI payment       |
| `verifyRazorpayPayment` | Callable          | Verifies payment signature server-side       |
| `razorpayWebhook`       | HTTP              | Razorpay payment webhook handler             |
| `onOrderStatusChange`   | Firestore trigger | Auto-timestamps + cleanup on status change   |
| `setAdminRole`          | Callable          | Super admin can assign roles to other admins |

---

## 4. Tracking Server (Socket.io)

### Tracking Server Setup

```bash
cd tracking-server
npm install

cp .env.example .env
# Set FIREBASE_SERVICE_ACCOUNT (JSON) and PORT
```

### Tracking Server Run

```bash
npm run dev
# Runs on http://localhost:3001
```

### Socket Events

| Event             | Direction       | Description                             |
| ----------------- | --------------- | --------------------------------------- |
| `join-tracking`   | Client → Server | Join order tracking room                |
| `leave-tracking`  | Client → Server | Leave tracking room                     |
| `update-location` | Client → Server | Delivery boy sends GPS coordinates      |
| `location-update` | Server → Client | Broadcast location to room participants |
| `status-update`   | Server → Client | Order status changed notification       |
| `tracking-ended`  | Server → Client | Delivery completed/cancelled            |

---

## 5. Firestore Security Rules

Deploy the security rules:

```bash
firebase deploy --only firestore:rules
```

Key rules:

- **Products/Offers/Settings**: Public read, admin-only write
- **Orders**: Users can read own orders, admins can read all
- **Delivery Boys/Admins/Tracking**: Admin-only access
- **Users**: Own profile read/write, admin can read all

---

## 6. Firebase Setup

### Initial Firestore Admin Setup

Create the first super admin manually in Firestore:

```text
Collection: admins
Document ID: <your-firebase-uid>
Fields:
  email: "your@email.com"
  role: "super_admin"
```

### Required Firebase Services

- **Authentication** — Google Sign-In provider enabled
- **Firestore** — Database for all app data
- **Storage** — Product image uploads
- **Cloud Functions** — Payment processing + triggers
- **Hosting** (optional) — Deploy admin panel

---

## Environment Variables

### Mobile (.env)

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_SOCKET_SERVER_URL=http://localhost:3001
EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx
```

### Admin (.env)

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_SOCKET_SERVER_URL=http://localhost:3001
VITE_ADMIN_EMAILS=admin@example.com
```

---

## Brand Colors

| Name     | Hex       | Usage                |
| -------- | --------- | -------------------- |
| Maroon   | `#7A0C0C` | Primary              |
| Burgundy | `#8B1A1A` | Primary hover        |
| Dark Red | `#4E0A0A` | Headers/dark accents |
| Cream    | `#FFF8F3` | Background           |
| Yellow   | `#F4B400` | Accent/ratings       |
| Mustard  | `#DFA200` | Secondary accent     |

---

## Deployment

### Admin Panel → Vercel

```bash
cd admin
npm run build
# Deploy dist/ to Vercel
```

### Cloud Functions → Firebase

```bash
firebase deploy --only functions
```

### Tracking Server → Railway/Render

Deploy `tracking-server/` as a Node.js service with the `FIREBASE_SERVICE_ACCOUNT` env variable set.

### Mobile → EAS Build

```bash
cd mobile
npx eas build --platform android
npx eas build --platform ios
```

---

## License

Private — Yummyfi
