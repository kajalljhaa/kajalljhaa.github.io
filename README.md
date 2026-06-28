# Alex Morgan — Premium Portfolio

A world-class, fully editable, free-to-deploy personal portfolio for data analysts and BI professionals. Built with vanilla HTML, CSS, and JavaScript. Deployed free forever on GitHub Pages.

---

## ✨ Features

- **100% JSON-driven** — all content lives in `/data/*.json`. No coding required to update anything.
- **Premium dark/light design** — Manrope + Inter typography, animated hero, glassmorphism cards.
- **Fully responsive** — Desktop, tablet, and mobile ready.
- **SEO optimized** — Meta tags, Open Graph, Twitter Cards, JSON-LD structured data, sitemap.xml.
- **PWA ready** — Installable on mobile devices.
- **Contact form** — Formspree (free tier: 50 submissions/month).
- **Auto-calculated experience** — Total years update automatically from your start date.
- **Free forever** — GitHub Pages + GitHub Actions, zero cost, zero subscriptions.

---

## 📁 Project Structure

```
portfolio/
├── index.html              Main portfolio page
├── 404.html                Custom not-found page
├── robots.txt              Search engine instructions
├── sitemap.xml             SEO sitemap
├── manifest.json           PWA manifest
├── favicon.ico             Browser tab icon
├── .nojekyll               Tells GitHub Pages not to use Jekyll
├── LICENSE                 MIT License
├── README.md               This file
│
├── css/
│   └── style.css           All styles (27 sections, fully commented)
│
├── js/
│   └── main.js             All JavaScript (20 modules, fully commented)
│
├── data/                   ← EDIT THESE FILES TO UPDATE CONTENT
│   ├── personal.json       Name, bio, email, social links, SEO
│   ├── skills.json         Skill categories and proficiency levels
│   ├── experience.json     Work history (auto-calculates duration)
│   ├── projects.json       Project case studies
│   ├── certifications.json Certifications and badges
│   ├── education.json      Academic background
│   ├── achievements.json   Awards, competitions, publications
│   ├── testimonials.json   Colleague/client testimonials
│   ├── blog.json           Blog post links
│   ├── social.json         Social media profiles
│   ├── resume.json         Resume download links
│   └── settings.json       UI preferences (theme, speed, etc.)
│
├── assets/
│   ├── images/
│   │   ├── profile.jpg           ← Replace with your photo (400x400px)
│   │   ├── og-image.png          ← Replace with social share image (1200x630px)
│   │   ├── companies/            ← Company logos for experience section
│   │   ├── projects/             ← Project screenshots
│   │   ├── certs/                ← Certification badge images
│   │   ├── blog/                 ← Blog post thumbnails
│   │   └── testimonials/         ← Profile photos for testimonials
│   ├── icons/
│   │   └── favicon.svg
│   ├── fonts/                    (empty — fonts loaded from Google Fonts)
│   └── illustrations/            (empty — for future use)
│
├── certificates/           ← Add your certificate PDFs here
├── resume/                 ← Add your resume PDFs here
├── blog/                   (empty — for future internal blog posts)
│
└── .github/
    └── workflows/
        └── deploy.yml      Auto-deploys to GitHub Pages on every push
```

---

## 🚀 Quick Start — Deploy to GitHub Pages

