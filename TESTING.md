This project now includes unit and functional tests.

Unit tests
- Tooling: Vitest + Testing Library (jsdom)
- Run:

```bash
pnpm install
pnpm test
```

Functional (E2E) tests
- Tooling: Playwright
- Start the dev server first (http://localhost:3000):

```bash
pnpm dev
```

Then run:

```bash
pnpm e2e
```

Notes:
- Playwright will run against localhost:3000 by default. Update the URL in `e2e/home.spec.ts` if needed.
- If using a CI, ensure playwright browsers are installed or add `npx playwright install --with-deps`.
