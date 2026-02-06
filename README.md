# ☕ Job Hunt Dashboard

A beautiful, static front-end dashboard for tracking job applications using Google Sheets as the data source.

## Features

- 📊 **Dashboard Overview** - Real-time stats on applications, interviews, offers, and more
- 📈 **Visual Analytics** - Charts showing application trends and status distribution
- 🔍 **Advanced Filtering** - Search, filter by status, and flag stale applications
- 🎨 **Light & Dark Mode** - Beautiful coffee/chocolate themed UI with mode toggle
- 📄 **Resume Library** - Manage and track which resumes you're using
- ✉️ **Follow-Up Templates** - Quick access to email templates
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## Setup Instructions

### 1. Google Sheets Setup

1. **Make a copy of your spreadsheet** or use your existing one
2. Your spreadsheet should have these tabs (exact names):
   - `Applications`
   - `Resume Library`
   - `Follow-Up Templates`

3. **Make the sheet accessible**:
   - Click **Share** in the top-right
   - Change to **"Anyone with the link"** can **view**
   - Copy the Sheet ID from the URL:
     ```
     https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
                                            ^^^^^^^^^^^^^^^^^^
     ```

### 2. Google API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable **Google Sheets API**:
   - Click "Enable APIs and Services"
   - Search for "Google Sheets API"
   - Click "Enable"

4. Create an **API Key**:
   - Go to "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key
   - (Optional but recommended) Restrict the key to only Google Sheets API

### 3. Configure the Dashboard

1. Open `script.js`
2. Find the `CONFIG` object at the top:
   ```javascript
   const CONFIG = {
       API_KEY: 'YOUR_GOOGLE_API_KEY_HERE',
       SHEET_ID: 'YOUR_GOOGLE_SHEET_ID_HERE',
       
       TABS: {
           APPLICATIONS: 'Applications',
           RESUMES: 'Resume Library',
           TEMPLATES: 'Follow-Up Templates'
       }
   };
   ```
3. Replace `YOUR_GOOGLE_API_KEY_HERE` with your API key
4. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your Sheet ID
5. Make sure the tab names match your Google Sheet exactly

### 4. Deploy to GitHub Pages

1. **Create a new repository** on GitHub
2. **Upload these files**:
   - `index.html`
   - `styles.css`
   - `script.js`

3. **Enable GitHub Pages**:
   - Go to repository Settings
   - Navigate to "Pages" in the sidebar
   - Under "Source", select `main` branch
   - Click Save

4. Your dashboard will be live at:
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
   ```

## Expected Data Structure

### Applications Tab

Your Applications tab should have these columns (first row = headers):

**Required columns:**
- Company Name
- Job Title
- Application Status
- Date Applied

**Useful columns:**
- Location
- Job Type
- Industry
- Salary Range Low
- Salary Range High
- My Minimum Salary
- Resume Used
- Priority Score
- Weighted Priority Score
- Stale App Flag
- Days Since Applied
- Interview Stage
- General Notes

### Resume Library Tab

Columns:
- Resume ID
- Focus
- Version
- Last Updated
- File Link
- Notes

### Follow-Up Templates Tab

Columns:
- Template Name
- Use Case
- Email Body

## Usage Tips

### Stale Applications Flag

In your Google Sheet, you can use this formula in the "Stale App Flag" column:
```
=IF(AND(K2>=14,I2<>"Rejected",I2<>"Offer"),"STALE","")
```
This flags applications that are 14+ days old and not yet rejected or offered.

### Priority Score

The dashboard automatically calculates and displays priority scores. You can customize the formula in your sheet to match your criteria.

### Automatic Refresh

The dashboard fetches fresh data from your Google Sheet every time you:
- Load the page
- Click the refresh button
- Return to the tab after being away

## Customization

### Colors

Want to change the color scheme? Edit the CSS variables in `styles.css`:

```css
:root {
    --accent-primary: #6F4E37;  /* Main accent color */
    --accent-secondary: #A0826D; /* Secondary accent */
    /* ... more variables ... */
}
```

### Tab Names

If your Google Sheet uses different tab names, update them in `script.js`:

```javascript
TABS: {
    APPLICATIONS: 'Your Tab Name Here',
    RESUMES: 'Your Resume Tab Name',
    TEMPLATES: 'Your Templates Tab Name'
}
```

## Troubleshooting

### "Failed to load data" error

1. Check that your API key is correct
2. Make sure your Sheet ID is correct
3. Verify the sheet is shared as "Anyone with the link can view"
4. Check browser console (F12) for detailed error messages
5. Ensure Google Sheets API is enabled in your Google Cloud project

### No data showing

1. Check that your tab names match exactly (case-sensitive)
2. Make sure your first row contains headers
3. Verify you have at least one row of data with a Company Name

### Charts not rendering

1. Make sure you have dates in the "Date Applied" column
2. Check that Chart.js loaded (look in browser console)

## Privacy & Security

- Your API key is visible in the JavaScript - only enable Google Sheets API for this key
- Consider restricting the API key to your specific domain in Google Cloud Console
- The sheet should be view-only ("Anyone with link can view", not edit)
- No authentication = anyone with the URL can see your dashboard
- For private tracking, don't share the GitHub Pages URL publicly

## Future Enhancements

Possible additions:
- Export to CSV
- More chart types (funnel chart, timeline view)
- Animations on data updates
- Mobile app version
- Email integration for follow-ups

## Credits

Built with:
- Vanilla JavaScript (no frameworks!)
- [Chart.js](https://www.chartjs.org/) for charts
- Google Sheets API for data

---

Made with ☕ and determination. Good luck with your job hunt! 🚀
