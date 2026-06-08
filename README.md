# Zap Shift

Zap Shift is a parcel delivery web application for sending parcels, tracking delivery progress, applying as a rider, and managing delivery operations through role-based dashboards.

Live site: https://zap-shift-1f9b2.web.app/

## Features

- Firebase authentication with email/password and Google sign-in
- Protected private routes for logged-in users
- Role-based dashboard access for user, rider, and admin
- Parcel booking form with warehouse and division data
- Delivery charge calculation before parcel submission
- Stripe payment flow for parcel payments
- User parcel list, parcel details, and payment history
- Parcel tracking by parcel ID
- Rider application system with duplicate-application checking
- Rider dashboard for pending and completed deliveries
- Admin dashboard for assigning riders and managing rider status
- Admin tools for active riders, inactive riders, pending riders, and make-admin workflow
- Coverage page with service center data
- Profile update and account security section
- Responsive UI with Tailwind CSS and DaisyUI
- Framer Motion and Lottie animations for a smoother interface

## Tech Stack

- React
- Vite
- React Router
- Tailwind CSS
- DaisyUI
- Firebase
- Axios
- TanStack Query
- Stripe
- Framer Motion
- Lottie React
- SweetAlert2
- React Hook Form
- React Leaflet

## Main Routes

- `/` - Home
- `/coverage` - Delivery coverage and service centers
- `/about-us` - About page
- `/send-parcel` - Private parcel booking page
- `/be-a-rider` - Private rider application page
- `/login` - Login
- `/register` - Register
- `/dashboard` - User parcel dashboard
- `/dashboard/payment/:id` - Parcel payment
- `/dashboard/payment-history` - Payment history
- `/dashboard/track-your-parcel` - Parcel tracking
- `/dashboard/update-profile` - Profile and account settings
- `/dashboard/pending-deliveries` - Rider-only pending deliveries
- `/dashboard/completed-deliveries` - Rider-only completed deliveries
- `/dashboard/assign-rider` - Admin-only rider assignment
- `/dashboard/active-riders` - Admin-only active riders
- `/dashboard/inactive-riders` - Admin-only inactive riders
- `/dashboard/pending-riders` - Admin-only pending rider requests
- `/dashboard/make-admin` - Admin-only make admin page

## Installation

Clone the project and install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run ESLint:

```bash
npm run lint
```

## Environment Variables

Create a `.env.local` file in the project root and add these values:

```env
VITE_apiKey=
VITE_authDomain=
VITE_projectId=
VITE_storageBucket=
VITE_messagingSenderId=
VITE_appId=
VITE_paymentKey=
VITE_IMGBB_API_KEY=
```

## API

The frontend currently communicates with the deployed backend:

```txt
https://profast-server-henna.vercel.app
```

Authenticated API requests send the Firebase ID token in the `Authorization` header.

## Project Structure

```txt
src/
  Components/          Reusable UI components
  Context/             Authentication context
  hooks/               Custom hooks for role and secure axios
  Layout/              Root and dashboard layouts
  Pages/               Main route pages
  PrivateRoute/        Private, rider, and admin route guards
  Router/              App route configuration
  SharedComponents/    Header, footer, and shared layout pieces
  assets/              Images, icons, and animation assets
  data/                Local JSON data
```

## Notes

- Private routes require a logged-in Firebase user.
- Rider routes require the `rider` role.
- Admin routes require the `admin` role.
- Stripe payments require a valid `VITE_paymentKey`.
- Image uploads require a valid `VITE_IMGBB_API_KEY`.
