/**
 * Calculates the expected benefits cost per paycheck.
 * Formula: (1000 + (dependants * 500)) / 26
 */
function calculateBenefitsCost(dependants) {
  const yearlyEmployeeCost = 1000;
  const yearlyDependantCost = 500;
  const paychecksPerYear = 26;
  const yearlyCost = yearlyEmployeeCost + dependants * yearlyDependantCost;
  return parseFloat((yearlyCost / paychecksPerYear).toFixed(2));
}

/**
 * Calculates the expected net pay per paycheck.
 * Formula: grossPay - benefitsCost
 */
function calculateNetPay(dependants) {
  const grossPay = 2000;
  const benefitsCost = calculateBenefitsCost(dependants);
  return parseFloat((grossPay - benefitsCost).toFixed(2));
}

module.exports = { calculateBenefitsCost, calculateNetPay };
