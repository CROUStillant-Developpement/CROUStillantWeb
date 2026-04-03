# Contributing to CROUStillant Web

Thank you for considering a contribution! This document explains how to get involved.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Branch Strategy](#branch-strategy)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Submitting a Pull Request](#submitting-a-pull-request)
- [Development Setup](#development-setup)
- [Commit Conventions](#commit-conventions)
- [Code Style](#code-style)
- [Questions](#questions)

---

## Code of Conduct

By participating in this project you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Stable production code — deploys to [croustillant.menu](https://croustillant.menu) |
| `develop` | Integration branch — deploys to [beta.croustillant.menu](https://beta.croustillant.menu) |

**Rules:**
- Never push directly to `main`.
- All work targets `develop`. Create your feature branch from `develop`.
- `main` is only updated via a merge from `develop` when releasing.

```
main
 └── develop
      ├── feature/my-feature
      ├── fix/some-bug
      └── chore/update-deps
```

---

## How to Contribute

### Reporting Bugs

1. Search [existing issues](../../issues) to avoid duplicates.
2. Open a new issue using the **Bug report** template.
3. Include: steps to reproduce, expected vs. actual behaviour, browser/OS, and screenshots if relevant.

### Suggesting Features

1. Search [existing issues](../../issues) and [discussions](../../discussions) first.
2. Open a new issue using the **Feature request** template.
3. Describe the problem you are solving and why it matters to users.

### Submitting a Pull Request

1. **Fork** the repository and clone your fork locally.
2. Create a branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```
3. Make your changes following the [code style](#code-style) guidelines.
4. Commit using the [commit conventions](#commit-conventions).
5. Push your branch and open a PR **targeting `develop`**.
6. Fill in the PR template — include a clear description, screenshots for UI changes, and link any related issues.
7. A maintainer will review and may request changes before merging.

> PRs that target `main` directly will be closed.

---

## Development Setup

```bash
# 1. Clone your fork
git clone https://github.com/<your-username>/CROUStillantWeb.git
cd CROUStillantWeb

# 2. Checkout develop
git checkout develop

# 3. Install dependencies
npm install

# 4. Configure environment
cp .env.example .env
# Edit .env — at minimum set API_URL

# 5. Start the dev server
npm run dev
```

See [README.md](README.md) for the full list of environment variables.

---

## Commit Conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>
```

Common types:

| Type | When to use |
|---|---|
| `feat` | New user-facing feature |
| `fix` | Bug fix |
| `chore` | Maintenance, dependency updates, config |
| `refactor` | Code change with no behaviour change |
| `style` | Formatting, whitespace (no logic change) |
| `docs` | Documentation only |
| `perf` | Performance improvement |
| `test` | Adding or fixing tests |

Examples:
```
feat(restaurants): add QR code sharing button
fix(skeleton): align card skeleton height with actual card
chore: update next to 16.2.1
docs: add installation guide to README
```

---

## Code Style

- **TypeScript** — use strict types; avoid `any`.
- **Tailwind CSS** — use utility classes directly; avoid custom CSS unless necessary.
- **Components** — prefer small, focused components. Client components (`"use client"`) only where interactivity is needed.
- **Naming** — `kebab-case` for files, `PascalCase` for components, `camelCase` for variables and functions.
- **Linting** — run `npm run lint` before committing. PRs that fail lint will not be merged.

---

## Questions

For general questions, open a [Discussion](../../discussions) or reach out at [croustillant@bayfield.dev](mailto:croustillant@bayfield.dev).

For security issues, see [SECURITY.md](SECURITY.md).
