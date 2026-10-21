# Putting the site online

The site is three files (`index.html`, `styles.css`, `script.js`) plus an `images/` folder. There is no build step: GitHub Pages serves them as they are.

## 1. Push to GitHub

If the repository is new and empty, run these in this folder (replace the URL with your repository's):

```bash
git init
git add index.html styles.css script.js DEPLOY.md images
git commit -m "Phren Lhantom site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

You don't need to upload the `design_handoff_phren_lhantom_site` folder; it was only the design reference.

No command line? On GitHub, open the repository, choose **Add file → Upload files**, and drag in `index.html`, `styles.css`, `script.js` and the `images` folder.

## 2. Turn on GitHub Pages

1. In the repository, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose branch **main** and folder **/ (root)**, then **Save**.
4. After a minute or two the address appears at the top of that page, usually `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

Every later push to `main` updates the live site automatically.

## 3. Set up the contact forms (Formspree)

GitHub Pages can't send email by itself, so the forms post to [Formspree](https://formspree.io).

The Contact & Commission form already uses the form ID `mjygnazv` (`https://formspree.io/f/mjygnazv` in `index.html`). Messages arrive with the subject "Website enquiry".

- To use a different form, replace `mjygnazv` in `index.html`.
- Send yourself a test message from the live site. Formspree may ask you to confirm the first submission.
- The free plan allows 50 submissions a month.

## 4. Fill in the real content

- **Instagram**: both links in `index.html` point to `https://www.instagram.com/lhantom_art/`.
- **About**: the text is in the `#about` section of `index.html`.
- **Paintings**: put the photos in `images/` as `01.jpg` to `09.jpg`. Then edit the list at the top of `script.js`: title, year, medium, size, and an `alt` description of each painting for screen-reader users. Each photo is shown at its own shape, so `ratio` only matters while a photo is missing.
  - Keep photos around 2000px on the long side and under about 500 KB each so the page loads quickly on phones.
  - To show more or fewer paintings, add or remove lines in that list.

## Previewing locally

Open `index.html` in a browser. Everything works except form sending, which only works once the Formspree ID is set.
