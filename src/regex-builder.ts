import { Modifiers, StackItem } from "./types";

export default class RegexBuilder {
  private stack: StackItem[] = [];
  private modifiers = new Set<Modifiers>();

  get global() {
    this.modifiers.add("g");

    return this;
  }

  get caseInsensitive() {
    this.modifiers.add("i");

    return this;
  }

  get multiline() {
    this.modifiers.add("m");

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

  times(min: number, max?: number) {
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

  atLeast(min: number) {
    this.stack.push({
      type: "at-least",
      min,
    });

    return this;
  }

  get atLeastOnce() {
    return this.atLeast(1);
  }

  atMost(max: number) {
    return this.times(0, max);
  }

  between(from: number | string, to: number | string) {
    this.stack.push({
      type: "between",
      from,
      to,
    });

    return this;
  }

  group(builder: RegexBuilder) {
    this.stack.push({
      type: "group",
      builder,
    });

    return this;
  }

  groupAs(name: string, builder: RegexBuilder) {
    this.stack.push({
      type: "group",
      builder,
      name,
    });

    return this;
  }

  nonCaptureGroup(builder: RegexBuilder) {
    this.stack.push({
      type: "group",
      builder,
      capture: false,
    });

    return this;
  }

  referenceTo(name: string) {
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

  exactly(string: string) {
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

  charIn(builder: RegexBuilder) {
    this.stack.push({
      type: "char-in",
      builder,
    });

    return this;
  }

  charBetween<T extends string | number>(from: T, to: T) {
    const builder = new RegexBuilder();

    builder.between(from, to);

    return this.charIn(builder);
  }

  charNotIn(builder: RegexBuilder) {
    this.stack.push({
      type: "char-not-in",
      builder,
    });

    return this;
  }

  anyOf(...strings: string[]) {
    const builder = new RegexBuilder();

    strings.forEach((string, index) => {
      if (index > 0) {
        builder.or;
      }

      builder.exactly(string);
    });

    return this.charIn(builder);
  }

  noneOf(...strings: string[]) {
    const builder = new RegexBuilder();

    strings.forEach((string, index) => {
      if (index > 0) {
        builder.or;
      }

      builder.exactly(string);
    });

    return this.charNotIn(builder);
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
          } else if (item.capture) {
            acc += `(${item.builder.toString()})`;
          } else {
            acc += `(?:${item.builder.toString()})`;
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
          const _: never = item;
          break;
      }

      return acc;
    }, "");

    const flags = [...this.modifiers].reduce((acc, m) => acc + m, "");

    return new RegExp(pattern, flags);
  }
}
