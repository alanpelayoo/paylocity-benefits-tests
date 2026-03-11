const { test, expect } = require("@playwright/test");
const LoginPage = require("../../pages/LoginPage");
const DashboardPage = require("../../pages/DashboardPage");

test.describe("Delete Employee", () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login();

    // Add an employee to delete
    await dashboardPage.addEmployee("Delete", "Test", 1);
  });

  test("should delete an employee and remove from the table", async ({
    page,
  }) => {
    const employee = await dashboardPage.findEmployeeByName("Delete", "Test");
    expect(employee).not.toBeNull();

    const initialCount = await dashboardPage.getEmployeeCount();

    await dashboardPage.deleteEmployee(employee.index);
    await page.waitForTimeout(1000);   

    const newCount = await dashboardPage.getEmployeeCount();
    expect(newCount).toBe(initialCount - 1);

    const deletedEmployee = await dashboardPage.findEmployeeByName(
      "Delete",
      "Test"
    );
    expect(deletedEmployee).toBeNull();
  });

});
