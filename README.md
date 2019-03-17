# Supick (super pick)

Empowered but easy to use lodash Pick alternative with configurable and extensive schema and

## Supick creates an object/array composed of the deeply picked object properties/array of picked object properties.

### Quick start

`npm i supick`

```javascript
const pick = require("supick");

const person = {
  name: "John Doe",
  car: {
    model: "BMW X5",
    year: 2019,
    color: "black",

  },
  hobby: "music"
};

pick(person, "name, car: {model, year}"); // ==> { name: "John Doe", { car: { model: "BMW X5", year: 2019 } } }
```

## Schema format rules:

1. Schema could be string, array of strings(lodash pick style), object(mongodb projection style) or customizer function
2. You may use trailing whitespaces, newlines and carret returns - they are ignored.
3. You may enclose schema in brackets: '{a, b, c, d: {d_a, d_b}}'
4. Use commas to separate prop names on each level. Trailing comma is ignored.
5. Use colon ":" and curly brackets ("{", "}") to specify inner properties.
6. You may use supick both for objects and arrays, for example: schema "a: 1, b: 2" works this way:
- `pick({ a: 1, b: 2, c: 3 }, 'a, b')` => `{ a: 1, b: 2 }`
- `pick([{ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 }], 'a, b')` => `[{ a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1, b: 2 }]`
7. Customizer function is very flexible way to add some extra logic. Customizer function must return truthy or falsy value to determine if property should be picked. Function receives 4 arguments: `key`(property name), `value`(property value), `path`(parent properties concatenated with dot delimiter), `depth`(depth of current nested property).

## Schema examples:

1. String: `'{ a, b, c: { d, e }, f: { g: { h, i }, j } }'`.
2. Array of strings(lodash-style): `['a', 'b', 'c: { d, e }', 'f: { g: { h, i }, j }']`.
3. Object(mongodb projection-style): `{ a: true, b: true, c: { d: true, e: true }, f: { g: { h: true, i: true }, j: true } }` // "true" could be replaced to 1
4. Customizer function: 
```javascript
function (key, value, path, depth) {
    if (['a', 'b', 'c', 'e'].includes(key)) return true; // pick all properties with names a, b, c, e
    if (path.startsWith('f')) return true; // pick f property and all its nested properties
    if (depth === 0) return true; // pick all top level properties
    return false;
}
```

## Big example with nested objects and arrays:

```javascript
const person = {
    "name" : "John Doe",
    "age": 35,
    "family" : {
    	"wife" : {
            "name": "Susan",
            "age": 32
        },
        "children": [
            {
                "name": "Alex",
                "age": 5,
                "hobby": "dancing"
            },
            {
                "name": "Alice",
                "age": 3,
                "hobby": "music"
            }
        ]
    },
    "cars": [
        {
            "model": "BMW X5",
            "year": 2015
        },
        {
            "model": "Tesla Model S",
            "year": 2018
        }
    ]
};

const schema = `
{
	name,
	family: {
		wife,
		children: {
			name,
			age
		}
    },
	cars: { model }    
}`;

```

`pick(obj, schema);` will result in this =>

```javascript
{
    "name" : "John Doe",
    "family" : {
    	"wife" : { "name": "Susan", "age": 32 },
        "children": [
            { "name": "Alex", "age": 5 },
            { "name": "Alice", "age": 3 }
        ]
    },
    "cars": [
        { "model": "BMW X5" },
        { "model": "Tesla Model S" }
    ]
};
```

More examples in test file `index.test.js`