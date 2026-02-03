# Setup Guide

This guide walks you through setting up the Student Success Compass, including Google Sheets API integration.

## Table of Contents

1. [Google Cloud Setup](#1-google-cloud-setup)
2. [Create Google Sheet](#2-create-google-sheet)
3. [Configure Environment Variables](#3-configure-environment-variables)
4. [Local Development](#4-local-development)
5. [Deploy to Vercel](#5-deploy-to-vercel)
6. [Post-Deployment](#6-post-deployment)

---

## 1. Google Cloud Setup

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Name it something like `student-success-compass`
4. Click **Create**

### 1.2 Enable Google Sheets API

1. In your project, go to **APIs & Services** → **Library**
2. Search for "Google Sheets API"
3. Click on it and press **Enable**

### 1.3 Create a Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service Account**
3. Fill in the details:
   - Name: `compass-service`
   - ID: `compass-service` (auto-filled)
   - Description: `Service account for Student Success Compass`
4. Click **Create and Continue**
5. Skip the optional steps and click **Done**

### 1.4 Create a Key for the Service Account

1. In the Credentials page, find your new service account
2. Click on the service account email
3. Go to the **Keys** tab
4. Click **Add Key** → **Create New Key**
5. Choose **JSON** and click **Create**
6. A JSON file will download - **keep this safe and never commit it to git**

### 1.5 Note the Service Account Email

From the JSON file, note the `client_email` value. It looks like:
```
compass-service@your-project.iam.gserviceaccount.com
```

---

## 2. Create Google Sheet

### 2.1 Create a New Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new blank spreadsheet
3. Name it `Student Success Compass - Responses`

### 2.2 Create Required Sheets/Tabs

Create two sheets (tabs) in your spreadsheet:

1. **Responses** - This will store student submissions
2. **Config** - This will store the open/closed status

### 2.3 Set Up the Config Sheet

In the `Config` sheet:
- Cell A1: `Test Status`
- Cell A2: `closed`

### 2.4 Share with Service Account

1. Click the **Share** button in the top right
2. Paste your service account email (from step 1.5)
3. Give it **Editor** access
4. Uncheck "Notify people"
5. Click **Share**

### 2.5 Get the Sheet ID

The Sheet ID is in the URL:
```
https://docs.google.com/spreadsheets/d/[THIS-IS-YOUR-SHEET-ID]/edit
```

Copy this ID - you'll need it for configuration.

---

## 3. Configure Environment Variables

### 3.1 Understanding the Variables

Open your downloaded JSON key file. You'll need:

| Variable | Where to Find It |
|----------|------------------|
| `GOOGLE_SHEET_ID` | From the Google Sheet URL |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `client_email` in the JSON file |
| `GOOGLE_PRIVATE_KEY` | `private_key` in the JSON file |
| `ADMIN_SECRET_KEY` | You create this (any secure random string) |

### 3.2 Format the Private Key

The private key in the JSON file has actual newlines. When setting as an environment variable:

**For local `.env.local` file:**
```
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBAD...[rest of key]...\n-----END PRIVATE KEY-----\n"
```

Replace the actual newlines with `\n` characters, and wrap the whole thing in double quotes.

**Tip:** You can use this command to format it:
```bash
cat your-key-file.json | jq -r '.private_key' | sed 's/$/\\n/' | tr -d '\n'
```

### 3.3 Create Your Local Configuration

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Google Sheets Configuration
GOOGLE_SHEET_ID=your-google-sheet-id-here
GOOGLE_SERVICE_ACCOUNT_EMAIL=compass-service@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Sheet Names (usually don't need to change)
GOOGLE_SHEET_NAME=Responses
GOOGLE_CONFIG_SHEET_NAME=Config

# Admin Key (create a secure random string)
# Example: openssl rand -hex 32
ADMIN_SECRET_KEY=your-secure-random-string-here
```

### 3.4 Generate a Secure Admin Key

```bash
# On macOS/Linux
openssl rand -hex 32

# Or use any password generator
# Example output: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

---

## 4. Local Development

### 4.1 Install Dependencies

```bash
npm install
```

### 4.2 Start Development Server

```bash
npm run dev
```

### 4.3 Test the Application

1. Open [http://localhost:3000](http://localhost:3000)
2. You should see the landing page
3. Try the admin portal: [http://localhost:3000/admin?key=YOUR_ADMIN_KEY](http://localhost:3000/admin?key=YOUR_ADMIN_KEY)
4. Open the portal and complete a test submission
5. Check your Google Sheet - data should appear!

---

## 5. Deploy to Vercel

### 5.1 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/student-success-compass.git
git push -u origin main
```

### 5.2 Import to Vercel

1. Go to [Vercel](https://vercel.com/)
2. Click **Add New...** → **Project**
3. Import your GitHub repository
4. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: **./** (default)

### 5.3 Add Environment Variables

In the Vercel project settings → **Environment Variables**, add all your variables:

| Name | Value |
|------|-------|
| `GOOGLE_SHEET_ID` | Your sheet ID |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Your service account email |
| `GOOGLE_PRIVATE_KEY` | Your private key (with \n for newlines) |
| `GOOGLE_SHEET_NAME` | `Responses` |
| `GOOGLE_CONFIG_SHEET_NAME` | `Config` |
| `ADMIN_SECRET_KEY` | Your admin secret |

**Important:** When adding `GOOGLE_PRIVATE_KEY` in Vercel:
- Paste the key exactly as it appears in your `.env.local`
- Include the surrounding double quotes
- Include the `\n` characters (don't convert to actual newlines)

### 5.4 Deploy

Click **Deploy**. Vercel will build and deploy your application.

---

## 6. Post-Deployment

### 6.1 Verify Everything Works

1. Visit your Vercel URL
2. Try the admin portal with your key
3. Open the portal
4. Complete a test submission
5. Check your Google Sheet

### 6.2 Share the Links

**Student Link:**
```
https://your-app.vercel.app
```

**Admin Link (keep secret!):**
```
https://your-app.vercel.app/admin?key=your-admin-key
```

### 6.3 Building Dashboards

Your Google Sheet now contains all the data needed for dashboards. You can:

1. Use Google Sheets' built-in charting
2. Connect to Google Data Studio / Looker Studio
3. Use conditional formatting for flags
4. Create pivot tables for aggregate analysis

### 6.4 Recommended Dashboard Views

1. **Quick Glance**: Filter by flags to see students needing attention
2. **Engagement Radar**: Average scores by domain across cohort
3. **Cognitive Distribution**: Histogram of cognitive scores
4. **Support Requests**: Most common requested support areas

---

## Troubleshooting

### "Failed to connect to server"

- Check your Google API credentials
- Ensure the Sheets API is enabled
- Verify the service account has Editor access to the sheet

### "Unauthorized" on admin page

- Check that your `ADMIN_SECRET_KEY` matches in the URL and environment

### Data not appearing in sheet

- Check the browser console for errors
- Verify the sheet names match your config
- Ensure the service account has been shared on the sheet

### Private key errors

- Make sure newlines are escaped as `\n`
- Ensure the key is wrapped in double quotes
- Try re-copying from the original JSON file

---

## Code Locations to Update

If you need to modify the Google Sheets integration:

| File | Purpose |
|------|---------|
| `src/lib/googleSheets.ts` | API client and sheet operations |
| `src/lib/types.ts` | Data structure definitions |
| `src/lib/scoring.ts` | Scoring algorithms |
| `src/app/api/submit/route.ts` | Submission endpoint |
| `src/app/api/status/route.ts` | Status check endpoint |
| `src/app/api/toggle/route.ts` | Portal toggle endpoint |

The Google Sheets client is initialized in `googleSheets.ts` lines 4-14. Environment variables are read directly from `process.env`.

---

## Security Notes

1. **Never commit** your `.env.local` file or JSON key file
2. **Rotate your admin key** periodically
3. **Monitor** your Google Cloud usage and billing
4. **Limit access** to the Google Sheet as needed
5. **Use HTTPS** (Vercel provides this automatically)

---

## Questions?

Contact your system administrator or technical lead for support.
