# 🚑 MedRoute — Smart Campus Medical Response & Readiness Platform

> **"Help should never be hard to find."**  
> *Know where to go. Know who to contact. Get connected to the right campus medical resources.*

---

## 🏆 Competition Problem Statement: Smart Campus & Student Life

On large collegiate campuses, students and visitors frequently struggle during critical moments:
- Locating the nearest emergency first-aid kit or eyewash station.
- Finding the 24/7 campus medical centre.
- Knowing if a public AED (Automated External Defibrillator) is operational and verified.
- Contacting authorized campus first-responders without hunting through noticeboards.
- Navigating step-free ADA-compliant emergency access routes.
- Reporting depleted medical supplies or damaged safety equipment.

**MedRoute** brings verified campus medical resources, real-time readiness tracking, and emergency coordination into a single, highly accessible interface.

---

## 🌟 Core Features & Modules

### 1. Interactive Campus Medical Readiness Map (`/map`)
- **Illustrated Vector Campus Architecture**: Polished architectural layout across North, Central, South, East, and West zones.
- **Categorized Custom Markers**: Medical Centre, First-Aid Wall Hubs, Alarmed AED Cabinets, Subsidized Pharmacy, Ambulance Access Bays, Muster Points, and ADA Ramps.
- **Dynamic Route Guide**: Choose your starting campus location (e.g. Student Center, Residence Hall, Library) to calculate and render walking routes.
- **Resource Drawer**: Click any marker to view full verified equipment inventories, opening hours, wheelchair access, and direct `tel:` dialing.

### 2. Searchable Medical Resource Directory (`/resources`, `/resources/:id`)
- Multi-faceted filters by **Resource Type**, **Building**, **Availability Status**, and **ADA Wheelchair / Elevator Access**.
- Sort by **Recently Verified First**, **Alphabetical**, or **Category**.
- Complete equipment inventory audit tables with item quantities and last inspection dates.

### 3. Emergency Assistance Hub (`/emergency`)
- **Immediate Life-Threat Helplines**: Official National Emergency **112** (India / Municipal Dispatch) and 24/7 Campus Medical Triage.
- One-click `tel:` calling and instant copy-to-clipboard.
- **Privacy-by-Design Location Sharing**: Explicit user consent required before acquiring or sharing GPS coordinates.
- **Immediate Campus Emergency Protocols**: 3-step immediate instructions (Assess & Call, AED Fetch, Ambulance Route Clearance).

### 4. Campus Assistance Request Workflow (`/requests`)
- Structured non-emergency triage for mobility escorts, minor sports injuries, or health camp inquiries.
- Live status audit trail: `Submitted` ➔ `Acknowledged` ➔ `In Progress (Responder Dispatched)` ➔ `Resolved`.
- Automatic notification triggers upon responder status updates.

### 5. Crowdsourced Equipment Issue Reporting (`/report`)
- Enables students to report empty first-aid drawers, damaged AED tamper seals, broken eyewash pressure, or door sensor faults.
- Status tracking: `Submitted` ➔ `Under Review` ➔ `Assigned to Tech` ➔ `Resolved`.
- Optional photo evidence attachment simulation.

### 6. Evidence-Based First-Aid Educational Guide (`/first-aid`)
- Curated guidance for **Minor Cuts**, **Burns**, **Sprains (R.I.C.E.)**, **Nosebleeds**, **Heat Exhaustion**, **Fainting**, **Choking (Heimlich)**, and **Severe Bleeding**.
- Structured with **Immediate Recommended Actions**, **What NOT To Do**, and **Red Flags for Urgent Emergency Intervention**.
- Grounded in citations from recognized medical authorities (Mayo Clinic, Red Cross, WHO, NHS, AHA).

### 7. Responder Coordination Desk (`/staff`)
- Restricted interface for campus medical staff, triage nurses, and responders.
- Live queue of pending student assistance calls with single-click triage status changes and internal notes.
- Quick resource status overrides (Available, Maintenance, Closed).

### 8. Campus Readiness Analytics & Governance (`/admin`)
- Real-time charts powered by **Recharts**, computed directly from stored campus data:
  - Medical resources by category (Bar chart)
  - Operational & verification status breakdown (Donut pie chart)
  - Geographic distribution across campus zones (Zone coverage chart)
  - Student assistance requests by category (Bar chart)
- Single-click station verification to renew 30-day compliance audits.
- Provisioning form to add new first-aid points and AED cabinets to the campus grid.

---

## 🎨 Visual Identity & Principles

- **Deep Navy (`#101D32`)**: Authority, stability, and structure.
- **Medical Blue (`#2367D1`)**: Guidance, clinical clarity, and trust.
- **Teal (`#19A999`) & Mint (`#DDF5EC`)**: Health recovery, calm navigation, and verification.
- **Emergency Red (`#D94343`)**: Reserved strictly for genuine emergencies and priority-zero warnings.
- **Zero False Guarantees**: Online requests clearly disclaim that they do not replace dialing 112 in life-threatening scenarios.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Framer Motion
- **Data Visualization**: Recharts
- **State Management**: Zustand with persistent storage abstraction
- **Routing**: React Router DOM (v6)
- **Database & Backend Readiness**:
  - Full client-side persistent storage engine (`StorageService`) with realistic demo campus dataset.
  - Normalized PostgreSQL schema with Row-Level Security (RLS) in `supabase/schema.sql`.
  - Supabase client service abstraction in `src/services/supabase.ts`.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone or navigate to the repository
cd MedRoute

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Building for Production

```bash
npm run build
```

Production assets will be output to the `dist/` directory.

---

## 🎭 Demonstration Personas

MedRoute includes an instant **Role Persona Switcher** on the top banner:
1. **Alex Rivera (Student)** — 3rd Year Bio-Engineering (`MED-2024-8841`)
2. **Dr. Priya Sharma (Medical Staff)** — Chief Medical Officer, Campus Health Services
3. **Marcus Vance (Administrator)** — Director of Campus Safety Infrastructure

A **Reset Demo Data** button is available at any time to restore initial seed data.

---

## 📄 License
MedRoute is developed for academic, competitive, and campus safety modernization initiatives.

