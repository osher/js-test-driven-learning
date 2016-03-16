var u = require('util');

//constructor: any function can be a constructor
// it is a convention & best practice to indicate 
// construction-functions with capitalized names.
//
// when used with the 'new' operator - it is called
// upon a clean new object instance
var Person = 
  module.exports.Person = 
    function Person(name,age) {
        this.name = name;
        this.age = age;
    };

//member fields & methods - added on the prototype
//function fields - aka methods (and any other object) - are shared by reference
u._extend(Person.prototype
, { hi    : person_hi
  , greet : person_greet
  }
);

//class fields & methods - aka static - are added on the constructur function itself
u._extend(Person
, { greets : 0
  , new    : person_new    
  }
)

//fields of primitive values are copied by value
//  ES5 - they can be protected by setting the field attributes explicitly
Object.defineProperties( Person.prototype
, { type : 
    { enumerable  : true
    , configurable: false
    , writable    : false
    , value       : "person"
    }
  }
}


function person_hi() {
    return "hi, I'm " + this.name
}

function person_greet(person) {
    this.constructor.greets++;
    return u.format("hello %s, I'm %s.", person.name, this.name);
}

function person_new(name, age) {
    return new Person(name, age);
}