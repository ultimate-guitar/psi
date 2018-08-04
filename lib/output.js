'use strict';
const fs = require('fs');
const querystring = require('querystring');
const prettyBytes = require('pretty-bytes');
const sortOn = require('sort-on');
const humanizeUrl = require('humanize-url');
const download = require('download');

const THRESHOLD = 70;
const RESOURCE_URL = 'https://developers.google.com/speed/pagespeed/insights/optimizeContents?';

function overview(url, strategy, scores) {
  const ret = [];

  ret.push({
    label: 'URL',
    value: url
  });

  ret.push({
    label: 'Strategy',
    value: strategy
  });

  ret.push({
    label: 'Speed',
    value: scores.SPEED.score
  });

  if (scores.USABILITY !== undefined) {
    ret.push({
      label: 'Usability',
      value: scores.USABILITY.score
    });
  }

  return ret;
}

function ruleSetResults(rulesets) {
  const ret = [];

  for (const title in rulesets) {
    if (Object.prototype.hasOwnProperty.call(rulesets, title)) {
      ret.push({
        label: title,
        value: Math.ceil(rulesets[title].ruleImpact * 100) / 100
      });
    }
  }

  return sortOn(ret, 'label');
}

function loadingExperience(data) {
  const ret = [];
  ret.push({
    label: 'overall_category',
    value: data.overall_category
  });

  for (const title in data.metrics) {
    if (Object.prototype.hasOwnProperty.call(data.metrics, title)) {
      ret.push({
        label: title,
        value: `${data.metrics[title].median} ms`
      });
    }
  }

  return ret;
}

function statistics(stats) {
  const ret = [];

  for (const title in stats) {
    if (Object.prototype.hasOwnProperty.call(stats, title)) {
      ret.push({
        label: title,
        value: title.indexOf('Bytes') === -1 ? stats[title] : prettyBytes(Number(stats[title]))
      });
    }
  }

  return sortOn(ret, 'label');
}

function getReporter(format) {
  format = ['cli', 'json', 'tap'].indexOf(format) === -1 ? 'cli' : format;
  return require(`./formats/${format}`); // eslint-disable-line import/no-dynamic-require
}

module.exports = (parameters, response) => {
  return Promise.resolve().then(() => {
    const renderer = getReporter(parameters.format);
    const threshold = typeof parameters.threshold === 'number' ? parameters.threshold : THRESHOLD;
    const optimizedResourceURL = RESOURCE_URL + querystring.stringify({url: response.data.id, strategy: parameters.strategy});

    console.log(renderer(
      overview(humanizeUrl(response.data.id), parameters.strategy, response.data.ruleGroups),
      loadingExperience(response.data.loadingExperience),
      statistics(response.data.pageStats),
      ruleSetResults(response.data.formattedResults.ruleResults),
      threshold
    ));

    if (parameters.optimized) {
      console.log('\nHere are your optimized images:', humanizeUrl(optimizedResourceURL));
    }

    if (response.data.ruleGroups.SPEED.score < threshold) {
      const error = new Error(`Threshold of ${threshold} not met with score of ${response.data.ruleGroups.SPEED.score}`);
      error.noStack = true;
      throw error;
    }

    if (parameters.download) {
      return download(optimizedResourceURL).then(data => {
        fs.writeFileSync('./optimized.zip', data);
      });
    }
  });
};
