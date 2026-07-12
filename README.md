# Her V1 Complete Upgrade

This package upgrades the current Her workspace with:

1. AI memory built from the book, chapter summaries, characters, locations, world data, plot points, ideas and recent writing.
2. Five-result brainstorming with save, regenerate and combine.
3. Live suggestive writing after a completed sentence, plus manual Flow Starter.
4. Per-chapter Plot Point tracking.
5. AI continuity checking with saved and resolvable issues.
6. Autosave, cursor/session restore and local-device storage.
7. TXT export, full JSON backup and JSON restore.
8. Mobile/APK-friendly layout, touch targets, sticky toolbar and safe viewport behavior.
9. Google Play readiness checklist below.

## Replace these files

- `frontend/pages/workspace/workspace.html`
- `frontend/css/pages/workspace.css`
- `frontend/js/modules/ai/ai.js`
- `backend/routes/aiRoutes.js`

Adjust the paths if your folders use different names.

## Backend requirement

Your server must contain:

```js
app.use("/api/ai", require("./routes/aiRoutes"));
```

Your `.env` must contain:

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
```

Do not put the API key in frontend JavaScript.

## Important storage note

The workspace uses localStorage for the device-first V1. Full JSON backup lets a writer move data to another device manually. Cloud sync can be added later without replacing this system.

## Google Play publication checklist

- Set the production API URL in `ai.js` or define `window.HER_API_URL`.
- Run the web build and `npx cap sync android`.
- Create a signed Android App Bundle (`.aab`) in Android Studio.
- Use a permanent package ID, version code and version name.
- Add app icon, feature graphic and screenshots.
- Host Privacy Policy and Terms pages.
- Complete Play Console Data Safety disclosures.
- Test backup/restore, offline saves, keyboard behavior and AI error states.
- Upload the signed AAB to Internal Testing before Production.
