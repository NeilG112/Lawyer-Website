# Websites

Three static sites hosted from a single GitHub repository via GitHub Pages.

## Live URLs

Once deployed to GitHub Pages (`<user>.github.io/<repo-name>`):

- `https://<user>.github.io/<repo-name>/website-1/`
- `https://<user>.github.io/<repo-name>/website-2/`
- `https://<user>.github.io/<repo-name>/website-3/`

> The repo must **not** be named `<user>.github.io`, otherwise GitHub forces a single root site instead of supporting subdirectories.

## Deploy

1. Create a public repo on GitHub (any name other than `<user>.github.io`).
2. Push the contents of this folder.
3. **Settings → Pages → Build and deployment**: Branch `main`, Folder `/ (root)`.
4. Wait ~1 minute. The three sub-sites are live at the URLs above.

## Notes

- Folders use URL-safe slugs (`website-1`, `website-2`, `website-3`) — no `%20` in URLs.
- `.nojekyll` disables Jekyll processing so asset paths aren't rewritten.
- Optional: configure a custom domain with a `CNAME` file at the repo root for cleaner URLs.