const { test, expect } = require("@playwright/test");
const LoginPage = require("../../pages/LoginPage");
const DashboardPage = require("../../pages/DashboardPage");

const {
  calculateBenefitsCost,
  calculateNetPay,
} = require("../../utils/calculations");

test.describe("Add Employee", () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login();
  });

  test("should add a new employee and display in the table", async ({
    page,
  }) => {
    const initialCount = await dashboardPage.getEmployeeCount();

    await dashboardPage.addEmployee("John", "Smith", 3);

    const newCount = await dashboardPage.getEmployeeCount();
    expect(newCount).toBeGreaterThan(initialCount);

    const employee = await dashboardPage.findEmployeeByName("John", "Smith");
    expect(employee).not.toBeNull();
    expect(employee.data.firstName.trim()).toBe("John");
    expect(employee.data.lastName.trim()).toBe("Smith");
    expect(employee.data.dependants).toBe(3);
  });

  test("should calculate correct benefits cost after adding employee", async ({
    page,
  }) => {
    const dependants = 3;
    await dashboardPage.addEmployee("Jane", "Doe", dependants);

    const employee = await dashboardPage.findEmployeeByName("Jane", "Doe");
    expect(employee).not.toBeNull();

    const expectedBenefitsCost = calculateBenefitsCost(dependants);
    const expectedNetPay = calculateNetPay(dependants);

    expect(employee.data.salary).toBe(52000.0);
    expect(employee.data.grossPay).toBe(2000.0);
    expect(employee.data.benefitsCost).toBe(expectedBenefitsCost);
    expect(employee.data.netPay).toBe(expectedNetPay);
  });
});
