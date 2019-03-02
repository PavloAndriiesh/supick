const supick = require("./index.js");

test("picks 'a' from object with a and b properties", () => {
  const input = { a: 1, b: 2 };
  const schema = "a";
  const output = { a: 1 };
  expect(supick(input, schema)).toStrictEqual(output);
});

test("picks 'a' and 'b' from object with 'a','b','c' properties", () => {
  const input = { a: 1, b: 2, c: 3 };
  const schema = "a, b";
  const output = { a: 1, b: 2 };
  expect(supick(input, schema)).toStrictEqual(output);
});

test("picks 'a' and 'b' from array of objects with 'a','b','c' properties", () => {
  const input = [
    { a: 1, b: 2, c: 3 },
    { a: 4, b: 5, c: 6 },
    { a: 7, b: 8, c: 9 }
  ];
  const schema = "a, b";
  const output = [{ a: 1, b: 2 }, { a: 4, b: 5 }, { a: 7, b: 8 }];
  expect(supick(input, schema)).toStrictEqual(output);
});

test("picks 'a' and nested 'c' and 'e' properties in 'b'", () => {
  const input = { a: 1, b: { c: 2, d: 3, e: 4 } };
  const schema = "a, b: {c, e}";
  const output = { a: 1, b: { c: 2, e: 4 } };

  expect(supick(input, schema)).toStrictEqual(output);
});

const personInput = {
  name: "John Doe",
  age: 35,
  family: {
    wife: { name: "Susan", age: 32 },
    children: [
      { name: "Alex", age: 5, hobby: "dancing" },
      { name: "Alice", age: 3, hobby: "music" }
    ]
  },
  cars: [
    { model: "BMW X5", year: 2015 },
    { model: "Tesla Model S", year: 2018 }
  ]
};
const personOutput = {
  name: "John Doe",
  family: {
    wife: { name: "Susan", age: 32 },
    children: [{ name: "Alex", age: 5 }, { name: "Alice", age: 3 }]
  },
  cars: [{ model: "BMW X5" }, { model: "Tesla Model S" }]
};

test("picks properties from nested objects and arrays using string schema", () => {
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

  expect(supick(personInput, schema)).toStrictEqual(personOutput);
});

test("picks properties from nested objects and arrays using array schema (lodash style)", () => {
  const schema = [
    "name",
    "family:{wife, children: {name, age}}",
    "cars:{model}"
  ];
  expect(supick(personInput, schema)).toStrictEqual(personOutput);
});

test("picks properties from nested objects and arrays using object schema (mongodb projection-style)", () => {
  const schema = {
    name: true,
    family: {
      wife: true,
      children: {
        name: 1,
        age: 1
      }
    },
    cars: { model: 1 }
  };

  expect(supick(personInput, schema)).toStrictEqual(personOutput);
});
