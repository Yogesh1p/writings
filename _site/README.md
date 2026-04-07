# Yogesh — Writing Site

A minimal static site for essays. No build step required for writing.

## Structure

```
yogesh-writing/
├── index.html          ← Browse page (search, filter, sort)
├── about.html          ← About page
├── data/
│   └── articles.js     ← Hand-edit this to add/update articles
├── articles/
│   ├── _template.html  ← Copy this to start a new article
│   └── *.html          ← Your article files
├── css/
│   ├── base.css        ← Global: variables, nav, TOC, typography
│   └── articles.css    ← Article-specific: reading layout, math boxes
├── js/
│   ├── base.js         ← Reading progress bar
│   ├── components.js   ← Nav injection, theme toggle, mobile drawer
│   └── article_components.js ← Article header injection, TOC, progress save
└── assets/
    └── favicon.svg
```

## Adding a new article

1. Copy `articles/_template.html` → `articles/your-slug.html`
2. Edit the `<meta>` tags at the top (title, description, category, date, keywords, reading_time)
3. Write your content inside `<section class="article-body">`
4. Open `data/articles.js` and add a new entry pointing to your file
5. Done — no build step needed

## Deploying to GitHub Pages

1. Push this folder as a GitHub repo
2. Go to Settings → Pages → Source: `main` branch, root `/`
3. Your site will be live at `https://username.github.io/repo-name/`

## Theme

Light/dark toggle is in the nav. Theme persists via `localStorage`.
Colors are CSS variables in `css/base.css` — edit `--accent`, `--bg`, `--text` etc to retheme.
