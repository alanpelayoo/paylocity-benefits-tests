const { test, expect } = require("@playwright/test");
const config = require("../../utils/config");
const {
  calculateBenefitsCost,
  calculateNetPay,
} = require("../../utils/calculations");

const headers = {
  Authorization: `Basic ${config.authToken}`,
  "Content-Type": "application/json",
};

test.describe("GET /api/Employees", () => {
  test("should return a list of employees with 200 status", async ({
    request,
  }) => {
    const response = await request.get(config.apiURL, { headers });
    expect(response.status()).toBe(200);

    const employees = await response.json();
    expect(Array.isArray(employees)).toBeTruthy();
  });

  test("should return employees with all required fields", async ({
    request,
  }) => {
    const response = await request.get(config.apiURL, { headers });
    const employees = await response.json();

    if (employees.length > 0) {
      const employee = employees[0];
      expect(employee).toHaveProperty("id");
      expect(employee).toHaveProperty("firstName");
      expect(employee).toHaveProperty("lastName");
      expect(employee).toHaveProperty("dependants");
      expect(employee).toHaveProperty("salary");
      expect(employee).toHaveProperty("gross");
      expect(employee).toHaveProperty("benefitsCost");
      expect(employee).toHaveProperty("net");
    }
  });
});

test.describe("GET /api/Employees/{id}", () => {
  test("should return a specific employee by ID", async ({ request }) => {
    // First get all employees to find a valid ID
    const allResponse = await request.get(config.apiURL, { headers });
    const employees = await allResponse.json();

    if (employees.length > 0) {
      const employeeId = employees[0].id;
      const response = await request.get(`${config.apiURL}/${employeeId}`, {
        headers,
      });

      expect(response.status()).toBe(200);

      const employee = await response.json();
      expect(employee.id).toBe(employeeId);
    }
  });
});

test.describe("POST /api/Employees", () => {
  test("should create a new employee with valid data", async ({ request }) => {
    const newEmployee = {
      firstName: "API",
      lastName: "Test",
      dependants: 3,
    };

    const response = await request.post(config.apiURL, {
      headers,
      data: newEmployee,
    });

    expect(response.status()).toBe(200);

    const created = await response.json();
    expect(created.firstName).toBe(newEmployee.firstName);
    expect(created.lastName).toBe(newEmployee.lastName);
    expect(created.dependants).toBe(newEmployee.dependants);
    expect(created.id).toBeTruthy();
  });

  test("should calculate correct benefits cost for new employee", async ({
    request,
  }) => {
    const dependants = 4;
    const newEmployee = {
      firstName: "Calc",
      lastName: "Test",
      dependants: dependants,
    };

    const response = await request.post(config.apiURL, {
      headers,
      data: newEmployee,
    });

    const created = await response.json();

    expect(created.salary).toBe(52000);
    expect(created.gross).toBe(2000);

    // API returns unrounded float, so we compare rounded values
    const actualBenefitsCost = parseFloat(created.benefitsCost.toFixed(2));
    const actualNetPay = parseFloat(created.net.toFixed(2));
    const expectedBenefitsCost = calculateBenefitsCost(dependants);
    const expectedNetPay = calculateNetPay(dependants);

    expect(actualBenefitsCost).toBe(expectedBenefitsCost);
    expect(actualNetPay).toBe(expectedNetPay);
  });

  test("should return 400 when required fields are missing", async ({
    request,
  }) => {
    const response = await request.post(config.apiURL, {
      headers,
      data: {},
    });

    expect(response.status()).toBe(400);
  });
});

test.describe("PUT /api/Employees", () => {
  let testEmployeeId;

  test.beforeEach(async ({ request }) => {
    // Create an employee to update
    const newEmployee = {
      firstName: "Update",
      lastName: "Before",
      dependants: 1,
    };

    const response = await request.post(config.apiURL, {
      headers,
      data: newEmployee,
    });

    const created = await response.json();
    testEmployeeId = created.id;
  });

  test("should update an existing employee", async ({ request }) => {
    const updatedData = {
      id: testEmployeeId,
      firstName: "Update",
      lastName: "After",
      dependants: 5,
    };

    const response = await request.put(config.apiURL, {
      headers,
      data: updatedData,
    });

    expect(response.status()).toBe(200);

    const updated = await response.json();
    expect(updated.lastName).toBe("After");
    expect(updated.dependants).toBe(5);
  });

  test("should recalculate benefits cost after updating dependants", async ({
    request,
  }) => {
    const newDependants = 7;
    const updatedData = {
      id: testEmployeeId,
      firstName: "Update",
      lastName: "Before",
      dependants: newDependants,
    };

    const response = await request.put(config.apiURL, {
      headers,
      data: updatedData,
    });

    const updated = await response.json();

    const actualBenefitsCost = parseFloat(updated.benefitsCost.toFixed(2));
    const actualNetPay = parseFloat(updated.net.toFixed(2));
    const expectedBenefitsCost = calculateBenefitsCost(newDependants);
    const expectedNetPay = calculateNetPay(newDependants);

    expect(actualBenefitsCost).toBe(expectedBenefitsCost);
    expect(actualNetPay).toBe(expectedNetPay);
  });
});

test.describe("DELETE /api/Employees/{id}", () => {
  let testEmployeeId;

  test.beforeEach(async ({ request }) => {
    // Create an employee to delete
    const newEmployee = {
      firstName: "Delete",
      lastName: "APITest",
      dependants: 0,
    };

    const response = await request.post(config.apiURL, {
      headers,
      data: newEmployee,
    });

    const created = await response.json();
    testEmployeeId = created.id;
  });

  test("should delete an employee and return 200", async ({ request }) => {
    const response = await request.delete(
      `${config.apiURL}/${testEmployeeId}`,
      { headers }
    );

    expect(response.status()).toBe(200);
  });

  test("should not return deleted employee in GET all", async ({
    request,
  }) => {
    // Delete the employee
    await request.delete(`${config.apiURL}/${testEmployeeId}`, { headers });

    // Verify its gone
    const response = await request.get(config.apiURL, { headers });
    const employees = await response.json();

    const found = employees.find((e) => e.id === testEmployeeId);
    expect(found).toBeUndefined();
  });
});
