# megex - Magic Regex

A simple, composable and human-readable regex builder for JavaScript.

## Usage Example:

```js
import megex from "megex";

// Simple name pattern.
const name = megex().charIn(megex().between("a", "z")).atLeast(2);

// Composing the above pattern into a bigger regex object.
const regex = megex()
  .startsWith.groupAs("firstName", name)
  .space.groupAs("lastName", name)
  .ends.build(); // Evaluates to: /^(?<firstName>[a-z]{2,}) (?<lastName>[a-z]{2,})$/

// Executing the regex.
const match = regex.exec("john doe");

console.log(match.groups.firstName); // john
console.log(match.groups.lastName); // doe
```

## TODO:

- [ ] Improve the API
  - [ ] Add more methods
  - [ ] Try to find a more fluent API
- [ ] Add tests
- [ ] Use TypeScript
- [ ] Add more examples
