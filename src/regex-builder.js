export default class RegexBuilder {
  stack = [];
  flags = new Set();

  get global() {
    this.flags.add("g");

    return this;
  }

  get caseInsensitive() {
    this.flags.add("i");

    return this;
  }

  get multiline() {
    this.flags.add("m");

    return this;
  }

  get startsWith() {
    this.stack.push({
      type: "starts-with",
    });

    return this;
  }

  get ends() {
    this.stack.push({
      type: "ends",
    });

    return this;
  }

  get digit() {
    this.stack.push({
      type: "digit",
    });

    return this;
  }

  get word() {
    this.stack.push({
      type: "word",
    });

    return this;
  }

  times(min, max) {
    if (max) {
      this.stack.push({
        type: "times-between",
        min,
        max,
      });
    } else {
      this.stack.push({
        type: "times-exact",
        exact: min,
      });
    }

    return this;
  }

  atLeast(min) {
    this.stack.push({
      type: "at-least",
      min,
    });

    return this;
  }

  get atLeastOnce() {
    return this.atLeast(1);
  }

  atMost(max) {
    return this.times(0, max);
  }

  between(from, to) {
    this.stack.push({
      type: "between",
      from,
      to,
    });

    return this;
  }

  group(builder) {
    this.stack.push({
      type: "group",
      builder,
    });

    return this;
  }

  groupAs(name, builder) {
    this.stack.push({
      type: "group",
      builder,
      name,
    });

    return this;
  }

  semanticGroup(builder) {
    this.stack.push({
      type: "group",
      builder,
      semantic: true,
    });

    return this;
  }

  referenceTo(name) {
    this.stack.push({
      type: "reference",
      name,
    });

    return this;
  }

  get or() {
    this.stack.push({
      type: "or",
    });

    return this;
  }

  get any() {
    this.stack.push({
      type: "any",
    });

    return this;
  }

  get optional() {
    this.stack.push({
      type: "optional",
    });

    return this;
  }

  exactly(string) {
    this.stack.push({
      type: "exactly",
      string,
    });

    return this;
  }

  get space() {
    this.stack.push({
      type: "space",
    });

    return this;
  }

  get whitespace() {
    this.stack.push({
      type: "whitespace",
    });

    return this;
  }

  charIn(builder) {
    this.stack.push({
      type: "char-in",
      builder,
    });

    return this;
  }

  charNotIn(builder) {
    this.stack.push({
      type: "char-not-in",
      builder,
    });

    return this;
  }

  toString() {
    return this.build().source;
  }

  build() {
    const pattern = this.stack.reduce((acc, item) => {
      switch (item.type) {
        case "starts-with":
          acc += "^";
          break;

        case "ends":
          acc += "$";
          break;

        case "digit":
          acc += "\\d";
          break;

        case "word":
          acc += "\\w";
          break;

        case "space":
          acc += " ";
          break;

        case "whitespace":
          acc += "\\s";
          break;

        case "optional":
          acc += "?";
          break;

        case "between":
          acc += `${item.from}-${item.to}`;
          break;

        case "at-least":
          if (item.min === 1) {
            acc += "+";
          } else {
            acc += `{${item.min},}`;
          }
          break;

        case "times-exact":
          acc += `{${item.exact}}`;
          break;

        case "times-between":
          acc += `{${item.min},${item.max}}`;
          break;

        case "exactly":
          const escaped = item.string.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");

          acc += escaped;
          break;

        case "group":
          if (item.name) {
            acc += `(?<${item.name}>${item.builder.toString()})`;
          } else if (item.semantic) {
            acc += `(?:${item.builder.toString()})`;
          } else {
            acc += `(${item.builder.toString()})`;
          }
          break;

        case "char-in":
          acc += `[${item.builder.toString()}]`;
          break;

        case "char-not-in":
          acc += `[^${item.builder.toString()}]`;
          break;

        case "reference":
          acc += `\\k<${item.name}>`;
          break;

        case "or":
          acc += "|";
          break;

        case "any":
          acc += ".";
          break;

        default:
          break;
      }

      return acc;
    }, "");

    const flags = [...this.flags].reduce((acc, m) => acc + m, "");

    return new RegExp(pattern, flags);
  }
}
