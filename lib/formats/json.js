'use strict';
const _ = require('lodash');

module.exports = (overview, loadingExperience, statistics, ruleSetResults) => {
  const mapSection = section => section.label;
  const zip = (section, labelMapping) => _.zipObject(_.map(section, labelMapping), _.map(section, 'value'));

  overview = zip(overview, 'label');
  loadingExperience = zip(loadingExperience, mapSection);
  statistics = zip(statistics, mapSection);
  ruleSetResults = zip(ruleSetResults, mapSection);

  return JSON.stringify({
    overview,
    loadingExperience,
    statistics,
    ruleResults: ruleSetResults
  }, null, 2);
};
