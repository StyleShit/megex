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
  | { type: "between"; from: string | number; to: string | number }
  | { type: "group"; builder: RegexBuilder; name?: string; capture?: boolean }
  | { type: "reference"; name: string }
  | { type: "or" }
  | { type: "any" }
  | { type: "optional" }
  | { type: "exactly"; string: string }
  | { type: "space" }
  | { type: "whitespace" }
  | { type: "char-in"; builder: RegexBuilder }
  | { type: "char-not-in"; builder: RegexBuilder };
