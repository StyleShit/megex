import megex from "../src";

console.log("Simple first and last name");

console.log(
  megex()
    .startsWith.groupAs(
      "firstName",
      megex().charIn(megex().between("a", "z").atLeast(2))
    )
    .space.groupAs(
      "lastName",
      megex().charIn(megex().between("a", "z").atLeast(2))
    )
    .ends.build()
);

console.log("Composed first and last name");

const name = megex().charIn(megex().between("a", "z")).atLeast(2);

console.log(
  megex()
    .startsWith.groupAs("firstName", name)
    .space.groupAs("lastName", name)
    .ends.build()
);

console.log("Doesn't make sense but stretches the limits");

console.log(
  megex()
    .global.caseInsensitive.multiline.groupAs(
      "first",
      megex().startsWith.digit.times(3)
    )
    .or.groupAs(
      "second",
      megex().word.times(1, 10).digit.charNotIn(megex().digit).ends
    )
    .exactly("test_\\w\\s-")
    .referenceTo("first")
    .semanticGroup(
      megex()
        .digit.atMost(5)
        .any.times(3)
        .charIn(megex().digit.word.space)
        .charNotIn(megex().between("s", "u"))
        .times(5)
    )
    .optional.build()
);
