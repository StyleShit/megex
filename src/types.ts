import RegexBuilder from "./regex-builder";

export type Modifiers = "g" | "i" | "m";

export type StackItem =
  | { type: "starts-with" }
  | { type: "ends" }
  | { type: "digit" }
  | { type: "word" }
  | { type: "times-between"; min: number; max: number }
  | { type: "times-exact"; exact: number }
  | { type: "at-least"; min: number }
  | { type: "range"; from: string | number; to: string | number }
  | { type: "group"; builder: RegexBuilder; name?: string; capture?: boolean }
  | { type: "reference"; name: string }
  | { type: "or" }
  | { type: "any" }
  | { type: "optional" }
  | { type: "exactly"; string: string }
  | { type: "space" }
  | { type: "whitespace" }
  | { type: "newline" }
  | { type: "any-in"; builder: RegexBuilder }
  | { type: "any-not-in"; builder: RegexBuilder }
  | { type: "negative-lookahead"; builder: RegexBuilder };
