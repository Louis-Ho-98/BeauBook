// datetimeHelper.ts
// Utility for reliable day-of-week calculation from YYYY-MM-DD string

/**
 * Returns the day of week for a date string in YYYY-MM-DD format.
 * 0 = Sunday, 1 = Monday, ..., 6 = Saturday
 * Always correct regardless of timezone.
 */
export function getDay(dateStr: string): number {
  const [year, month, day] = dateStr.split("-").map(Number);
  const jsDate = new Date(year, month - 1, day);
  return jsDate.getDay();
}

// Example usage:
// getDay("2025-09-03") // returns 3 (Wednesday)
