# Happy Birthday 🎉

A small, personal birthday website — countdown timer, photo memories, and a wall of messages from friends and family.

## Customize it

Everything personal lives in one file: [js/config.js](js/config.js).

- `name`, `tagline` — shown on the first screen
- `birthdayDate` — the countdown target (`YYYY-MM-DDTHH:mm:ss`, local time)
- `letter` — the personal note in the middle of the page
- `photos` — add real images to the `images/` folder, then set each `src` to `"images/yourfile.jpg"`. Leave `src` empty to keep the placeholder frame.
- `messages` — birthday messages from friends & family, shown on the wall
- `eggs` — the secret hunt: each secret's title and the hint shown in the basket (top-right)
- `cake`, `scratch`, `sealedPhoto`, `vault`, `match` — the text behind each secret, the vault code and the memory game

No other file needs to change for basic customization.

## The secret hunt

Eight secrets are hidden across the site. The letter stays sealed until all of them are found:

1. Tap the name five times quickly
2. Blow out every candle on the cake (tap, or blow into the mic)
3. Find the tiny egg beside the cake plate
4. Open the "do not open" card in the gallery (three taps)
5. Scratch off the gold card
6. Crack the vault (code in `config.js`)
7. Catch ten falling petals
8. Match every pair in the memory game just before the letter

Bonus, not counted: the Konami code (↑↑↓↓←→←→BA) on a keyboard.

Progress is saved in the browser. After testing it yourself, open the site with `?reset` on the end of the URL (or use "Hide them all again" in the basket) so she starts fresh.

## Run it locally

Just open `index.html` in a browser — no build step, no server required.

## Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `bday`) and push this folder to it:
   ```
   git init
   git add .
   git commit -m "Birthday site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. On GitHub, go to the repo's **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. Save — GitHub will give you a URL like `https://<your-username>.github.io/<repo-name>/` within a minute or two.

That's it — share the link with your friend.
