# Corporate Visitor Management System (VMS)

A modern, full-stack Next.js application designed to manage walk-in visitors, capture visitor photos, and automate secure email approval workflows for hosts.

## 🚀 Tech Stack

* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS
* **Database:** Corporate SQL Server (via API routes)
* **Email Automation:** Nodemailer (SMTP)
* **Image Storage:** Cloudinary (Client-Side Unsigned Uploads)

## ✨ Core Features

* **Reception Dashboard:** View real-time visitor statuses and print visitor passes.
* **Visitor Registration:** Capture visitor details, assign to a corporate host, and take live webcam photos.
* **Automated Host Approvals:** Instantly emails the selected host via SMTP with secure Approve/Reject buttons.

---

## 🛠️ 1. Prerequisites

Before running this project, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18.x or higher)
* npm or yarn
* Access to the Corporate SQL Database credentials
* A free [Cloudinary](https://cloudinary.com/) account (for photo storage)
* A dedicated company Gmail account (for sending approval emails)

---

## 🔐 2. Environment Variables Setup

Create a `.env.local` file in the root directory. **Do not commit this file to GitHub.** Add the following variables:

```text
# Next.js Application URL (Change to production URL when deploying)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Corporate SQL Server Connection Details
COMPANY_DB_USER="your_sql_user"
COMPANY_DB_PASSWORD="your_sql_password"
COMPANY_DB_SERVER="your_server_ip"
COMPANY_DB_PORT="1433"
COMPANY_DB_NAME="your_db_name"

# Email Automation (Gmail SMTP)
# Note: You MUST generate a 16-character 'App Password' from Google Account Security. 
# Standard Gmail passwords will not work.
GMAIL_USER="reception@yourcompany.com"
GMAIL_APP_PASSWORD="your_16_character_app_password"

# Cloudinary Image Storage (Public Variables)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your_upload_preset"
```

📸 3. Cloudinary Setup (Critical)
This system uses "Unsigned Client-Side Uploads" to send visitor photos directly from the browser to Cloudinary without exposing backend secret keys.

To configure your Cloudinary account:

Log into your Cloudinary Dashboard.

Find your Cloud Name and add it to NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.

Go to Settings > Upload and scroll down to Upload Presets.

Click Add Upload Preset.

Change the Signing Mode to Unsigned.

Name the preset (e.g., vms_visitors_corporate) and save it.

Add that preset name to NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your .env.local file.

---

## 🗄️ 4. Database Setup (MongoDB)

This application uses MongoDB to store visitor logs and host data.
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas/database) (or use your internal enterprise MongoDB server).
2. Create a database user and whitelist your server's IP address (or `0.0.0.0/0` for Vercel deployment).
3. Copy the connection string and paste it into the `MONGODB_URI` variable in your `.env.local` file.

💻 5. Running Locally
Install all dependencies:

Bash
npm install
Start the development server:

Bash
npm run dev
Open http://localhost:3000 in your browser.

🚢 6. Deployment Guide (Vercel)
This application is optimized for zero-config deployment on Vercel.

Push this repository to a private GitHub organization.

Go to Vercel and import the repository.

Open the Environment Variables tab in Vercel.

Copy every variable from your local .env.local file and paste them into Vercel.

Hit Deploy.

Note: Remember to update NEXT_PUBLIC_APP_URL in the Vercel environment variables to match your final production domain (e.g., https://vms.yourcompany.com).