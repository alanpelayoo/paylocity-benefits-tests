class DashboardPage {
  constructor(page) {
    this.page = page;
    this.addEmployeeButton = page.locator("#add");
    this.firstNameInput = page.locator("#firstName");
    this.lastNameInput = page.locator("#lastName");
    this.dependantsInput = page.locator("#dependants");
    this.addButton = page.locator("#addEmployee");
    this.updateButton = page.locator("#updateEmployee");
    this.cancelButton = page.locator(".modal-footer .btn-secondary");
    this.deleteButtonModal = page.locator("#deleteEmployee")
    this.modalCloseButton = page.locator(".modal-header .close");
    this.employeeTable = page.locator("#employeesTable");
    this.tableRows = page.locator("#employeesTable tbody tr");
  }

  async clickAddEmployee() {
    await this.addEmployeeButton.click();
    await this.page.waitForSelector(".modal.show");
  }

  async addEmployee(firstName, lastName, dependants) {
    await this.clickAddEmployee();
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.dependantsInput.fill(dependants.toString());
    await this.addButton.click();
    await this.page.waitForTimeout(2000);
  }

  async clickEditEmployee(rowIndex) {
    const editButton = this.tableRows
      .nth(rowIndex)
      .locator('i.fas.fa-edit')
      .first();
    await editButton.click();
    await this.page.waitForSelector(".modal.show");
  }

  async editEmployee(rowIndex, firstName, lastName, dependants) {
    await this.clickEditEmployee(rowIndex);
    await this.firstNameInput.clear();
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.clear();
    await this.lastNameInput.fill(lastName);
    await this.dependantsInput.clear();
    await this.dependantsInput.fill(dependants.toString());
    await this.updateButton.click();
    await this.page.waitForTimeout(1000);
  }

  async deleteEmployee(rowIndex) {
    const deleteButton = this.tableRows
      .nth(rowIndex)
      .locator('i.fas.fa-times')
      .first();
    await deleteButton.click();
    await this.page.waitForSelector(".modal.show");
    await this.deleteButtonModal.click();

  }

  async getEmployeeCount() {
    return await this.tableRows.count();
  }

  async getEmployeeRowData(rowIndex) {
    const row = this.tableRows.nth(rowIndex);
    const cells = row.locator("td");
    return {
      id: await cells.nth(0).textContent(),
      firstName: await cells.nth(1).textContent(),
      lastName: await cells.nth(2).textContent(),
      dependants: parseInt(await cells.nth(3).textContent()),
      salary: parseFloat(await cells.nth(4).textContent()),
      grossPay: parseFloat(await cells.nth(5).textContent()),
      benefitsCost: parseFloat(await cells.nth(6).textContent()),
      netPay: parseFloat(await cells.nth(7).textContent()),
    };
  }

  async findEmployeeByName(firstName, lastName) {
    const count = await this.getEmployeeCount();
    for (let i = 0; i < count; i++) {
      const data = await this.getEmployeeRowData(i);
      if (
        data.firstName.trim() === firstName &&
        data.lastName.trim() === lastName
      ) {
        return { index: i, data };
      }
    }
    return null;
  }
}

module.exports = DashboardPage;
