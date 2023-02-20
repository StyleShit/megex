import RegexBuilder from "./regex-builder";

export { default as RegexBuilder } from "./regex-builder";

export default function megex() {
  return new RegexBuilder();
}
