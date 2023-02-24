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

  get zeroOrMore() {
    return this.atLeast(0);
  }

  atMost(max: number) {
    return this.times(0, max);
  }

  range(from: number | string, to: number | string) {
    this.stack.push({
      type: "range",
      from,
      to,
    });

    return this;
  }

  group(builder: RegexBuilder, name?: string) {
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

  get newline() {
    this.stack.push({
      type: "newline",
    });

    return this;
  }

  anyIn(builder: RegexBuilder) {
    this.stack.push({
      type: "any-in",
      builder,
    });

    return this;
  }

  charBetween<T extends string | number>(from: T, to: T) {
    const builder = new RegexBuilder();

    builder.range(from, to);

    return this.anyIn(builder);
  }

  anyNotIn(builder: RegexBuilder) {
    this.stack.push({
      type: "any-not-in",
      builder,
    });

    return this;
  }

  oneOf(...strings: string[]) {
    const builder = new RegexBuilder().exactly(strings[0]);

    strings.slice(1).forEach((string) => {
      builder.or.exactly(string);
    });

    return this.nonCaptureGroup(builder);
  }

  anyBut(...strings: string[]) {
    const builder = new RegexBuilder().exactly(strings[0]);

    strings.slice(1).forEach((string) => {
      builder.or.exactly(string);
    });

    return this.nonCaptureGroup(
      new RegexBuilder().negativeLookahead(builder).any.zeroOrMore
    );
  }

  negativeLookahead(builder: RegexBuilder) {
    this.stack.push({
      type: "negative-lookahead",
      builder,
    });

    return this;
  }

  toString() {
    return this.build().source;
  }

  private escape(string: string) {
    return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
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

        case "newline":
          acc += "\\n";
          break;

        case "optional":
          acc += "?";
          break;

        case "range":
          acc += `${item.from}-${item.to}`;
          break;

        case "at-least":
          if (item.min === 0) {
            acc += "*";
          } else if (item.min === 1) {
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
          acc += this.escape(item.string);
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

        case "any-in":
          acc += `[${item.builder.toString()}]`;
          break;

        case "any-not-in":
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

        case "negative-lookahead":
          acc += `(?!${item.builder.toString()})`;
          break;

        default:
          const _: never = item;
          break;
      }

      return acc;
    }, "");

    const flags = [...this.modifiers].join("");

    return new RegExp(pattern, flags);
  }
}
