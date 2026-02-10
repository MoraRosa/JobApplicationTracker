# ☕ Job Hunt Dashboard

A beautiful, coffee-themed job application tracker built with vanilla JavaScript, Google Sheets API, and Chart.js. Track your applications, interviews, and offers with real-time statistics, charts, and insights.

🔗 **[Live Demo](https://morarosa.github.io/JobApplicationTracker/)** | 📊 [Features](#-features) | 🛠️ [Setup](#️-setup-instructions)

![Status](https://img.shields.io/badge/Status-Production-success)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow)
![GitHub Pages](https://img.shields.io/badge/Hosted-GitHub%20Pages-blue)

## ✨ Features

### 📊 **Real-Time Analytics**
- **7 Interactive Charts**: Timeline, Status Distribution, Application Funnel, Response Rate, Interview Success, Offer Conversion, Response Time
- **Date Range Filters**: Last 7/30/90 days, This Year, All Time, Custom Range
- **Live Stats Cards**: Total Applications, Applied, Interviews, Offers, Rejected, Stale Apps

### 🎯 **Application Management**
- **Advanced Filtering**: Search by company/role/location, filter by status, sort A-Z/date/priority
- **Pagination**: 25/50/100/Show All options
- **Status Tracking**: Applied, Not Applied, Recruiter Screen, Interview #1/#2, Offer, Rejected, Ghosted, Ad Closed
- **Detailed Modal View**: Click any application for full details including salary, links, materials, notes

### 📧 **Email Integration**
- **One-Click Follow-Ups**: Send follow-up emails with auto-filled templates
- **Template Variables**: Automatically replaces {{Name}}, {{Role}}, {{Company}} placeholders
- **Multiple Templates**: Manage follow-up templates in Google Sheets

### ⌨️ **Keyboard Shortcuts**
- `↑/↓` - Navigate table rows
- `Enter` - Open selected application
- `Escape` - Close modal / Clear focus
- `/` - Focus search box
- `Ctrl/Cmd + R` - Refresh data
- `?` - Show keyboard shortcuts help

### 🎨 **Theming**
- **Light Mode**: Coffee & Cream aesthetic
- **Dark Mode**: Espresso & Mocha aesthetic
- **Custom Scrollbars**: Theme-matched design
- **Responsive Design**: Mobile-optimized layouts

### 🚀 **Performance**
- **No Backend Required**: Pure client-side JavaScript
- **Modular Architecture**: 10 JS files + 11 CSS files for maintainability
- **Custom Notifications**: Toast alerts and modals (no browser alerts)
- **GitHub Pages Ready**: Deploy in minutes

---

## 🛠️ Setup Instructions

### Prerequisites
- A Google account
- A GitHub account (for hosting)
- A modern web browser

### Step 1: Create Your Google Sheet

#### Option A: Start from Template (Recommended)
1. Download the included `Spreadsheet.xlsx` from this repository
2. Go to [Google Sheets](https://sheets.google.com)
3. Click **File → Import**
4. Upload the Excel file
5. **IMPORTANT**: Click **File → Make a copy** (this converts it to a native Google Sheet)
6. Rename your copy to something like "Job Applications 2026"

#### Option B: Create from Scratch
1. Create a new Google Sheet with these tabs:
   - **Applications** (main data)
   - **Resume Library** (your resumes)
   - **Follow-Up Templates** (email templates)
   - **Dashboard** (optional: your manual charts/notes)
   - **Links** (optional: useful job search links)

2. **Applications Tab** - Minimum Required Columns:
   ```
   Company Name | Job Title | Location | Job Type | Industry | 
   Job Posting Link | LinkedIn Job Link | Company Website | 
   Application Status | Date Applied | Resume Used | Cover Letter Used |
   Salary Range Low | Salary Range High | My Minimum Salary |
   Recruiter Name | Recruiter Email | Interview Stage | 
   Priority Score | Stale App Flag | General Notes
   ```

3. **Resume Library Tab**:
   ```
   Resume Name | Version | Tailored For | Resume Link | Notes
   ```

4. **Follow-Up Templates Tab**:
   ```
   Template Name | Subject Line | Email Body
   ```
   - Use placeholders: `{{Name}}`, `{{Role}}`, `{{Company}}`

#### ⚠️ CRITICAL: Excel Files Won't Work!
If you upload an Excel file to Google Drive and open it, it's still an **Excel file** - the API can't read it!

**How to verify you have a real Google Sheet:**
1. Open your file in Google Sheets
2. Check the URL - it should be: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`
3. If the URL contains `/file/d/` or ends in `.xlsx`, it's still Excel!
4. **Solution**: File → Make a copy → This creates a true Google Sheet

### Step 2: Get Your Sheet ID

1. Open your Google Sheet
2. Copy the ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[THIS_IS_YOUR_SHEET_ID]/edit
   ```
3. Save this ID - you'll need it later

### Step 3: Make Your Sheet Public (Read-Only)

1. Click the **Share** button (top right)
2. Click **Change to anyone with the link**
3. Set permission to **Viewer** (not Editor!)
4. Click **Done**

**Security Note**: This makes your sheet readable by anyone with the link. Don't include sensitive data like SSNs, passwords, etc.

### Step 4: Create a Google Cloud Project & API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project:
   - Click the project dropdown (top left)
   - Click **New Project**
   - Name it "Job Dashboard" or similar
   - Click **Create**

3. Enable the Google Sheets API:
   - In the left sidebar, go to **APIs & Services → Library**
   - Search for "Google Sheets API"
   - Click on it and click **Enable**

4. Create an API Key:
   - Go to **APIs & Services → Credentials**
   - Click **+ Create Credentials → API Key**
   - Copy your API key immediately (you'll need it soon)

5. **IMPORTANT: Restrict Your API Key** (Security!)
   - Click on your newly created API key
   - Under **API restrictions**:
     - Select **Restrict key**
     - Check **Google Sheets API** ONLY
   - Under **Website restrictions** (optional but recommended):
     - Select **HTTP referrers**
     - Add: `https://YOUR-USERNAME.github.io/*`
   - Click **Save**

### Step 5: Configure the Dashboard

1. Clone or download this repository
2. Open `js/config.js`
3. Update these two lines:
   ```javascript
   API_KEY: 'YOUR_API_KEY_HERE',
   SHEET_ID: 'YOUR_SHEET_ID_HERE',
   ```
4. Save the file

### Step 6: Deploy to GitHub Pages

1. Create a new repository on GitHub:
   - Go to [github.com/new](https://github.com/new)
   - Name it something like `JobApplicationTracker`
   - Make it **Public** (required for GitHub Pages)
   - Click **Create repository**

2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Job Dashboard"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/JobApplicationTracker.git
   git push -u origin main
   ```

3. Enable GitHub Pages:
   - Go to your repository → **Settings**
   - Click **Pages** (left sidebar)
   - Under **Source**, select **main** branch
   - Click **Save**
   - Your site will be live at: `https://YOUR-USERNAME.github.io/JobApplicationTracker/`

4. Wait 2-5 minutes for deployment, then visit your URL!

---

## 📁 Project Structure

```
JobApplicationTracker/
├── index.html                          # Main HTML file
├── Job_Application_Tracker_Template.xlsx  # Template spreadsheet
│
├── css/                                # Modular CSS (11 files)
│   ├── variables.css                   # Theme colors & CSS variables
│   ├── base.css                        # Reset & scrollbar styles
│   ├── layout.css                      # Header, container, loading
│   ├── components.css                  # Stats cards, buttons
│   ├── charts.css                      # Chart containers, date filters
│   ├── tabs.css                        # Tab navigation, table controls
│   ├── tables.css                      # Tables, pagination, badges
│   ├── grids.css                       # Resume & template grids
│   ├── modals.css                      # Modals, toasts, details
│   ├── responsive.css                  # Mobile optimization
│   └── utilities.css                   # Helper classes
│
└── js/                                 # Modular JavaScript (10 files)
    ├── config.js                       # API keys & configuration
    ├── utils.js                        # Helper functions
    ├── state.js                        # Data storage & stats
    ├── api.js                          # Google Sheets API calls
    ├── charts.js                       # Chart.js rendering
    ├── tables.js                       # Table & modal rendering
    ├── filters.js                      # Search, sort, pagination
    ├── keyboard.js                     # Keyboard shortcuts
    ├── ui.js                           # Custom modals & toasts
    └── main.js                         # App initialization
```

---

## 🎨 Customization

### Changing the Color Theme

Edit `css/variables.css` to customize colors:

```css
:root {
    /* Light Mode */
    --accent-primary: #6F4E37;    /* Coffee brown */
    --accent-secondary: #A0826D;  /* Lighter brown */
    --success: #4A7C59;           /* Green for offers */
    --warning: #D4A574;           /* Yellow for pending */
    --error: #ff0000;             /* Red for rejected */
    --info: #6F8FAF;              /* Blue for applied */
}
```

### Adding New Status Types

1. Add the status to your Google Sheet's **Application Status** column
2. Add a CSS class in `css/tables.css`:
   ```css
   .status-your-new-status {
       background: #YOUR_COLOR;
       color: white;
   }
   ```

### Modifying Charts

Edit `js/charts.js` to add/remove charts or change configurations.

---

## 🔧 Troubleshooting

### Dashboard Shows "Failed to load data"

**Check these in order:**

1. **Is your API key correct?**
   - Open `js/config.js` and verify your API key
   - Try creating a fresh API key

2. **Is your Sheet ID correct?**
   - Copy it again from the URL
   - Make sure there are no extra characters

3. **Is your sheet public?**
   - Open your Google Sheet
   - Click Share → Make sure it says "Anyone with the link can view"

4. **Is the API enabled?**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to **APIs & Services → Enabled APIs**
   - Confirm "Google Sheets API" is listed

5. **Are you using a real Google Sheet?**
   - Excel files won't work even if opened in Google Drive
   - Check the URL - it should be `docs.google.com/spreadsheets`
   - If needed: File → Make a copy

6. **Check browser console:**
   - Press F12 → Console tab
   - Look for error messages (often shows exactly what's wrong)

### Salary Shows "-" Instead of Amount

- Your Google Sheet may be formatting numbers as currency strings
- The dashboard handles this automatically
- If still not working, check that column headers are exactly:
  - `Salary Range Low`
  - `Salary Range High`
  - `My Minimum Salary`

### Buttons (Job Posting, LinkedIn, Company Site) Don't Appear

- Make sure you have **actual URLs** in those columns, not just text
- They must start with `http://` or `https://`
- Google Sheets hyperlinks with custom text won't work (API only sees the text)
- Use full URLs: `https://linkedin.com/jobs/view/12345`

### Charts Not Updating with Date Filter

- This is normal for "Total Applications" - it always shows ALL companies
- Other stats (Applied, Interviews, Offers) update based on date range
- This is by design so you can track your complete pipeline

### Refresh Button Shows Error

- Fixed in current version
- Make sure you're using the latest `js/main.js`

---

## 📊 Status Badge Colors

| Status | Color | Visual |
|--------|-------|--------|
| Applied | Blue | Standard application submitted |
| Not Applied | Orange | Job saved, not applied yet |
| Recruiter Screen | Light Orange | Initial contact made |
| Interview #1 | Yellow | First round interview |
| Interview #2 | Dark Yellow | Advanced interview stage |
| Offer | Green | Offer received! 🎉 |
| Rejected | Red | Not selected |
| Ghosted | Gray | No response received |
| Ad Closed | Light Gray | Posting closed/expired |

---

## 🤝 Contributing

Found a bug? Have a feature idea? Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Chart.js** - Beautiful, responsive charts
- **Font Awesome** - Icon library
- **Google Sheets API** - Backend data storage
- **GitHub Pages** - Free hosting

---

## 💡 Tips for Job Hunting

### Using the Dashboard Effectively

1. **Update Daily**: Add new applications as you submit them
2. **Follow Up**: Use the email integration after 1-2 weeks
3. **Track Patterns**: Use charts to see which companies respond faster
4. **Prioritize**: Use the Priority Score to focus on top opportunities
5. **Stay Organized**: Use templates for consistent follow-ups

### Data Privacy

- Your data lives in **your Google Sheet** - you have full control
- The dashboard is **client-side only** - no data sent to external servers
- Your API key only allows **reading** your sheet (not editing)
- Consider using a separate Google account for job hunting

---

## 📬 Support

Having issues? Here's how to get help:

1. Check the **Troubleshooting** section above
2. Review the browser console (F12) for error messages
3. Open an issue on GitHub with:
   - Browser and version
   - Error message (screenshot or text)
   - What you've already tried

---

## 🚀 Future Features (Roadmap)

Potential additions (contributions welcome!):
- [ ] Calendar view of interviews
- [ ] Salary analytics and comparisons
- [ ] Company notes and ratings
- [ ] Interview question bank
- [ ] Offer comparison tool
- [ ] Mobile app version
- [ ] Browser extension

---

**Built with ☕ and determination. Happy job hunting!**

---

*Last Updated: February 2026*
