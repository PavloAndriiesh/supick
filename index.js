module.exports = function supick(data, schema) {
  // if schema is array of strings join them
  if (isArrayOfStrings(schema)) {
    schema = schema.join(",");
  }

  // if data is array of objects - pick properties recursively
  if (isArrayOfObjects(data)) {
    return data.map(el => supick(el, schema));
  }

  schema = normalizeSchemaObject(schema);
  validateArguments(data, schema);
  schema = normalizeSchemaString(schema);

  const schemaParts = [];
  if (schema.length === 1) {
    schemaParts.push(schema);
  } else {
    let openedBracketsCounter = 0;
    for (let i = 1; i < schema.length; i++) {
      if (i === schema.length - 1) {
        schemaParts.push(
          schema.slice(schemaParts.join("").length + schemaParts.length)
        );
      } else if (
        openedBracketsCounter === 0 &&
        (schema[i] === "," || i === schema.length - 1)
      ) {
        schemaParts.push(
          schema.slice(schemaParts.join("").length + schemaParts.length, i)
        );
      } else if (schema[i] === "{") {
        openedBracketsCounter++;
      } else if (schema[i] === "}") {
        openedBracketsCounter--;
      }
    }
  }

  const obj = {};
  schemaParts.forEach(prop => {
    let propName;
    let propSchema;

    if (!prop.includes(":")) {
      propName = prop;
    } else {
      propName = prop.split(":")[0];
      propSchema = prop.slice(propName.length + 1);
    }

    if (propName in data) {
      if (propSchema) {
        obj[propName] = supick(data[propName], propSchema);
      } else {
        obj[propName] = data[prop];
      }
    }
  });
  return obj;
};

function isArrayOfStrings(structure) {
  if (!Array.isArray(structure)) {
    return false;
  }
  if (structure.findIndex(el => typeof el !== "string") !== -1) {
    return false;
  }
  return true;
}

function isArrayOfObjects(structure) {
  if (!Array.isArray(structure)) {
    return false;
  }
  if (structure.findIndex(el => typeof el !== "object") !== -1) {
    return false;
  }
  return true;
}

function validateArguments(data, schema) {
  if (isArrayOfStrings(schema)) {
    schema = schema.join(",");
  }

  if (typeof schema !== "string" || !schema.length) {
    throw new Error("Invalid schema, must be not empty string");
  }
  if (typeof data !== "object" && !isArrayOfObjects(data)) {
    throw new Error("Invalid data, must be object or array of objects");
  }

  validateOpenClosedBrackets(schema);
}

function validateOpenClosedBrackets(string) {
  let stack = [];
  for (let i = 0; i < string.length; i++) {
    if (string[i] === "{") {
      stack.push(string[i]);
    } else if (string[i] === "}") {
      if (stack.length === 0) {
        throw new Error("Open/closed brackets are not matched");
      }
      stack.pop();
    }
  }
  if (stack.length) throw new Error("Open/closed brackets are not matched");
}

function normalizeSchemaObject(schema) {
  // if schema is object - transform to string and normalize
  if (typeof schema === "object") {
    return JSON.stringify(schema)
      .replace(/(:1)|(:true)/g, "") // remove "1" and "true"
      .replace(/"/g, ""); // remove quotes
  }
  return schema;
}

function normalizeSchemaString(schema) {
  // remove all whitespaces, newlines etc.
  schema = schema.replace(/\s/g, "");

  // remove brackets at start and end if present
  if (schema.startsWith("{") && schema.endsWith("}")) {
    schema = schema.slice(1, -1);
  }

  // remove comma at the end if present
  if (schema.endsWith(",")) {
    schema = schema.slice(0, -1);
  }
  return schema;
}
