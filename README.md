# Paylocity Benefits Dashboard - Test Automation

UI and API tests using Playwright with JavaScript.

## Setup

1. Clone the repo and navigate to the project folder:
   ```bash
   git clone https://github.com/alanpelayoo/paylocity-benefits-tests.git
   cd paylocity-benefits-tests
   ```

2. Install dependencies:
   ```bash
   npm install
   npx playwright install chromium
   ```

3. Add your credentials in `utils/config.js`:
   ```
   username: "your_username"
   password: "your_password"
   authToken: "your_token"   (just the token, not "Basic ...")
   ```

## Running Tests

UI tests:
```bash
npx playwright test tests/ui/addEmployee.spec.js tests/ui/editEmployee.spec.js tests/ui/deleteEmployee.spec.js --project=ui-tests --workers=1 --headed
```

API tests:
```bash
npx playwright test tests/api/ --project=api-tests
```
## Bug Documentation
Can be found on bugs-documentation.pdf
