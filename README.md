# Supick (super pick)

Empowered but easy to use lodash Pick alternative with configurable and extensive schema and

## Supick creates an object/array composed of the deeply picked object properties/array of picked object properties.

### Quick start

`npm i supick`

```javascript
const pick = require("supick");

const obj = {
  a: 1,
  b: {
    c: 2,
    d: 3,
    e: 4
  }
};

pick(obj, "a, b: {c, e}"); // ==> { a: 1, { b: { c: 2, e: 4}}}
```

## Schema format rules:

1. Schema could be string, array of strings(lodash pick style) or object(mongodb projection style)
2. You may use trailing whitespaces, newlines and carret returns - they are ignored.
3. You may enclose schema in brackets: '{a, b, c, d: {d_a, d_b}}'
4. Use commas to separate prop names on each level. Trailing comma is ignored.
5. Use colon ":" and curly brackets ("{", "}") to specify inner properties.
6. You may use supick both for objects and arrays, for example: schema "a: 1, b: 2" works this way:

- `pick({a: 1, b: 2, c: 3}, 'a, b')` => `{a: 1, b: 2}`
- `pick([{a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3}], 'a, b')` => `[{a: 1, b: 2}, {a: 1, b: 2}, {a: 1, b: 2}]`

### Schema examples:

1. String: `'{ a, b, c: { d, e }, f: { g: { h, i }, j } }'`.
2. Array of strings(lodash-style): `['a', 'b', 'c: { d, e }', 'f: { g: { h, i }, j }']`.
3. Object(mongodb projection-style): `{a: true, b: true, c: {d: true, e: true}, f: {g : {h: true, i: true}, jb: true}}` // "true" could be replaced to 1

### Big example with nested objects and arrays:

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
