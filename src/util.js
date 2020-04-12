const calCulateActualDay = (periodType, timeToElapse) => {
  let result = null;
  if (periodType.toLowerCase() === 'days') {
    result = parseInt(timeToElapse, 10);
  } else if (periodType.toLowerCase() === 'weeks' || periodType.toLowerCase() === 'week') {
    result = parseInt(timeToElapse, 10) * 7;
  } else if (periodType.toLowerCase() === 'months') {
    result = parseInt(timeToElapse, 10) * 30;
  } else {
    return null;
  }
  return result;
};

module.exports = calCulateActualDay;
