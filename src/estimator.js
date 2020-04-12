const calCulateActualDay = require('./util');

const infectionByTimeRequest = (currentlyInfected, periodType, days) => {
  const actualDays = calCulateActualDay(periodType, days);
  const findFactor = Math.trunc(actualDays / 3);
  const powerOf = Math.trunc(2 ** findFactor);
  return Math.trunc(currentlyInfected * powerOf);
};

const fifteenPercentOfInfectionByTime = (infectionsByTime) => Math.trunc(infectionsByTime * 0.15);

const fivePercentReqeuestByTime = (infectionByTime) => Math.trunc(infectionByTime * 0.05);

const twoPercentReqeuestByTime = (infectionByTime) => Math.trunc(infectionByTime * 0.02);

const calDollarsInFlight = (
  infectionByTime,
  averageDailyIncomePop,
  averageIncome,
  requestedTime,
  periodType
) => {
  const actualDay = calCulateActualDay(periodType, requestedTime);
  const result = (infectionByTime * averageDailyIncomePop * averageIncome) / actualDay;
  const dollarLost = Math.trunc(result);
  return dollarLost;
};

const numberOfAvailableBeds = (
  severeCasesByRequestedTime,
  totalHospitalBeds
) => {
  const actualTotalBeds = 0.35 * totalHospitalBeds;
  const numberOfBeds = actualTotalBeds - severeCasesByRequestedTime;

  return Math.trunc(numberOfBeds);
};

const covid19ImpactEstimator = (data) => {
  console.log(data);
  const output = {
    data,
    impact: {},
    severeImpact: {}
  };

  output.impact.currentlyInfected = data.reportedCases * 10;

  output.severeImpact.currentlyInfected = data.reportedCases * 50;

  output.impact.infectionsByRequestedTime = infectionByTimeRequest(
    output.impact.currentlyInfected,
    data.periodType,
    data.timeToElapse
  );

  output.severeImpact.infectionsByRequestedTime = infectionByTimeRequest(
    output.severeImpact.currentlyInfected,
    data.periodType,
    data.timeToElapse
  );

  output.impact.severeCasesByRequestedTime = fifteenPercentOfInfectionByTime(
    output.impact.infectionsByRequestedTime
  );

  output.severeImpact.severeCasesByRequestedTime = fifteenPercentOfInfectionByTime(
    output.severeImpact.infectionsByRequestedTime
  );

  output.impact.hospitalBedsByRequestedTime = numberOfAvailableBeds(
    output.impact.severeCasesByRequestedTime,
    data.totalHospitalBeds
  );

  output.severeImpact.hospitalBedsByRequestedTime = numberOfAvailableBeds(
    output.severeImpact.severeCasesByRequestedTime,
    data.totalHospitalBeds
  );

  output.impact.casesForICUByRequestedTime = fivePercentReqeuestByTime(
    output.impact.infectionsByRequestedTime
  );

  output.severeImpact.casesForICUByRequestedTime = fivePercentReqeuestByTime(
    output.severeImpact.infectionsByRequestedTime
  );

  output.impact.casesForVentilatorsByRequestedTime = twoPercentReqeuestByTime(
    output.impact.infectionsByRequestedTime
  );

  output.severeImpact.casesForVentilatorsByRequestedTime = twoPercentReqeuestByTime(
    output.severeImpact.infectionsByRequestedTime
  );

  output.impact.dollarsInFlight = calDollarsInFlight(
    output.impact.infectionsByRequestedTime,
    data.region.avgDailyIncomePopulation,
    data.region.avgDailyIncomeInUSD,
    data.timeToElapse,
    data.periodType
  );

  output.severeImpact.dollarsInFlight = calDollarsInFlight(
    output.severeImpact.infectionsByRequestedTime,
    data.region.avgDailyIncomePopulation,
    data.region.avgDailyIncomeInUSD,
    data.timeToElapse,
    data.periodType
  );

  return output;
};

module.exports = covid19ImpactEstimator;
