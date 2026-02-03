# Student Success Compass

A 15-minute psychometric screening system for higher education student success, designed for ALCHE (African Leadership College of Higher Education).

## Overview

The Student Success Compass is a web-based assessment tool that helps identify students who may benefit from additional support and resources. It measures:

- **Learning Profile**: Attention, reading, and numerical processing patterns
- **Engagement Orientation**: Academic preparedness, classroom engagement, receptivity to support, future orientation, and belonging
- **Thinking Patterns**: Abstract reasoning, numerical reasoning, and critical thinking
- **Self-Assessment**: Student-identified strengths and support preferences

Results are automatically submitted to a Google Sheet for dashboard creation and team review.

## Features

- ✅ 15-minute assessment (58 items + 2 open responses)
- ✅ Mobile-responsive design
- ✅ Timed cognitive section with visual countdown
- ✅ Automatic scoring and flag generation
- ✅ Results summary for students
- ✅ Google Sheets integration for data storage
- ✅ Admin portal to open/close assessments
- ✅ No authentication required for students

## Quick Start

### Prerequisites

- Node.js 18+ 
- A Google Cloud account (for Sheets API)
- A Vercel account (for deployment)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd student-success-compass

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Configure your environment variables (see SETUP.md for Google Sheets setup)
# Then start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
student-success-compass/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Landing page (name entry)
│   │   ├── intake/             # Intake year selection
│   │   ├── program/            # Program selection
│   │   ├── test/               # Main assessment
│   │   ├── results/            # Results display
│   │   ├── admin/              # Admin portal
│   │   └── api/                # API routes
│   │       ├── status/         # Check test status
│   │       ├── toggle/         # Toggle open/closed
│   │       └── submit/         # Submit responses
│   ├── components/             # React components
│   ├── context/                # React context (test state)
│   └── lib/                    # Utilities
│       ├── types.ts            # TypeScript definitions
│       ├── questions.ts        # All test questions
│       ├── scoring.ts          # Scoring algorithms
│       └── googleSheets.ts     # Google Sheets API
├── public/                     # Static assets
├── SETUP.md                    # Detailed setup guide
└── .env.example                # Environment template
```

## Configuration

See [SETUP.md](./SETUP.md) for detailed instructions on:

1. Creating a Google Cloud service account
2. Setting up Google Sheets API
3. Configuring environment variables
4. Deploying to Vercel

## Admin Portal

Access the admin portal to open/close the assessment:

```
https://your-domain.vercel.app/admin?key=your-admin-secret-key
```

When closed, students see a friendly message that the assessment is unavailable.

## Google Sheet Structure

The app creates two sheets:

### Responses Sheet
Contains all student responses and calculated scores with columns for:
- Metadata (timestamp, name, intake year, program)
- Raw responses for all sections (A1-E6)
- Calculated flags (Language, Wellbeing, Attention, Reading, Numerical)
- Engagement domain scores
- Cognitive scores

### Config Sheet
Contains a single cell (`A2`) with the test status (`open` or `closed`).

## Assessment Sections

| Section | Items | Time | Description |
|---------|-------|------|-------------|
| A: Foundation | 6 | 1-2 min | Language, wellbeing baseline, background |
| B: Learning Profile | 15 | 2-3 min | Attention, reading, numerical processing |
| C: Engagement | 30 | 4-5 min | Five engagement domains |
| D: Thinking Patterns | 12 | 5 min (timed) | Abstract, numerical, critical reasoning |
| E: Reflection | 4+2 | 1-2 min | Strengths, support preferences, open responses |

## Scoring & Flags

### Traffic Light System

- 🟢 **GREEN**: No particular support indicated
- 🟡 **YELLOW**: May benefit from strategies/resources
- 🔴 **RED**: Recommend follow-up conversation

### Score Ranges

| Measure | Range | Notes |
|---------|-------|-------|
| Engagement domains | 6-30 each | Higher is better |
| Total Engagement | 30-150 | Sum of all domains |
| Grit Indicator | 6-30 | Subset of engagement items |
| Cognitive domains | 0-4 each | Correct answers |
| Total Cognitive | 0-12 | Sum of all domains |

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

See [SETUP.md](./SETUP.md) for detailed Vercel deployment instructions.

## License

Proprietary - ALCHE Internal Use Only

## Support

For technical issues or questions, contact your system administrator.
