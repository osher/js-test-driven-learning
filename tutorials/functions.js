module.exports = 
{ "ways to obtain a function Object" :
  { "function declaration" : 
    { "must have a name (cannot be anonymous)" : 
      function() {
          /* TRICKY: 
             since syntax error is blocked in compilation phase, 
             we can prove this using eval (or by requiring a file with one line... :P )
           */

          //first show that eval with good func works
          eval("function aaa() { return 1 }");

          //then whow
          Should(function() { 
              
              //trying to decalre anonymous function
              eval( "function () { return 1 }")

          }).throw(/Unexpected token \(/g)
      }
    , "is accessible to all codes within it's scope by the name by which it was declared (regardless to where it is declared)" : 
      function() { 
          function declaredInTop() { return "top" }
          
          Should.exist(declaredInTop);
          declaredInTop.should.be.a.Function;

          Should.exist(declaredInTheEnd);
          declaredInTheEnd.should.be.a.Function;

          function declaredInTheEnd() { return "end" }
      }
    , "support propety .name with the name by which they were declared" :
      function() {
          someNamedFunction.should.have.property("name", "someNamedFunction");
          function someNamedFunction() { return "end" }
      }
    , "must have a body" : 
      function() {
          Should(function() {
              eval("function funcName();")
          }).throw(/Unexpected token ;/)
      }
    , "may name any expected argumets as 'formal arguments'" :
      function() { 
          function invert(bool) {}
          function add(a,b) {}
          function count() {}
      }
    }
  , "function expression" : 
    { "when assigning the returned value of a function expression" :
      { "it's name should not be available as a variable in it's scope (or subscope of its scope in the scope chain)" : 
        function() { 
            var variable = function namedFunc() {} 
            Should(variable).be.a.Function;

            Should(function() {
                namedFunc()
            }).throw("namedFunc is not defined")
        }
      , "and therefor it can be anonymous" :
        function() {
            var anonym = function() {};
            anonym.should.have.property("name","");
        }
      }
    , "any attempt to use the returned value of a function declaration makes it a function expression - even useless ones" :
      function() { 
          //useless as it may be,          
          //this function becomes an expression because it's passed to the OOO-paranthesis operator.
          //it is declared, and immediately vaporized.
          ( function exprFunc1() {} );

          //the name does not exist
          Should(typeof exprFunc1).eql("undefined");

    
          //this function becomes an expression because it's passed as property value of an object-literal
          var o = { foo : function nestedInObjectLiteral() {} };
          Should(typeof nestedInObjectLiteral).eql("undefined");

      }
    , "invoking the function immediately - uses the returned value of the declaration" :
      function() {

          //this function becomes an expression because it's passed the invocation-paranthesis operator
          //(NOTE the external paranthesis are required to distinct from function declaration)
          // the code won't pass compilatio without it
          ( function exprFunc2(){ return 1 }() ).should.eql(1);

          Should(typeof exprFunc2).eql("undefined")
      }
    }
  , "function constructor" : 
    { "TBD" : null
    }
  }
, "all functions (regardless to how they were obtained)" : 
  { "support a string attribute .name exposing their decalred name (if any)" :
    function() {
        function namedFunc() {}
        namedFunc.should.have.property("name","namedFunc");

        var namedFuncExpr = function named() {};
        namedFuncExpr.should.have.property("name","named");

        var anonymFuncExpr = function () {};
        anonymFuncExpr.should.have.property("name","");
    }
  , "support a numeric attribute .length describing it's arity" : 
    function() {
        var funcRef = names3Args;
        var funcExpr2Args = function(a,b) {}
        var namedFuncExpr2Args  = function hasAname(a,b) {}

        names2Args.should.have.property('length',2);
        names3Args.should.have.property('length',3);
        namesNoArgs.should.have.property('length',0);

        console.log.should.have.property('length',0);

        describe.should.have.property('length',2);
        it.should.have.property('length',2);

        function names2Args(a,b) {}    
        function names3Args(a,b,c) {}    
        function namesNoArgs() {}    
    }
  , "are invoked using the invocation-paranthesis operator" :
    function() {
        function declaredInTop() { return "top" }
        var obj = { prop: function() { return "prop" } }
        
        declaredInTop().should.eql("top");
        declaredInTheEnd().should.eql("end");
        obj.prop().should.eql("prop");

        function declaredInTheEnd() { return "end" }          
    }
  , "may use arguments within their body" : 
    { "by relaying on their formal name" :
      function() {
          mul(6,7).should.eql(42);

          function mul(a,b) { return a * b }             
      }
    , "by using the pseudo-array arguments stack" :
      function() {
          mul(6,7).should.eql(42);

          function mul() { return arguments[0] * arguments[1] }
      }
    , "and work when invoked with more arguments than they name" :
      function() {
          first(1,2,3).should.eql(1);

          function first(a) { return a }
      }
    , "may use arguments.length to detect how many arguments they are actually called with" : 
      function() { 
          count().should.eql(0);
          count(1,1,1).should.eql(3);
          count(true, [], {}, null, undefined).should.eql(5);

          function count() { return arguments.length }
      }
    , "they get the value 'undefined' for any named argument the try to access but were not provided" :
      function() {
          coloncat("a","b","c").should.eql("a:b:c");
          coloncat("a","b")    .should.eql("a:b:undefined");
          coloncat("a")        .should.eql("a:undefined:undefined");
          coloncat()           .should.eql("undefined:undefined:undefined");

          function coloncat(a,b,c) { return a + ":" + b + ":" + c }
      }
    , "outside of strict mode - named arguments and arguments stack are linked" :
      function() {
          foo("first","SECOND").should.eql("SECOND");

          function foo(a,b) {
              a = arguments[1]
              return arguments[0];
          }
      }
    , "inside strict mode - named arguments and arguments stack are not linked" :
      function() {
          foo("FIRST","second").should.eql("FIRST");

          function foo(a,b) {
              'use strict';
              a = arguments[1]
              return arguments[0];
          }
      }
    }
  , "and the scope chain" : 
    { "functions have access to their own name (and can recurse using it)" : 
      function() { 
          var times = 0;
          recurse(3).should.eql('over');
          times.should.eql(4); //3,2,1,0

          function recurse(n) {
              times++;
              return n ? recurse(n-1) : 'over';
          }
      }
    , "functions have access to symbols up the scope chain, all way to the global" : 
      function() {
          var test    = "test";

          myOuterFactory("outerParam").inner("innerParam").should.eql(
            { innerVar  : "innerVar"
            , innerParam: "innerParam"
            , outerVar  : "outerVar"
            , outerParam: "outerParam"
            , test     : "test"
            , global    : true
            }     
          );

          function myOuterFactory(outerParam) { 
              var outerVar = "outerVar";
              return { inner: inner }
              function inner(innerParam) {
                  var innerVar = "innerVar"

                  return { 
                    innerVar  : innerVar
                  , innerParam: innerParam
                  , outerVar  : outerVar
                  , outerParam: outerParam
                  , test      : test
                  , global    : !!global
                  }                
              }
          }
      }
    , "functions do not have access to symbols from scopes of functions they invoke" : 
      function() {

          outer();
          Should(typeof a).eql('undefined')

          function outer() {
              inner();
              Should(typeof a).eql('undefined')
          }

          function inner() { 
              var a = 1;
          }
      }
    }
  , "in stack traces" : 
    { "function names are used regardless to the name of the variable or property from which they were invoked" : 
      function() {
          var variable = function namedFunc() { return new Error() };

          var result = variable();
          result.should.be.an.Error;
          result.stack.should.startWith(
            [ "Error"
            , "    at namedFunc ("
            ].join("\n")
          )
      }
    , "last attribute name is also indicated on top of function name when invoked as a method" : 
      function() { 
          var variable = { bar: { foo: function namedFunc() { return new Error() } } }

          var result = variable.bar.foo();
          result.stack.should.startWith(
            [ "Error"
            , "    at Object.namedFunc [as foo] ("
            ].join("\n")
          )
      }
    , "unnamed functions may appear as <anonymous>" : 
      "does not reproduce any more..." ||
      function(done) {
          setTimeout(function() {
              a()
          })
          function a() { throw new Error }
      }
    }
  , "functions are first-class objects" : 
    { "they are instances of Function which inherits Object" :
      function() {
          Should(typeof myFunc).eql('function');

          myFunc.should.be.instanceOf(Function);
          myFunc.should.be.instanceOf(Object);

          function myFunc() {}
      }
    , "they can be augmented with additional attributes of any type" : 
      function() {
          var myFunc = myFactory();

          myFunc.should.be.a.Function;
          Object.keys(myFunc).sort().should.eql( 
            [ "boolval"
            , "naNVal"
            , "nullVal"
            , "numVak"
            , "objVal"
            , "strval"
            , "undef"
            , "utilMethod"
            ]
          );

          function myFactory() { 
              var f = function someName() {};
              f.numVak = 42;
              f.strval = "some value";
              f.boolval = false;
              f.utilMethod = function utilFunc() { }
              f.undef = undefined;
              f.nullVal = null;
              f.naNVal = NaN;
              f.objVal = {};

              return f;
          }
      }
    }
  , "may be used as constructors (regardless to wither they were indended as such or not)" : 
    function () { 
        var names = [];
        function keep(item) {
            names.push(item);
        }

        var result = new keep("secret");
        names.should.eql(["secret"]);

        Should.exist(result);
        result.should.be.an.Object;
        result.should.eql({});
    }
  , "can be invoked as a function, even though its meant to be used as a constructor" :
    { afterEach: 
      function() { 
          delete global.name
      }
    , "without a context - EFFECTS THE GLOBAL!" : 
      function() {
          Should(function() {
              Person("Arthur","Dent");
          }).not.throw();

          global.should.have.property("name","Arthur Dent");

          function Person(fname, lname) {
              this.name = fname + " " + lname;
          }
      }
    , "within a context - EFFECTS THE GLOBAL!" : 
      function() {
          var obj = { nameMe: testMethod };

          Should(function() {
              obj.nameMe("Arthur","Dent","hiker");
          }).not.throw();

          obj.should.have.property("hobby", "hiker");

          global.should.have.property("name","Arthur Dent");

          function testMethod(fname, lname, hobby) {
              this.person = Person(fname, lname);
              this.hobby = hobby;
          }

          function Person(fname, lname) {
              this.name = fname + " " + lname;
          }
      }
    , "in stritc mode - the `this` is null, unless called with new operator" : 
      function() {
          var result;

          Should(function() {
              result = Person("Arthur","Dent");
          }).throw(/Cannot set property 'name' of undefined/);

          result = new Person("Arthur","Dent");
          result.should.have.property("name", "Arthur Dent");

          function Person(fname, lname) {
              'use strict';
              this.name = fname + " " + lname;
          }          
      }
    }
  , "can be assigned as methods, even though its meant to be constructor" : 
    function() {
        var obj = { nameMe: Person };

        Should(function() {
            obj.nameMe("Arthur", "Dent");
        }).not.throw()

        obj.should.have.property("name", "Arthur Dent");

        function Person(fname, lname) {
            this.name = fname + " " + lname;
        }
    }
  }
}