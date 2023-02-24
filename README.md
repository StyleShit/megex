# megex - Magic Regex

A simple, composable and human-readable regex builder for JavaScript.

## Usage Example:

```js
import m from "megex";

// Simple name pattern.
const name = m().charBetween("a", "z").atLeast(2);

// Composing the above pattern into a bigger regex object.
const nameRegex = m()
  .startsWith.group(name, "firstName")
  .space.group(name, "lastName")
  .ends.build(); // Evaluates to: /^(?<firstName>[a-z]{2,10}) (?<lastName>[a-z]{2,10})$/

// Executing the regex.
const match = nameRegex.exec("john doe");

console.log(match.groups.firstName); // john
console.log(match.groups.lastName); // doe

// Simple email pattern.
const username = m().word.atLeastOnce;
const domain = m().anyIn(m().range("a", "z").range(0, 9)).atLeast(3);
const tld = m().oneOf("com", "net", "org");

const emailRegex = m()
  .caseInsensitive.startsWith.group(username, "username")
  .exactly("@")
  .group(domain, "domain")
  .exactly(".")
  .group(tld, "tld")
  .ends.build(); // Evaluates to: /^(?<username>\w+)@(?<domain>[a-z0-9]{3,})\.(?<tld>(?:com|net|org))$/i
```
