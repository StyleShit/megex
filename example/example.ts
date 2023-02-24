import m from "../src";

console.log("Simple first and last name");

console.log(
  m()
    .startsWith.group(m().charBetween("a", "z").atLeast(2), "firstName")
    .space.group(m().charBetween("a", "z").atLeast(2), "lastName")
    .ends.build()
);

console.log("Composed first and last name");

const name = m().charBetween("a", "z").atLeast(2);

console.log(
  m()
    .startsWith.group(name, "firstName")
    .space.group(name, "lastName")
    .ends.build()
);

console.log("Simple email");

console.log(
  m()
    .startsWith.group(m().word.atLeastOnce, "username")
    .exactly("@")
    .group(m().word.atLeastOnce, "domain")
    .exactly(".")
    .group(m().word.atLeastOnce, "tld")
    .ends.build()
);

console.log("Doesn't make sense but stretches the limits");

console.log(
  m()
    .exactly("test")
    .newline.anyBut("asd", "zxc", "qwe")
    .digit.atLeastOnce.ends.build()
);

console.log(
  m()
    .global.caseInsensitive.multiline.group(
      m().startsWith.digit.times(3),
      "first"
    )
    .or.group(m().word.times(1, 10).digit.anyNotIn(m().digit).ends, "second")
    .exactly("test_\\w\\s-")
    .referenceTo("first")
    .nonCaptureGroup(
      m()
        .digit.atMost(5)
        .any.times(3)
        .anyIn(m().digit.word.space)
        .anyNotIn(m().range("s", "u"))
        .times(5)
    )
    .optional.build()
);
