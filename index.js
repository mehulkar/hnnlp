// initialize modules
var hn_analyzer = module.exports = {}

// external dependencies
var HN = require('hnindex')
var natural = require('natural')
var fs = require('fs')

// local dependencies
var train = require('./trainer.js')

// load templates
var templates = {
  main: fs.readFileSync('templates/main.html').toString(),
  result: fs.readFileSync('templates/result.html').toString(),
  ranking: fs.readFileSync('templates/ranking.html').toString(),
}

// instantiate classifier and train
var classifier = new natural.BayesClassifier()
train(classifier)

// render the results page
hn_analyzer.render = function(cb) {
  // initiate request to HN
  HN.popular( function(err, results) {
    // construct rankedResults array
    results.entries.forEach(function(entry) {
      entry.rankings = classifier.getClassifications(entry.title)
    })
    var output = renderPage(results.entries)
    cb(output)
  })
}

// rendering logic

function renderPage(entries) {
  return templates.main.replace('{{body}}',renderResults(entries))
}

function renderResults(entries) {
  return entries.map(function(entry) {
    return templates.result
      // article title
      .replace('{{title}}',entry.title)
      // article url
      .replace('{{url}}',entry.url)
      // ranking partial
      .replace('{{rankings}}',renderRankings(entry.rankings))
  }).join(' ')
}

function renderRankings(rankings) {
  return rankings.sort().slice(0,3).map(function(ranking) {
    return templates.ranking
      // the ranking title
      .replace('{{label}}',ranking.label)
      // the confidence percentage with 2 decimal points
      .replace('{{value}}',Math.floor(ranking.value * 100 * 100)/100 + '%')
  }).join(' ')
}
