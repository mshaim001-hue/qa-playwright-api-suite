# QA Playwright API Suite

[![CI](https://github.com/mshaim001-hue/qa-playwright-api-suite/actions/workflows/ci.yml/badge.svg)](https://github.com/mshaim001-hue/qa-playwright-api-suite/actions/workflows/ci.yml)

Portfolio suite for **Maxat Shaimardinov**, aimed at QA Automation Engineer roles (JavaScript/TypeScript, API and web). It is a small, real Playwright project: UI tests against [Swag Labs](https://www.saucedemo.com) and API tests against [Restful-Booker](https://restful-booker.herokuapp.com). Both targets are public demos. I do not operate them, and the credentials in this repo are the ones those demos publish.

31 tests, all tagged `@regression`. Five of them are also `@smoke`.

## Stack

- Node.js 22 (see `.node-version`) and npm. `package-lock.json` is committed.
- TypeScript in strict mode, including `noUncheckedIndexedAccess`.
- Playwright Test, two projects: `ui` (Chromium) and `api` (`APIRequestContext`).
- Zod schemas for the booking and auth responses.
- ESLint (typescript-eslint strict type-checked rules, plus `eslint-plugin-playwright`) and Prettier.
- Playwright HTML reporter and Allure (`allure-playwright` writes results; Allure 2 renders them).
- GitHub Actions.

## Structure

```
.
├── .github/workflows/ci.yml
├── eslint.config.mjs
├── playwright.config.ts
├── src
│   ├── api
│   │   ├── builders/bookingBuilder.ts
│   │   ├── client/          BookerClient, JSON reader, schema parser
│   │   ├── data/credentials.ts
│   │   ├── fixtures/test.ts
│   │   ├── schemas/booking.ts
│   │   └── support/createTrackedBooking.ts
│   ├── config/              base URLs and Allure results cleanup
│   └── ui
│       ├── data/            demo users, products, sort values
│       ├── domain/checkoutTotals.ts
│       ├── fixtures/test.ts
│       └── pages/           login, inventory, cart, checkout
└── tests
    ├── api/                 auth, booking CRUD, negative cases
    └── ui/                  login, sorting, cart, checkout
```

## Run locally

```bash
npm ci
npx playwright install --with-deps chromium
npm test
```

`npm test` only runs Playwright. Lint and types are separate commands, and CI runs all of them:

```bash
npm run lint
npm run typecheck
npm run format:check
```

API tests do not open a page. UI tests need Chromium. There is no `.env` and no secret. Swag Labs users and the Restful-Booker admin account are hardcoded because they are public demo accounts.

### By tag or project

```bash
npm run test:smoke        # 5 tests
npm run test:regression   # all 31
npm run test:ui
npm run test:api
```

Every test carries `@regression`. The smoke subset also carries `@smoke`, so regression is the full suite and smoke is the short path: sign in, add to cart, check out, get a token, create a booking and read it back.

### Reports

Each run deletes `allure-results` first, then writes a fresh set. Traces and videos are kept with `retain-on-failure`. Screenshots use `only-on-failure`. Retries are 0 locally and 2 when `CI` is set. GitHub Actions sets `CI` for you.

Playwright HTML report, no extra tools:

```bash
npm run report
```

Allure needs a local Java 17+ runtime (the CLI is the `allure-commandline` dev dependency):

```bash
npm run allure:generate
npm run allure:open
```

The tests themselves do not need Java. `allure-playwright` only writes result files.

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on pull requests and on pushes to `main`:

1. `npm ci`
2. Install Chromium
3. `npm run lint`, `npm run typecheck`, `npm run format:check`, `npm test`
4. Upload the Playwright HTML report and the Allure results as artifacts (including when tests fail)

A second job runs only on a push to `main`. It renders the Allure report and deploys it to GitHub Pages:

https://mshaim001-hue.github.io/qa-playwright-api-suite/

### The one Pages setting

That deploy needs **Settings → Pages → Build and deployment → Source → GitHub Actions**. The source is already set that way, which is why the report above is live. A workflow cannot turn the setting on. If it is changed, the publish job still runs on `main`, sees that Pages is not using GitHub Actions, and skips the deploy. The test job stays the status check and still uploads both artifacts. Pull requests do not deploy.

## Coverage

This is scenario coverage, not line coverage. The suite is black-box against two demos, so there is no application-code percentage to report.

| Area      | Scenario                                                                 | Project | Tags              |
| --------- | ------------------------------------------------------------------------ | ------- | ----------------- |
| Login     | Standard user reaches the inventory                                      | ui      | smoke, regression |
| Login     | Locked-out user sees the lockout error                                   | ui      | regression        |
| Login     | Unknown credentials are rejected                                         | ui      | regression        |
| Login     | Empty username                                                           | ui      | regression        |
| Login     | Empty password                                                           | ui      | regression        |
| Inventory | Default order is name A to Z                                             | ui      | regression        |
| Inventory | Sort name Z to A                                                         | ui      | regression        |
| Inventory | Sort name back to A to Z                                                 | ui      | regression        |
| Inventory | Sort price low to high                                                   | ui      | regression        |
| Inventory | Sort price high to low                                                   | ui      | regression        |
| Cart      | Add a backpack, badge is 1, cart shows it                                | ui      | smoke, regression |
| Cart      | Add two products, badge is 2                                             | ui      | regression        |
| Cart      | Remove from the inventory card                                           | ui      | regression        |
| Cart      | Remove from the cart page                                                | ui      | regression        |
| Checkout  | One item, tax, total, thank-you page                                     | ui      | smoke, regression |
| Checkout  | Missing first name                                                       | ui      | regression        |
| Checkout  | Missing last name                                                        | ui      | regression        |
| Checkout  | Missing postal code                                                      | ui      | regression        |
| Auth      | Demo admin receives a token                                              | api     | smoke, regression |
| Auth      | Wrong password returns the documented reason                             | api     | regression        |
| Bookings  | Create and GET the same booking                                          | api     | smoke, regression |
| Bookings  | PUT replaces the booking                                                 | api     | regression        |
| Bookings  | PATCH changes one field                                                  | api     | regression        |
| Bookings  | DELETE, then GET is 404                                                  | api     | regression        |
| Bookings  | Booking id list matches the schema                                       | api     | regression        |
| Bookings  | Unknown id is 404                                                        | api     | regression        |
| Bookings  | PUT with no token is 403                                                 | api     | regression        |
| Bookings  | PUT with a bad token is 403                                              | api     | regression        |
| Bookings  | DELETE with no token is 403                                              | api     | regression        |
| Bookings  | Partial payload is 500                                                   | api     | regression        |
| Bookings  | PUT without `Accept: application/json` is 418, and the write still lands | api     | regression        |

Authenticated UI flows use `standard_user` only. `performance_glitch_user` and `problem_user` are left out on purpose: those accounts slow the app down or break sorting, so they would not tell me whether the suite is correct.

## Design decisions

**Page objects and fixtures.** Pages own locators and actions. Specs own assertions. A `standardUserOnInventory` fixture signs in and waits until product names are on the page, so cart, sort, and checkout tests do not repeat the login. Login tests do not use that fixture.

**Locators.** `getByRole` for the sort combobox (`Sort products`) and for Add to cart / Remove. `getByTestId` for the app's `data-test` hooks (`testIdAttribute` is `data-test`). Several Swag Labs controls are inputs with a placeholder and no better accessible name, so the test id is the stable handle. No `waitForTimeout`, no `networkidle`.

**Sort assertions wait.** Choosing a sort option re-renders the list. The tests read the current names or prices, compute the expected order, then `expect.poll` until the list matches. That is a retrying assertion, not a sleep. Name order uses `localeCompare`, which is what the app uses. Price order compares the numbers, so the two items that cost the same do not make the assertion depend on which one is first.

**Checkout total.** The overview test reads the backpack price from the cart and applies Swag Labs' own rule: tax is 8% of the item total, rounded to cents, then added. The expected strings are `Item total`, `Tax`, and `Total`. The catalog price is not hardcoded.

**API client and builder.** `BookerClient` is the only place that knows paths and headers. Auth is a `token` cookie, not a Bearer header. `buildBooking` fills a valid booking and takes overrides, with a random last name so parallel tests do not share a name. A fixture records created ids and deletes them afterwards.

**Contracts.** Zod parses auth, booking, and booking-id responses. A failed parse throws the schema message into the test error. Status codes and a few exact strings (`Bad credentials`, `Forbidden`, `I'm a Teapot`) are asserted as well, because the schema does not capture the odd HTTP behavior below.

### Observed Restful-Booker contract

I checked these responses before writing the assertions. They are the service's behavior, including where it disagrees with ordinary HTTP.

| Call                                                   | What comes back                                      |
| ------------------------------------------------------ | ---------------------------------------------------- |
| `POST /auth` with the demo admin                       | 200 and `{ token }`                                  |
| `POST /auth` with a wrong password                     | 200 and `{ reason: "Bad credentials" }`, not 401     |
| `PUT` or `DELETE` with no token or a bad token         | 403                                                  |
| `GET /booking/{id}` for an unknown id, or after delete | 404                                                  |
| `POST /booking` missing required fields                | 500 `Internal Server Error`, not 400                 |
| `PUT` with `Accept: text/html`                         | 418 `I'm a Teapot`, and the new body is still stored |
| `DELETE` of an id that was just deleted                | 405                                                  |

There is no 401 test. I did not see a 401 from this API, and asserting one would be a lie. 403 is the real unauthorized response. Cleanup accepts 201, 404, and 405 so a test that already deleted its booking does not fail a second time.

Restful-Booker stayed fast when I called it (auth and CRUD well under a second) and, unlike a mock that only echoes JSON, a created booking can be read back. That is why it is the API target. It is still a shared Heroku demo: other people write to it, and a cold dyno can be slow. The two CI retries exist for that. Locally, retries stay at 0.

## What I'd add next

- A private API I can reset, so bookings are not shared with the internet and cleanup is not best-effort.
- `storageState` for the UI once there are more authenticated tests than a single login per test is worth.
- `@axe-core/playwright` on the inventory and checkout pages.
- `--fail-on-flaky-tests` once the target is not a public demo. Right now a retried pass on CI is still a pass, on purpose.
- Schemas generated from an OpenAPI document if the API ever published one. Restful-Booker does not, so the Zod schemas are hand-written from the responses I observed.
