class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator("#Username");
    this.passwordInput = page.locator("#Password");
    this.loginButton = page.locator('button[type="submit"]');
  }

  async navigate() {
    const config = require("../utils/config");
    await this.page.goto(config.loginURL);
  }

  async login(username, password) {
    const config = require("../utils/config");
    const user = username || config.username;
    const pass = password || config.password;
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
    await this.page.waitForURL("**/Benefits");
  }
}

module.exports = LoginPage;
