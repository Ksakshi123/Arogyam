# Arogyam - Ayurvedic Wellness & Diet Guide

## Overview
Arogyam is a personalized Ayurvedic wellness portal designed to provide holistic health insights based on an individual's Dosha (constitution). It includes a Dosha assessment, a smart weekly meal planner with personalized recipes, progress tracking, macro tracking (protein/calories), and an AI wellness assistant.

## Tech Stack
* **Frontend**: React, TypeScript, Vite
* **Styling**: Tailwind CSS, Shadcn UI, Framer Motion (for animations), Lucide React (for icons)
* **State Management**: Zustand
* **Database / Backend**: Client-side SQLite (using `sql.js` via WASM) embedded directly in the browser to act as a self-contained local database.
* **Charts/Analytics**: Recharts
* **Routing**: React Router DOM

## Features Developed From Scratch
1. **Dosha Assessment (Prakriti Analysis)**
   - A multi-step interactive quiz to determine a user's Ayurvedic constitution (Vata, Pitta, Kapha).
   - Generates a personalized profile highlighting their primary/secondary doshas and specific wellness recommendations.
   
2. **Onboarding & Authentication Flow**
   - Clean signup/login interface directing users to enter their profile (age, weight, height, activity level, allergies).
   
3. **Dashboard & Analytics**
   - **PatientDashboard**: The main hub showing active streaks, today's meal completion status, macro rings, and easy access to core features.
   - **PatientNavBar**: A consistent navigation header spanning across all user-facing pages for seamless transitions.
   - **NutritionAnalytics**: Visualized macro analytics (protein/calories) tracked over the week against daily targets, using Recharts.

4. **Smart Weekly Diet Planner**
   - Recommends a full 7-day curated meal plan featuring breakfast, lunch, and dinner.
   - Automatically adapts to the user's generated Dosha (e.g., Pitta-friendly cooling foods, Vata-friendly warming foods).
   - Features one-click swapping of meals with dosha-compatible alternatives.
   - Users can "Mark as Done" on meals which increments their adherence score and streak.

5. **Client-Side SQLite Database Integration**
   - Fully functions offline/locally by using `sql.js` (WebAssembly SQLite) to store patient profiles, meal plans, streaks, and completions.
   - `patientStore.ts` and `dietStore.ts` hydrate data from the SQLite instance on load and sync state changes back to it.

6. **Design & UX**
   - Rich, modern, medical-wellness aesthetic combining deep emeralds/teals with smooth micro-animations.
   - Replaced default boilerplate content with a high-quality Ayurvedic ingredients hero image and a custom vector logo.

## Recent Updates & Enhancements
- **Consistent Navigation**: Implemented `PatientNavBar` across all portal pages (Dashboard, Weekly Plan, Progress, Analytics, Profile, Find Diet, Meal Plans).
- **Background Images & Logos**: Integrated new high-quality generative AI imagery for the landing page hero and a modernized "Arogyam" logo with transparent background.
- **Removed Boilerplate**: Stripped out "Lovable" default references and metadata from `index.html`, added proper favicons and meta tags.
- **Bug Fixes**: Resolved state synchrony issues in the Dosha Assessment quiz to accurately capture the final answer before calculating the result. Resolved type mismatches between the store and API layer for calculating the correct constitution strings.
