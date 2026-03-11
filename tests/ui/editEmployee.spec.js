const { test, expect } = require("@playwright/test");
const LoginPage = require("../../pages/LoginPage");
const DashboardPage = require("../../pages/DashboardPage");
const {
  calculateBenefitsCost,
  calculateNetPay,
} = require("../../utils/calculations");

test.describe("Edit Employee", () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
    await loginPage.login();

    // Add an employee to edit
    await dashboardPage.addEmployee("Edit", "Test", 2);
  });

  test("should update employee details and reflect changes in the table", async ({
    page,
  }) => {
    const employee = await dashboardPage.findEmployeeByName("Edit", "Test");
    expect(employee).not.toBeNull();

    await dashboardPage.editEmployee(
      employee.index,
      "Updated",
      "Name",
      4
    );

    const updatedEmployee = await dashboardPage.findEmployeeByName(
      "Updated",
      "Name"
    );
    expect(updatedEmployee).not.toBeNull();
    expect(updatedEmployee.data.firstName.trim()).toBe("Updated");
    expect(updatedEmployee.data.lastName.trim()).toBe("Name");
    expect(updatedEmployee.data.dependants).toBe(4);
  });

  test("should recalculate benefits cost correctly after editing dependants", async ({
    page,
  }) => {
    const employee = await dashboardPage.findEmployeeByName("Edit", "Test");
    expect(employee).not.toBeNull();

    const newDependants = 5;
    await dashboardPage.editEmployee(
      employee.index,
      "Edit",
      "Test",
      newDependants
    );

    const updatedEmployee = await dashboardPage.findEmployeeByName(
      "Edit",
      "Test"
    );
    expect(updatedEmployee).not.toBeNull();

    const expectedBenefitsCost = calculateBenefitsCost(newDependants);
    const expectedNetPay = calculateNetPay(newDependants);

    expect(updatedEmployee.data.salary).toBe(52000.0);
    expect(updatedEmployee.data.grossPay).toBe(2000.0);
    expect(updatedEmployee.data.benefitsCost).toBe(expectedBenefitsCost);
    expect(updatedEmployee.data.netPay).toBe(expectedNetPay);
  });

  
});
