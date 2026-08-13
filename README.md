# PlayNova

A lightweight static gaming portal starter.

## Run locally
Use a local web server because `fetch()` cannot reliably load `data/games.json` from `file://`.
For example, with Python:
`python -m http.server 8000`
Then open `http://localhost:8000/`.

## Add your games
Edit `data/games.json`.
Use thumbnails and game URLs/assets that you are authorized to use or embed.

## GitHub Pages
1. Create a GitHub repository named `playnova`.
2. Upload all files/folders from this project.
3. Repository Settings → Pages → Deploy from branch → `main` → `/root`.
4. Replace `YOUR-USERNAME` in `robots.txt` and `sitemap.xml` with your GitHub username.
5. Your site will be available at `https://YOUR-USERNAME.github.io/playnova/`.

Do not copy games, images, branding, or code from third-party sites without permission.