### Step 1: Create a GitHub account
Go to [github.com](https://github.com) and sign up for free.

### Step 2: Create a new repository
1. Click the **+** icon → **New repository**
2. Name it `portfolio` (or any name you like)
3. Set it to **Public**
4. Click **Create repository**

### Step 3: Upload all files
1. On your repository page, click **uploading an existing file**
2. Drag and drop ALL files and folders from this ZIP
3. Click **Commit changes**

### Step 4: Enable GitHub Pages
1. Go to your repository → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save

### Step 5: Your site is live! 🎉
Your portfolio will be at:
```
https://YOUR_GITHUB_USERNAME.github.io/portfolio/
```

Every time you push changes, GitHub Actions automatically redeploys.

---

## ✏️ How to Edit Your Content

### Update personal info, bio, email, phone
Open `data/personal.json` and edit any field:
```json
{
  "name": "Your Full Name",
  "email": "you@email.com",
  "phone": "+1 (xxx) xxx-xxxx",
  "location": "Your City, Country"
}
```

### Add a new project
Open `data/projects.json` and add a new object to the `projects` array:
```json
{
  "id": "my-new-project",
  "featured": false,
  "emoji": "📊",
  "gradient": "linear-gradient(135deg,#6366F1,#8B5CF6)",
  "title": "My New Project",
  "category": ["Power BI", "SQL"],
  "summary": "Short description shown on the card.",
  "problem": "What business problem did you solve?",
  "solution": "How did you solve it?",
  "results": "What was the measurable outcome?",
  "kpis": [
    { "value": "30%", "label": "Improvement" }
  ],
  "tools": ["Power BI", "SQL", "Python"],
  "githubUrl": "https://github.com/yourname/project",
  "liveUrl": "",
  "order": 6
}
```

### Add a new certification
Open `data/certifications.json` and add to the `certifications` array:
```json
{
  "id": "new-cert",
  "emoji": "🏅",
  "title": "Certification Name",
  "issuer": "Issuing Organization",
  "description": "What this certification validates.",
  "issuedDate": "2024-06-01",
  "expiryDate": null,
  "credentialId": "CERT-ID-123",
  "verifyUrl": "https://verify.example.com",
  "tags": ["Tag1", "Tag2"],
  "order": 6
}
```

### Add work experience
Open `data/experience.json`. Set `"current": true` and `"endDate": null` for your current role:
```json
{
  "id": "my-company",
  "company": "Company Name",
  "logoFallback": "🏢",
  "role": "Your Role",
  "type": "Full-time",
  "location": "City, Country",
  "current": true,
  "startDate": "2023-01-01",
  "endDate": null,
  "description": "Overview of your role.",
  "responsibilities": ["What you did...", "Another responsibility..."],
  "achievements": ["Result you achieved...", "Another win..."],
  "technologies": ["Tool1", "Tool2"]
}
```

### Update social links
Open `data/social.json` and replace the URLs:
```json
{ "platform": "LinkedIn", "symbol": "in", "url": "https://linkedin.com/in/YOUR_USERNAME", "display": true }
```

---

## 🖼️ Replacing Images

### Profile photo
1. Prepare a square image (400×400px recommended)
2. Name it `profile.jpg`
3. Place it in `assets/images/`

### Company logos
1. Prepare a 80×80px PNG with transparent background
2. Name it something like `nexus.png`
3. Place it in `assets/images/companies/`
4. Update the `"logo"` field in `data/experience.json`

### Project screenshots
1. Prepare an 800×500px image
2. Place in `assets/images/projects/`
3. Update the `"thumbnail"` field in `data/projects.json`

---

## 📄 Updating Your Resume

1. Export your resume as a PDF
2. Name it exactly as specified in `data/resume.json` (e.g., `Alex_Morgan_Data_Analyst.pdf`)
3. Place it in the `resume/` folder
4. To add a new resume variant, add a new entry to `data/resume.json`

---

## 📬 Setting Up the Contact Form

The form uses **Formspree** (free, no backend needed):

1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form — you'll get an endpoint like `https://formspree.io/f/abcdefgh`
3. Open `data/personal.json` and replace:
   ```json
   "formspreeEndpoint": "https://formspree.io/f/YOUR_FORM_ID"
   ```
4. Form submissions will go directly to your email address

---

## 📊 Setting Up Google Analytics

1. Go to [analytics.google.com](https://analytics.google.com) and create a free GA4 property
2. Copy your **Measurement ID** (looks like `G-XXXXXXXXXX`)
3. Open `index.html` and find the commented-out Analytics block near the top
4. Uncomment it and replace `G-XXXXXXXXXX` with your real ID
5. In `data/personal.json`, update:
   ```json
   "analytics": { "googleAnalyticsId": "G-XXXXXXXXXX", "enabled": true }
   ```

---

## 🔧 Changing Site Settings

Open `data/settings.json`:

| Setting | What it does |
|---|---|
| `theme.defaultMode` | `"dark"` or `"light"` default theme |
| `hero.typingSpeedMs` | Speed of typing animation (lower = faster) |
| `testimonials.autoplayMs` | How long each testimonial shows (0 = no autoplay) |
| `experience.autoOpenFirst` | Auto-expand the first job card |

---

## 🌐 After Deployment — Important Updates

After your site is live, update these fields:

1. **`data/personal.json`** → `seo.siteUrl` → your real GitHub Pages URL
2. **`index.html`** → `<link rel="canonical">` → your real URL
3. **`sitemap.xml`** → `<loc>` → your real URL
4. **`robots.txt`** → Sitemap URL → your real URL

---

## 🎨 Changing Colors

Open `css/style.css` and find the `:root { }` block near the top. Change:
- `--accent: #6366F1` → your main brand color
- `--gold: #F59E0B` → secondary accent color

---

## 📱 Browser Support

| Browser | Support |
|---|---|
| Chrome | ✅ Full |
| Edge | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| Mobile Chrome | ✅ Full |
| Mobile Safari | ✅ Full |

---

## 🆓 Cost: Always Free

| Service | Cost | Limit |
|---|---|---|
| GitHub Pages | Free | Unlimited |
| GitHub Actions | Free | 2,000 min/month |
| Google Fonts | Free | Unlimited |
| Formspree | Free | 50 submissions/month |
| Google Analytics | Free | Unlimited |

---

## 📞 Need Help?

If you get stuck, check:
1. The browser console (F12 → Console) for error messages
2. That all JSON files are valid (use [jsonlint.com](https://jsonlint.com) to validate)
3. That file paths in JSON match actual file locations

---

*Built with ❤️ — deployed free on GitHub Pages*
