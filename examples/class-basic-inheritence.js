var u      = require('util');
var Person = require('./class-basic').Person;

//inheritence has 2 aspects:
//  - applying parent constructor, if you so chose 
//
//  - create the prototype chain link
//      - replacing the prototype 
//      - providing solid reference to this.constructor
//      - providing reference to this.super_
//

var Employee = 
  module.exports.Employee = 
    function(name, age, comp, job) {
        this.company = Employee.register(this, comp);
        //the dynamic form of this line would be:
        //this.constructor.register(this);

        this.job = job;
        //calling parent constructor 
        //  does not have to be first line in constructor
        //  can be done anywhere (even outside the constructor...)
        Person.call(this, name, age);
        //Person.apply(this, arguments) //[name, age]
        //the dynamic form of this line would be:
        //this.constructor.prototype.constructor.call(this, name, age);
        // - however - should require more cautious referencing..
    };

//create the prototype chain link:
u.inherits(Employee, Person);
//this is a shortcut available in node.
//it can be done manually this way:
/*
Employee.super_ = Person;
Employee.prototype = 
  Object.create(Person.prototype
  , { constructor: 
      { value       : Employee
      //the value of the flags here may be your design decision
      //these are the defaults in `util.inherits`
      , enumerable  : false
      , writable    : true
      , configurable: true
      }
    }
  );
*/

//extending with additional behavior - is introducing members
//   on the subclass prototype
//overriding parent behavior - is introducing members on the 
//   subclass prototype with same name 
//   they will be found first on the prototype chain
//    - just like shaddowing on the scope chain
u._extend(Employee.prototype
, { produce  : employee_produce
  , fieldWork: employee_fieldwork
  , greet    : employee_greet
  }
);

//static fields & methods - aka static - are added on the function itself
u._extend(Employee
, { register: employee_register
  , company : {}
  }
);

//inheriting static fields is not a default - its a design decison, 
//  and so is the way by which it may be implemented
Object.defineProperties( Employee
, { greets :
    { set          : function emp_greets_set(v) { Person.greets = v }
    , get          : function emp_greets_get(v) { return Person.greets }
    , enumerable   : true
    , configurable : false
    }
  }
}

function employee_greet(person) {
    var greet = 
    //accessing superclass methods
        Person.prototype.greet.call(this, person);
    //the dynamic ways - depend on the links you created:
    /*
    the super_ link:
        this.super_.prototype.greet.call(this, person);
    or, if you have not had this link set
        this.constructor.prototype.constructor.prototype.greet.call(this, person);
               \|/                   \|/
            func Employee(..){..} func Person(..){..}
    */

    return u.format( "%s I work at %s", greet, this.company.name);
}

function employee_produce(qty) {
    if ('function' != typeof this.fieldWork) 
        throw new Error('fieldWork not implemented! Employee#fieldWork is an abstract method');

    var product = this.fieldWork(qty);
    this.company.products.push(product)
    return product;
}

function employee_register(emp, companyName) {
    //NOTE: this impl. is a little of an mentipattern: 
    //  puristically, we would expect to have a Company constructor
    //  but then again - it's a design decision when it justifies 
    //  its own class
    var company = 
        Employee.company[ companyName ]
        || ( Employee.company[ companyName ] = 
             { name    : companyName
             , workers : []
             , products: []
             }
           )
        ;
    company.workers.push(emp);
    return company;
}
//---------------------------------------------------------------

var Lineworker = 
  module.exports.Lineworker = 
    function Lineworker(name, age, comp, job) {
        Employee.call(this, name, age, comp, job)
    };

u.inherits(Lineworker, Employee);

u._extend(Lineworker.prototype
, { fieldWork : lineworker_fieldWork
  }
);

function lineworker_fieldWork(qty) { 
    if (qty < 0) throw new Error("cannot produce negative quantity");
    return prod(qty);
}

function prod(qty) {
    return qty < 2 
           ? qty 
           : qty * prod(qty - 1)
}
//---------------------------------------------------------------

var Lumberjack = 
  module.exports.Lumberjack = 
    function Lumberjack(name, age, comp, job) {
        Employee.call(this, name, age, comp, job)
    };

u.inherits(Lumberjack, Employee);

u._extend(Lumberjack.prototype
, { produce : lumberjack_produce
  }
);

function lumberjack_produce(qty) { 
    return Math.log(qty)
}