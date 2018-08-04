# psi-v4 [![Build Status](https://travis-ci.org/addyosmani/psi.svg?branch=master)](https://travis-ci.org/addyosmani/psi)

> PageSpeed Insights with reporting

![](screenshot.png)

Run mobile and desktop performance tests for your deployed site using [Google PageSpeed Insights](https://developers.google.com/speed/docs/insights/v4/getting-started) v4.


## Install

```
$ npm install psi-v4
```


## Usage

```js
const psi = require('psi-v4');

// Get the PageSpeed Insights report
psi('theverge.com').then(data => {
  console.log(data.ruleGroups.SPEED.score);
  console.log(data.pageStats);
});

// Output a formatted report to the terminal
psi.output('theverge.com').then(() => {
  console.log('done');
});

// Supply options to PSI and get back speed and usability scores
psi('theverge.com', {nokey: 'true', strategy: 'mobile'}).then(data => {
  console.log('Speed score:', data.ruleGroups.SPEED.score);
});
```

As of PSI 4.x, we expose the PageSpeed Insights speed score.


## API

### psi(url, [options])

Returns a `Promise` for the response data from Google PageSpeed Insights.

#### url

Type: `string`

URL of the page for which the PageSpeed Insights API should generate results.

#### options

Type: `Object`plugin

##### key

Type: `string`<br>
Default: Free tier

When using this module for a production-level build process, registering for an API key from the [Google Developer Console](https://developers.google.com/speed/docs/insights/v1/getting_started#auth) is recommended.

##### strategy

Type: `string`<br>
Default: `mobile`<br>
Values: `mobile` `desktop`

Strategy to use when analyzing the page.

##### locale

Type: `string`<br>
Default: `en_US`

Locale results should be generated in.

##### threshold

Type: `number`<br>
Default: `70`

Threshold score to pass the PageSpeed test. Useful for setting a performance budget.

### psi.output(url, [options])

Output the formatted report to the terminal.

Returns a promise for the response data from Google PageSpeed Insights.

`url` and `options` is the same as `psi()`.


## CLI

```
$ npm install --global psi-v4
```

```
$ psi-v4 --help

  Usage
    $ psi-v4 <url>

  Options
    --key        Google API Key. By default the free tier is used
    --strategy   Strategy to use when analyzing the page: mobile|desktop
    --format     Output format: cli|json|tap
    --locale     Locale results should be generated in
    --threshold  Threshold score to pass the PageSpeed test
    --optimized  Get the URL of optimized resources
    --download   Download optimized resources

  Example
    $ psi-v4 todomvc.com --strategy=mobile
```


## Getting PSI into your build process

A sample [Gulp](https://github.com/addyosmani/psi-gulp-sample) project using PSI is available, but this project written for PSI v2. You can fork it and rewrite for PSI v4.

If you use Grunt, [`grunt-pagespeed`](https://github.com/jrcryer/grunt-pagespeed) is a task by James Cryer that uses PSI v2 under the hood. You can fork it and rewrite to PSI v4 too.

For testing local project, we recommend using [ngrok](http://www.jamescryer.com/2014/06/12/grunt-pagespeed-and-ngrok-locally-testing/).


## License

Apache-2.0 - Copyright 2015 Google Inc
