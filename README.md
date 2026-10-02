# hoarau.re

Sites hosted under the `hoarau.re` domain, one folder per subdomain.

| Folder   | Subdomain          | Content                        |
|----------|--------------------|--------------------------------|
| `bruno/` | `bruno.hoarau.re`  | Online resume, single fixed page |

## bruno/

Online resume aimed at recruiters, presented as an ecommerce product page: each skill is a "variant" you select (visual, description, tools, clients, example, starting year).

### Files

- `index.html` :: structure, header, career and education
- `styles.css` :: layout, tokens in `:root`, automatic dark mode, responsive below 860px
- `app.js` :: skill list (`SKILLS`), selection, counter, email copy

To edit a skill: change the `SKILLS` array in `app.js`.

### Protected email address

The address never appears in plain text in the code: it is stored split and reversed (`MAILBOX` in `app.js`), shown only after a human interaction (mouse, touch, keyboard, scroll), and the `mailto:` link is built only on click. To change it, put the address reversed in `MAILBOX`, split at the at sign.

### Run locally

```bash
cd bruno && python3 -m http.server 8000
# → http://localhost:8000
```

## Deployment

A static nginx container serves the `bruno/` folder read-only, routed by Traefik on `bruno.hoarau.re` with a Let's Encrypt certificate. Deploying means copying the committed files of `bruno/` to the server; no build step, no restart.
