# Guests Admin App - Demo - Client Work

Administrador de casa de hospedaje.

Hecho con:

- [Next.js](https://nextjs.org/)
- [Tailwind](https://tailwindcss.com/)
- [Mantine.dev](https://mantine.dev/)
- [next-firebase-auth](https://github.com/gladly-team/next-firebase-auth)
- [Firebase](https://firebase.google.com/)
- [Vercel](https://vercel.com/)
- and others... (see package.json)

## Setup:

This app needs a firebase account and project setup to work.

- Create a new [Firebase](https://console.firebase.google.com/) project
- Add Firebase to your web app
- Setup Firestore, and make sure to add the write/read rules based on the example rules on firestore-rules-example.md file
- Start Authentication, and add at least one account to login into the app, otherwise you'll get an error: auth/configuration-not-found. Must use a valid email, as you'll need to verified it to perform admin role actions. Then do a POST request to localhost:3000/api/initialSetup with the a JSON body of:
  `{ "email": "testuser@test.com", "role": { "admin": true } }` and the Bearer token as `one-time-setup`. Close session and refresh page to see the changes. Optional, delete the api endpoint api/initialSetup.ts.

- For Firestore you'll need to create the following collections for the app to work:

  - Finances, expenses, payments, renters, rooms, and settings

- For renter payments to show on their profile you'll need to create two indexes in the 'indexes' tab of the Firestore db:

  - `payments addedByItemValueID Ascending created_at Ascending Collection `
  - `payments addedByItemValueID Descending created_at Descending Collection`

- Setup Storage, and make sure to add the write/read rules based on the example rules on object-storage-rules-example.md file

  - For Storage you'll also need add a cors.json ([Storage Cors](https://firebase.google.com/docs/storage/web/download-files?hl=en&authuser=0#cors_configuration)) file via the [Google Cloud SDK Shell](https://cloud.google.com/storage/docs/gsutil_install?authuser=0), this will allow vercel to get the images stored in your project. (see next.config.js images>domains)

- See `.env.example` for details on the env variables needed for the app to start

## Start:

Install dependencies

1. `npm i` or `yarn`
   - 1.1 `npm run build` or `yarn build`
   - 1.2 `npm run start` or `yarn start`

## Build:

(Optional) Lint before build

2. `npm run lint` or `yarn lint`

Build production-ready version

3. `npm run build` or `yarn build`

(Optional) Deploy (requires vercel-cli)

4. `vercel --prod`

## Develop:

(Optional) Setup Firebase Emulator

5. Firebase Emulator reference

Start your favorite code editor and

6. `npm run dev` or `yarn dev`

## Deploy to Vercel:

7. Install the [Vercel CLI](https://vercel.com/docs/cli) `npm i -g vercel`

8. Run `vercel` to setup your vercel cloud account

9. Run `vercel --prod` to deploy to production

---

stratolark © 2022
