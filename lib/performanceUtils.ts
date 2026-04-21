// performanceUtils.ts

/**
 * Calculates the efficiency score given points and total attempts.
 * @param points - Total points scored.
 * @param attempts - Total attempts made.
 * @returns Efficiency score as a number.
 */
export function calculateEfficiencyScore(points: number, attempts: number): number {
  if (attempts === 0) return 0;
  return points / attempts;
}

/**
 * Calculates the average points.
 * @param pointsList - Array of points in each match.
 * @returns Average points as a number.
 */
export function calculateAveragePoints(pointsList: number[]): number {
  const totalPoints = pointsList.reduce((acc, points) => acc + points, 0);
  return totalPoints / pointsList.length;
}

/**
 * Calculates win rate given total wins and total matches.
 * @param wins - Total number of wins.
 * @param totalMatches - Total matches played.
 * @returns Win rate as a number.
 */
export function calculateWinRate(wins: number, totalMatches: number): number {
  if (totalMatches === 0) return 0;
  return wins / totalMatches;
}

/**
 * Calculates consistency score based on points variance.
 * @param pointsList - Array of points in each match.
 * @returns Consistency score as a number.
 */
export function calculateConsistencyScore(pointsList: number[]): number {
  const average = calculateAveragePoints(pointsList);
  const variance =
    pointsList.reduce((acc, points) => acc + Math.pow(points - average, 2), 0) / pointsList.length;
  return 1 / (1 + variance); // Higher score for lower variance
}

/**
 * Analyzes trends over a series of points.
 * @param pointsList - Array of points in each match.
 * @returns Trend analysis as a string.
 */
export function analyzeTrend(pointsList: number[]): string {
  const trend = pointsList[pointsList.length - 1] - pointsList[0];
  if (trend > 0) return "Increasing";
  else if (trend < 0) return "Decreasing";
  return "Stable";
}
