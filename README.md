# js-test-driven-learning

## Overview
This project is deeply inspired by the book [Test Driven JavaScript Development]http://www.goodreads.com/book/show/9269233-test-driven-javascript-development).
Although the book is quite old, and big parts of the book gets obsolete, the 
book directs to a very specific type of learning, that once obtained by the
reader - will never get obsolete: test-driven-learning.

Test-driven-learning to me is science in action. Its:
 - practical
 - result-driven
 
i.e - to learn something, the user is encouraged to 
  1. come with a claim
  2. conduct an experiment that will prove or disprove this claim (aka - write 
     a test)
  3. observe the results to draw conclusions
 
## In this project
In this project, you can find test-suites, each of them explores a concept by
writting down claims, and proving them with a test.

There are also a set of sandboxed examples that demonstrate concepts that 
require a wider context than a single test function.
Eventually I intend all examples to be described in tests, or be used in tests.

## Running all the experiments

Running all the experiments produces a spec output of all the claims and the
experiments that prove them.

It is done by:
`npm test`

Currently, it uses mocha to do so.

You can also generate docs (experiment reports), and view them as HTML.

## Future
 - suites
   - primitives
   - objects
   - the `this` keyword and the dot/eval operator
   - using oop in js
     - basic
     - inheritence
     - encapsulation
     - polymorphism
     - mixin & traits
   - the call stack 
   - the event loop (in node)
   - functional princepals
   - play with some design paterns
 - features
   - live-lab docs that are an in-browser runnable test-env, where users
     can run the experiments and play with them for their own learning

## Contributing
You want to contribute? I'd be honored. That's why it's open-source in the 
first place.

Send me issues or PR the usual way, we'll get you started :)


## Lisence
MIT