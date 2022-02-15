import DataPoint from '../../../../entities/statistics/dataPoint';

/**
 * Returns array of data points initialised with 0 for the span between dates provided.
 * @param startDate First day of time frame
 * @param stopDate Last day of time frame
 */
function getBlankDataPointsArray(startDate: Date, stopDate: Date) {
  const dataPoints: DataPoint[] = [];
  let indexDate = startDate;
  while (indexDate <= stopDate) {
    dataPoints.push(new DataPoint(indexDate));
    indexDate = new Date(indexDate.getTime() + 24 * 60 * 60 * 1000);
  }
  return dataPoints;
}

/**
 * Returns number of days between two dates. If date2 is before date1 the return value is negative.
 * @param date1
 * @param date2
 */
function getDatesDifference(date1: Date, date2: Date): number {
  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);
  const diffTime = date2.getTime() - date1.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export { getBlankDataPointsArray, getDatesDifference };
