# Setting up the knee exercise apps

This takes about 20 minutes, one time. Everything is free.

---

## Step 1 — Make the progress sheet (Google Sheets)

1. Go to **sheets.new** while signed in to your Google account. Name it **Knee exercise log**.
2. In the menu, choose **Extensions → Apps Script**.
3. Delete the code that's there. Open `google-sheet-script.gs` (in this folder), copy all of it, and paste it in.
4. Click the **Save** icon (💾).
5. Click **Deploy → New deployment**.
   - Click the gear next to "Select type" → **Web app**.
   - **Execute as:** Me
   - **Who has access:** Anyone
   - Click **Deploy**.
6. Google will ask you to authorize. Choose your account. You'll see *"Google hasn't verified this app"* — that's expected, since it's your own script. Click **Advanced → Go to (project name) (unsafe) → Allow**.
7. Copy the **Web app URL** (it starts with `https://script.google.com/macros/s/...`).
8. **Send that URL to Claude**, and Claude will put it into the app. (Or paste it yourself between the quotes in `docs/config.js`.)

A tab named **Daily** appears in the sheet the first time one of the kids checks something off. One row per kid per day:
done / total, % done, knee pain, and which exercises are still not done.

---

## Step 2 — Put the app online (GitHub Pages)

1. Make a free account at **github.com** (skip if you have one).
2. Click **+ → New repository**.
   - Name: `knee`
   - Choose **Public** (free GitHub Pages needs a public repository)
   - Leave everything else empty (no README, no .gitignore, no license)
   - Click **Create repository**.
3. Copy the repository address shown (like `https://github.com/YOUR-GITHUB-NAME/knee.git`) and **send it to Claude**.
   Claude pushes the app to it with Git. A GitHub sign-in window may pop up the first time — sign in there.
4. Go to **Settings → Pages**. Under "Branch," choose **main** and **/docs**, then **Save**.
5. Wait 1–2 minutes. Your links will be:
   - Mateo: `https://YOUR-GITHUB-NAME.github.io/knee/mateo/`
   - Kristen: `https://YOUR-GITHUB-NAME.github.io/knee/kristen/`

---

## Step 3 — Put it on each phone

On each kid's iPhone:

1. Open their link in **Safari** (not Chrome).
2. Tap the **Share** button (square with an up arrow) → **Add to Home Screen** → **Add**.
3. Open it from the home screen icon from now on. Their checkmarks are saved on their phone.

**Daily reminder:** web apps can't send their own reminders without a paid server, so use the iPhone's built-in **Reminders** app:
new reminder "Knee exercises" → turn on **Date** and **Time** → **Repeat: Daily**. Add a second one for the evening stretches.

**Beeps:** the timer beeps only when the ringer switch on the side of the phone is ON.

---

## Updating the exercises later

Tell Claude what changed (or send the new sheet). Claude updates the files and pushes them to GitHub.
The kids' apps pick up the change the next time they open them with internet.

The app's files live in the `docs` folder (that's what GitHub Pages serves).

---

## Good to know

- The GitHub page is public: anyone with the link could see the exercise lists and the kids' first names. Nothing else is on it.
- The Google Sheet is private to you. The app can only *add* rows to it; nobody can read it through the app.
