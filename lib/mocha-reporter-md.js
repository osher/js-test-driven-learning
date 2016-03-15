var Base = require('mocha/lib/reporters/base')
  , util = require('util');

/**
 * Expose `Md`.
 */

exports = module.exports = Md;

/**
 * Initialize a new `Md` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Md(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , total = runner.total
    , headDepth = 1;

  function head() {
    return Array(Math.min(headDepth,6)).join('#');
  }

  runner.on('suite', function(suite){
    if (suite.root) return;
    ++headDepth;
    console.log('%s %s\n\n', head(), suite.title);
  });

  runner.on('suite end', function(suite){
    if (suite.root) return;
    --headDepth;
    console.log();
  });

  runner.on('pass', onTestResult);
  runner.on('fail', onTestResult);
  
  function onTestResult(test, err){
    console.log(
      "(%s) %s\n\n```javascript\n%s\n```\n\n"
    , err ? "X" : "V"
    , test.title
    , test.fn.toString().replace(/^function[^(]+\([^)]*\)\s*\{/,"").replace(/\}$/,"")
    );
    if (err) 
       console.log( "**FAIL:**\n %s\n\n```\n%s\n```\n\n" , err.stack.replace(/\n/g, "\n> ", util.inspect(err)) )
    
  }
}
