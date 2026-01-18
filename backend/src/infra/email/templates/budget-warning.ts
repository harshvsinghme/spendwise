export function budgetWarningTemplate(
  name: unknown,
  utilisedPercentage: unknown,
  month: unknown,
  year: unknown
) {
  return `
    <h3>Hi ${name},</h3>
    <br>
    <p>You have exhausted ${utilisedPercentage}% of your budget for the month: ${month} ${year} </p>
  `;
}

export const BUDGET_WARNING = `BUDGET_WARNING`;
