import megex from "../src";

const name = megex().charIn(megex().between("a", "z")).atLeast(2);

console.log("Simple first and last name");

console.log(
  megex()
    .startsWith()
    .groupAs("firstName", name)
    .space()
    .groupAs("lastName", name)
    .ends()
    .build()
);

console.log("Doesn't make sense but stretches the limits");

console.log(
  megex()
    .global()
    .caseInsensitive()
    .multiline()
    .groupAs("first", megex().startsWith().digit().times(3))
    .or()
    .groupAs(
      "second",
      megex().char().times(1, 10).digit().charNotIn(megex().digit()).ends()
    )
    .exactly("test_\\w\\s-")
    .referenceTo("first")
    .semanticGroup(
      megex()
        .digit()
        .atMost(5)
        .any()
        .times(3)
        .charIn(megex().digit().char().space())
        .charNotIn(megex().between("s", "u"))
        .times(5)
    )
    .optional()
    .build()
);
